package com.example.delivery_service.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderConfirmedEvent {
    private String orderId;
    private String restaurantId;
    private String restaurantName;
    private List<OrderItemEvent> items;
    private double total;
    private String deliveryAddress;
    private String paymentMethod;
    private String status;
}
