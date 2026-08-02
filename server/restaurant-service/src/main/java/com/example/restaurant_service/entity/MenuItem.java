package com.example.restaurant_service.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "menu_items")
public class MenuItem {
    @Id
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
