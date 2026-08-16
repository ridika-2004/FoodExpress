package com.example.restaurant_service.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "restaurants")
public class Restaurant {
    @Id
    private String restaurantId;
    private String ownerId;
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
}
