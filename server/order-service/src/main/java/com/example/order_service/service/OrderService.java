package com.example.order_service.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.order_service.dto.OrderItemResponse;
import com.example.order_service.dto.OrderRequest;
import com.example.order_service.dto.OrderResponse;
import com.example.order_service.entity.MenuItemSnapshot;
import com.example.order_service.entity.Order;
import com.example.order_service.entity.OrderItem;
import com.example.order_service.entity.OrderStatus;
import com.example.order_service.repository.OrderRepository;
import com.example.order_service.config.RabbitMQConstants;
import com.example.order_service.dto.OrderConfirmedEvent;
import com.example.order_service.dto.OrderItemEvent;
import com.example.order_service.dto.OrderCreatedEvent;
import com.example.order_service.dto.PaymentSuccessEvent;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final RabbitTemplate rabbitTemplate;

    private static final double DELIVERY_FEE = 60.0;
    private static final double FREE_DELIVERY_THRESHOLD = 500.0;

    // Place Order
    public OrderResponse placeOrder(OrderRequest request) {

        List<OrderItem> items = request.getItems()
                .stream()
                .map(item -> OrderItem.builder()
                        .menuItem(
                                MenuItemSnapshot.builder()
                                        .id(item.getMenuItemId())
                                        .name(item.getMenuItemName())
                                        .image(item.getMenuItemImage())
                                        .price(item.getMenuItemPrice())
                                        .build())
                        .quantity(item.getQuantity())
                        .build())
                .toList();

        // Calculate item count and subtotal
        int itemCount = 0;
        double subtotal = 0.0;

        for (OrderItem item : items) {

            itemCount += item.getQuantity();

            subtotal += item.getMenuItem().getPrice()
                    * item.getQuantity();
        }

        // Calculate delivery fee
        double deliveryFee;

        if (subtotal == 0 || subtotal >= FREE_DELIVERY_THRESHOLD) {
            deliveryFee = 0.0;
        } else {
            deliveryFee = DELIVERY_FEE;
        }

        // Calculate final total
        double total = subtotal + deliveryFee;

        Order order = Order.builder()
                .userId(request.getUserId())
                .customerName(request.getCustomerName())
                .phone(request.getPhone())
                .deliveryAddress(request.getDeliveryAddress())
                .restaurantId(request.getRestaurantId())
                .restaurantName(request.getRestaurantName())
                .items(items)
                .itemCount(itemCount)
                .subtotal(subtotal)
                .deliveryFee(deliveryFee)
                .total(total)
                .status(OrderStatus.PENDING)
                .paymentStatus("PENDING")
                .createdAt(LocalDateTime.now())
                .build();

        Order savedOrder = orderRepository.save(order);

        try {
            OrderCreatedEvent event = OrderCreatedEvent.builder()
                    .orderId(savedOrder.getId())
                    .userId(savedOrder.getUserId())
                    .build();
            rabbitTemplate.convertAndSend(
                    RabbitMQConstants.EXCHANGE,
                    RabbitMQConstants.ORDER_CREATED_ROUTING_KEY,
                    event
            );
            System.out.println("Published order.created event for Order ID: " + savedOrder.getId() + ", User ID: " + savedOrder.getUserId());
        } catch (Exception e) {
            System.err.println("Failed to publish order.created event: " + e.getMessage());
        }

        return mapToResponse(savedOrder);
    }

    // Get Order by ID
    public OrderResponse getOrderById(String orderId) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        return mapToResponse(order);
    }

    // Get Orders by User
    public List<OrderResponse> getOrdersByUser(String userId) {

        return orderRepository.findByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // Get Orders by Restaurant
    public List<OrderResponse> getOrdersByRestaurant(String restaurantId) {

        return orderRepository.findByRestaurantId(restaurantId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // Update Order Status
    public OrderResponse updateStatus(String orderId, OrderStatus status) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(status);

        Order savedOrder = orderRepository.save(order);

        if (status == OrderStatus.CONFIRMED) {
            try {
                OrderConfirmedEvent event = OrderConfirmedEvent.builder()
                        .orderId(savedOrder.getId())
                        .restaurantId(savedOrder.getRestaurantId())
                        .restaurantName(savedOrder.getRestaurantName())
                        .total(savedOrder.getTotal())
                        .deliveryAddress(savedOrder.getDeliveryAddress())
                        .paymentMethod("COD") // default
                        .status("confirmed")
                        .items(savedOrder.getItems().stream().map(item -> OrderItemEvent.builder()
                                .menuItemId(item.getMenuItem().getId())
                                .name(item.getMenuItem().getName())
                                .price(item.getMenuItem().getPrice())
                                .quantity(item.getQuantity())
                                .image(item.getMenuItem().getImage())
                                .build()).toList())
                        .build();

                rabbitTemplate.convertAndSend(
                        RabbitMQConstants.EXCHANGE,
                        RabbitMQConstants.ORDER_CONFIRMED_ROUTING_KEY,
                        event
                );
                System.out.println("Published order.confirmed event for Order ID: " + savedOrder.getId());
            } catch (Exception e) {
                System.err.println("Failed to publish order.confirmed event: " + e.getMessage());
            }
        }

        return mapToResponse(savedOrder);
    }

    // Synchronize Order Status (from Delivery Service RabbitMQ events)
    public void syncStatus(String orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));
        order.setStatus(status);
        orderRepository.save(order);
    }

    // Update Payment Information (from Payment Service RabbitMQ events)
    public void updatePaymentInfo(String orderId, String paymentId, String paymentStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));
        order.setPaymentId(paymentId);
        order.setPaymentStatus(paymentStatus);
        orderRepository.save(order);
    }

    // -------------------- Helper Method --------------------

    private OrderResponse mapToResponse(Order order) {

        List<OrderItemResponse> items = order.getItems()
                .stream()
                .map(item -> OrderItemResponse.builder()
                        .menuItem(item.getMenuItem())
                        .quantity(item.getQuantity())
                        .build())
                .toList();

        return OrderResponse.builder()
                .id(order.getId())
                .userId(order.getUserId())
                .customerName(order.getCustomerName())
                .phone(order.getPhone())
                .deliveryAddress(order.getDeliveryAddress())
                .restaurantId(order.getRestaurantId())
                .restaurantName(order.getRestaurantName())
                .items(items)
                .itemCount(order.getItemCount())
                .subtotal(order.getSubtotal())
                .deliveryFee(order.getDeliveryFee())
                .total(order.getTotal())
                .status(order.getStatus())
                .paymentId(order.getPaymentId())
                .paymentStatus(order.getPaymentStatus())
                .createdAt(order.getCreatedAt())
                .build();
    }
}