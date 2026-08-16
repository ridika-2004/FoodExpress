package com.example.order_service.config;

public class RabbitMQConstants {
    public static final String EXCHANGE = "foodexpress.exchange";
    public static final String ORDER_CONFIRMED_ROUTING_KEY = "order.confirmed";
    public static final String DELIVERY_STATUS_ROUTING_KEY = "delivery.status.changed";
    public static final String ORDER_DELIVERY_STATUS_QUEUE = "order.delivery.status.queue";

    public static final String PAYMENT_SUCCESS_ROUTING_KEY = "payment.success";
    public static final String ORDER_CREATED_ROUTING_KEY = "order.created";

    public static final String ORDER_PAYMENT_SUCCESS_QUEUE = "order.payment.success.queue";
    public static final String CART_ORDER_CREATED_QUEUE = "cart.order.created.queue";
}
