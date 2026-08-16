package com.example.order_service.listener;

import com.example.order_service.config.RabbitMQConstants;
import com.example.order_service.dto.PaymentSuccessEvent;
import com.example.order_service.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class PaymentSuccessListener {

    private final OrderService orderService;

    @RabbitListener(queues = RabbitMQConstants.ORDER_PAYMENT_SUCCESS_QUEUE)
    public void handlePaymentSuccess(PaymentSuccessEvent event) {
        log.info("Received payment.success event for Order ID: {} with Payment ID: {}", event.getOrderId(), event.getPaymentId());
        try {
            orderService.updatePaymentInfo(event.getOrderId(), event.getPaymentId(), event.getPaymentStatus());
            log.info("Order payment info updated successfully. Order ID: {}", event.getOrderId());
        } catch (Exception e) {
            log.error("Failed to update payment info for Order ID: {}. Error: {}", event.getOrderId(), e.getMessage(), e);
        }
    }
}
