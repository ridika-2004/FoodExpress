package com.example.order_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemRequest {

    private String menuItemId;

    private String menuItemName;

    private String menuItemImage;

    private Double menuItemPrice;

    private Integer quantity;
}
