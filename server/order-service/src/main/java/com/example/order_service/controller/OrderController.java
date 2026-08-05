package com.example.order_service.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.example.order_service.dto.OrderRequest;
import com.example.order_service.dto.OrderResponse;
import com.example.order_service.entity.OrderStatus;
import com.example.order_service.service.OrderService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // Checkout / Place Order
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse placeOrder(@RequestBody OrderRequest request) {
        return orderService.placeOrder(request);
    }

    // Get Order by ID
    @GetMapping("/{orderId}")
    public OrderResponse getOrder(@PathVariable String orderId) {
        return orderService.getOrderById(orderId);
    }

    // Get Orders of a User
    @GetMapping("/user/{userId}")
    public List<OrderResponse> getUserOrders(@PathVariable String userId) {
        return orderService.getOrdersByUser(userId);
    }

    // Get Orders of a Restaurant
    @GetMapping("/restaurant/{restaurantId}")
    public List<OrderResponse> getRestaurantOrders(@PathVariable String restaurantId) {
        return orderService.getOrdersByRestaurant(restaurantId);
    }

    // Update Order Status
    @PutMapping("/{orderId}/status")
    public OrderResponse updateStatus(
            @PathVariable String orderId,
            @RequestParam OrderStatus status) {

        return orderService.updateStatus(orderId, status);
    }
}