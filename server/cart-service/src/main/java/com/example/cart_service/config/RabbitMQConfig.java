package com.example.cart_service.config;

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
    public Queue cartOrderCreatedQueue() {
        return new Queue(RabbitMQConstants.CART_ORDER_CREATED_QUEUE);
    }

    @Bean
    public Binding bindingCartOrderCreated(Queue cartOrderCreatedQueue, TopicExchange foodExpressExchange) {
        return BindingBuilder.bind(cartOrderCreatedQueue)
                .to(foodExpressExchange)
                .with(RabbitMQConstants.ORDER_CREATED_ROUTING_KEY);
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
