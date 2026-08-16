package com.example.order_service.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.order_service.entity.Order;

public interface OrderRepository extends MongoRepository<Order, String> {

    List<Order> findByUserId(String userId);

    List<Order> findByRestaurantId(String restaurantId);
}