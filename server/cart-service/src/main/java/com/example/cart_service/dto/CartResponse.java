package com.example.cart_service.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartResponse {

    private String id;

    private String userId;

    private String restaurantId;

    private String restaurantName;

    private List<CartItemResponse> items;

}