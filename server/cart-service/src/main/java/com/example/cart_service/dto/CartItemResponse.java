package com.example.cart_service.dto;

import com.example.cart_service.entity.MenuItemSnapshot;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItemResponse {

    private MenuItemSnapshot menuItem;

    private Integer quantity;
}