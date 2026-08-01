package com.example.authentication_service.entity;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "users")
@Data
public class User {

    @Id
    private String id;

    @Indexed(unique = true)
    private String email;

    private String name;

    private String phone;

    private String password; // BCrypt hash

    private Role role;

    private String restaurantId;

    private Boolean isAvailable;

    @CreatedDate
    private Instant createdAt;
}