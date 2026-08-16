package com.example.order_service.entity;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "orders")
public class Order {

    @Id
    private String id;

    private String userId;

    private String restaurantId;

    private String restaurantName;

    private String customerName;

    private String deliveryAddress;

    private String phone;

    private List<OrderItem> items;

    private Integer itemCount;

    private Double subtotal;

    private Double deliveryFee;

    private Double total;

    private OrderStatus status;

    private String paymentId;

    private String paymentStatus;

    private LocalDateTime createdAt;
}