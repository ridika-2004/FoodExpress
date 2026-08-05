package com.example.order_service.dto;

import com.example.order_service.entity.MenuItemSnapshot;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemResponse {

    private MenuItemSnapshot menuItem;

    private Integer quantity;
}
