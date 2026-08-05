package com.example.delivery_service.repository;

import com.example.delivery_service.entity.Order;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface OrderRepository extends MongoRepository<Order, String> {

    List<Order> findByStatus(String status);

    List<Order> findByRestaurantId(String restaurantId);
}
