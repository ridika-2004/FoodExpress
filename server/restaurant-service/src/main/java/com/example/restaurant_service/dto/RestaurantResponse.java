package com.example.restaurant_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RestaurantResponse {
    private String restaurantId;
    private String name;
    private String address;
    private String contact;
    private String image;
    private String cuisine;
    private Double rating;
    private String deliveryTime;
    private String deliveryFee;
    private String minOrder;
    private boolean isOpen;
    private boolean isPromoted;
    private List<String> categories;
    private List<MenuItemResponse> menuItems;
}
