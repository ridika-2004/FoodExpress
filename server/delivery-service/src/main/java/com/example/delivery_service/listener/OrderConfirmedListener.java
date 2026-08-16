package com.example.delivery_service.listener;

import com.example.delivery_service.config.RabbitMQConstants;
import com.example.delivery_service.dto.OrderConfirmedEvent;
import com.example.delivery_service.entity.Order;
import com.example.delivery_service.entity.OrderItem;
import com.example.delivery_service.service.DeliveryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class OrderConfirmedListener {

    private final DeliveryService deliveryService;

    @RabbitListener(queues = RabbitMQConstants.DELIVERY_ORDER_CONFIRMED_QUEUE)
    public void handleOrderConfirmed(OrderConfirmedEvent event) {
        log.info("Received order.confirmed event for Order ID: {}", event.getOrderId());
        try {
            // Check if delivery record already exists to prevent duplicate (Idempotency)
            if (deliveryService.orderExists(event.getOrderId())) {
                log.warn("Delivery record already exists for Order ID: {}. Ignoring event.", event.getOrderId());
                return;
            }

            Order deliveryOrder = Order.builder()
                    .id(event.getOrderId())
                    .restaurantId(event.getRestaurantId())
                    .restaurantName(event.getRestaurantName())
                    .total(event.getTotal())
                    .status("confirmed")
                    .deliveryAddress(event.getDeliveryAddress())
                    .paymentMethod(event.getPaymentMethod())
                    .estimatedDelivery("30 min") // Default
                    .items(event.getItems().stream().map(item -> OrderItem.builder()
                            .menuItemId(item.getMenuItemId())
                            .name(item.getName())
                            .price(item.getPrice())
                            .quantity(item.getQuantity())
                            .image(item.getImage())
                            .build()).collect(Collectors.toList()))
                    .build();

            deliveryService.createOrder(deliveryOrder);
            log.info("Delivery tracking successfully created for Order ID: {}", event.getOrderId());
        } catch (Exception e) {
            log.error("Failed to process order.confirmed event for Order ID: {}. Error: {}", event.getOrderId(), e.getMessage(), e);
        }
    }
}
