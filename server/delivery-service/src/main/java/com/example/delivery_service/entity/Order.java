package com.example.delivery_service.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Document(collection = "orders")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    private String id;

    private String restaurantId;
    private String restaurantName;
    private String restaurantImage;

    private List<OrderItem> items;

    private double total;

    /** pending | confirmed | preparing | out_for_delivery | delivered | cancelled */
    private String status;

    private String deliveryAddress;
    private String paymentMethod;
    private String estimatedDelivery;

    // Assigned delivery partner
    private String deliverymanId;
    private String driverName;
    private String driverPhone;
    private String driverImage;

    @CreatedDate
    private Instant createdAt;
}
