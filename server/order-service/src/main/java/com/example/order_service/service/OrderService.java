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

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;

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

        Order order = Order.builder()
                .userId(request.getUserId())
                .customerName(request.getCustomerName())
                .phone(request.getPhone())
                .deliveryAddress(request.getDeliveryAddress())
                .restaurantId(request.getRestaurantId())
                .restaurantName(request.getRestaurantName())
                .items(items)
                .itemCount(request.getItemCount())
                .subtotal(request.getSubtotal())
                .deliveryFee(request.getDeliveryFee())
                .total(request.getTotal())
                .status(OrderStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();

        Order savedOrder = orderRepository.save(order);

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

        return mapToResponse(orderRepository.save(order));
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
                .createdAt(order.getCreatedAt())
                .build();
    }
}