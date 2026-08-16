package com.example.cart_service.config;

public class RabbitMQConstants {
    public static final String EXCHANGE = "foodexpress.exchange";
    public static final String ORDER_CREATED_ROUTING_KEY = "order.created";
    public static final String CART_ORDER_CREATED_QUEUE = "cart.order.created.queue";
}
