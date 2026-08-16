package com.example.order_service.listener;

import com.example.order_service.config.RabbitMQConstants;
import com.example.order_service.dto.DeliveryStatusChangedEvent;
import com.example.order_service.entity.OrderStatus;
import com.example.order_service.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DeliveryStatusListener {

    private final OrderService orderService;

    @RabbitListener(queues = RabbitMQConstants.ORDER_DELIVERY_STATUS_QUEUE)
    public void handleDeliveryStatusChanged(DeliveryStatusChangedEvent event) {
        log.info("Received delivery.status.changed event for Order ID: {} with status: {}", event.getOrderId(), event.getStatus());
        try {
            String deliveryStatus = event.getStatus();
            OrderStatus orderStatus = null;

            if ("out_for_delivery".equalsIgnoreCase(deliveryStatus)) {
                orderStatus = OrderStatus.OUT_FOR_DELIVERY;
            } else if ("delivered".equalsIgnoreCase(deliveryStatus)) {
                orderStatus = OrderStatus.DELIVERED;
            } else if ("preparing".equalsIgnoreCase(deliveryStatus)) {
                orderStatus = OrderStatus.PREPARING;
            } else if ("confirmed".equalsIgnoreCase(deliveryStatus)) {
                orderStatus = OrderStatus.CONFIRMED;
            } else if ("pending".equalsIgnoreCase(deliveryStatus)) {
                orderStatus = OrderStatus.PENDING;
            } else if ("cancelled".equalsIgnoreCase(deliveryStatus)) {
                orderStatus = OrderStatus.CANCELLED;
            }

            if (orderStatus != null) {
                orderService.syncStatus(event.getOrderId(), orderStatus);
                log.info("Order delivery status synchronized. Order ID: {}, Status: {}", event.getOrderId(), orderStatus);
            } else {
                log.warn("Unknown/unsupported delivery status received: {}", deliveryStatus);
            }
        } catch (Exception e) {
            log.error("Failed to synchronize order status for Order ID: {}. Error: {}", event.getOrderId(), e.getMessage(), e);
        }
    }
}
