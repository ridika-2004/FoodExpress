package com.example.cart_service.entity;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "carts")
public class Cart {

    @Id
    private String id;

    private String userId;

    private String restaurantId;

    private String restaurantName;

    private List<CartItem> items;

    private Integer itemCount;

    private Double subtotal;

    private Double deliveryFee;

    private Double total;
}