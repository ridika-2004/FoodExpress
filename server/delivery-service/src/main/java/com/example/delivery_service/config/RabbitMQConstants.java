package com.example.delivery_service.config;

public class RabbitMQConstants {
    public static final String EXCHANGE = "foodexpress.exchange";
    public static final String ORDER_CONFIRMED_ROUTING_KEY = "order.confirmed";
    public static final String DELIVERY_STATUS_ROUTING_KEY = "delivery.status.changed";
    public static final String DELIVERY_ORDER_CONFIRMED_QUEUE = "delivery.order.confirmed.queue";
}
