package com.example.order_service.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.example.order_service.entity.OrderStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {

    private String id;

    private String userId;

    private String customerName;

    private String phone;

    private String deliveryAddress;

    private String restaurantId;

    private String restaurantName;

    private List<OrderItemResponse> items;

    private Integer itemCount;

    private Double subtotal;

    private Double deliveryFee;

    private Double total;

    private OrderStatus status;

    private LocalDateTime createdAt;
}