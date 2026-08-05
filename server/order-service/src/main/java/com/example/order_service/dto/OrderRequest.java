package com.example.order_service.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequest {

    private String userId;

    private String customerName;

    private String phone;

    private String deliveryAddress;

    private String restaurantId;

    private String restaurantName;

    private List<OrderItemRequest> items;

    private Integer itemCount;

    private Double subtotal;

    private Double deliveryFee;

    private Double total;
}