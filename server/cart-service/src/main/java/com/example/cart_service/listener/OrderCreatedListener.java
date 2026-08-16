package com.example.cart_service.listener;

import com.example.cart_service.config.RabbitMQConstants;
import com.example.cart_service.dto.OrderCreatedEvent;
import com.example.cart_service.service.CartService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class OrderCreatedListener {

    private final CartService cartService;

    @RabbitListener(queues = RabbitMQConstants.CART_ORDER_CREATED_QUEUE)
    public void handleOrderCreated(OrderCreatedEvent event) {
        log.info("Received order.created event for User ID: {}, Order ID: {}", event.getUserId(), event.getOrderId());
        try {
            cartService.clearCart(event.getUserId());
            log.info("Cleared cart successfully for User ID: {}", event.getUserId());
        } catch (Exception e) {
            log.warn("Failed to clear cart for User ID: {} (it might already be cleared or doesn't exist). Error: {}", event.getUserId(), e.getMessage());
        }
    }
}
