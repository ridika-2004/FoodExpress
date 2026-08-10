package com.example.user_service.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * Read/write projection of the User document owned by the auth-service.
 * Only the fields this service needs are mapped — password is intentionally excluded.
 */
@Document(collection = "users")
@Data
public class User {

    @Id
    private String id;

    private String name;

    @Indexed
    private String email;

    private String phone;

    private String role;

    private String restaurantId;

    @Field("isAvailable")
    private Boolean isAvailable;
}
