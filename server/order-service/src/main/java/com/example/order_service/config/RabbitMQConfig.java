package com.example.order_service.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.support.converter.DefaultJackson2JavaTypeMapper;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    @Bean
    public TopicExchange foodExpressExchange() {
        return new TopicExchange(RabbitMQConstants.EXCHANGE);
    }

    @Bean
    public Queue orderDeliveryStatusQueue() {
        return new Queue(RabbitMQConstants.ORDER_DELIVERY_STATUS_QUEUE);
    }

    @Bean
    public Binding bindingOrderDeliveryStatus(Queue orderDeliveryStatusQueue, TopicExchange foodExpressExchange) {
        return BindingBuilder.bind(orderDeliveryStatusQueue)
                .to(foodExpressExchange)
                .with(RabbitMQConstants.DELIVERY_STATUS_ROUTING_KEY);
    }

    @Bean
    public Queue orderPaymentSuccessQueue() {
        return new Queue(RabbitMQConstants.ORDER_PAYMENT_SUCCESS_QUEUE);
    }

    @Bean
    public Binding bindingOrderPaymentSuccess(Queue orderPaymentSuccessQueue, TopicExchange foodExpressExchange) {
        return BindingBuilder.bind(orderPaymentSuccessQueue)
                .to(foodExpressExchange)
                .with(RabbitMQConstants.PAYMENT_SUCCESS_ROUTING_KEY);
    }

    @Bean
    public Jackson2JsonMessageConverter jackson2JsonMessageConverter() {
        Jackson2JsonMessageConverter converter = new Jackson2JsonMessageConverter();
        DefaultJackson2JavaTypeMapper typeMapper = new DefaultJackson2JavaTypeMapper();
        typeMapper.setTrustedPackages("*");
        converter.setClassMapper(typeMapper);
        return converter;
    }
}
