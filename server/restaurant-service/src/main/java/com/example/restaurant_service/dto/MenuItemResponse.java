package com.example.restaurant_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MenuItemResponse {
    private String menuItemId;
    private String restaurantId;
    private String name;
    private Double price;
    private String category;
    private String description;
    private String image;
    private boolean isPopular;
    private boolean isVegetarian;
}
