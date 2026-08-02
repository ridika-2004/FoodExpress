package com.example.cart_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartRequest {

    private String userId;

    private String restaurantId;

    private String restaurantName;

    private String menuItemId;

    private String menuItemName;

    private String menuItemImage;

    private Double menuItemPrice;

    private Integer quantity;
}