package com.example.delivery_service.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * Read-only projection of a User document from the auth service's database.
 * Queried via the secondary authMongoTemplate — not managed by this service's
 * own Spring Data repositories.
 */
@Data
@NoArgsConstructor
public class Deliveryman {

    @Id
    private String id;

    private String name;
    private String email;
    private String phone;
    private String role;

    @Field("isAvailable")
    private Boolean isAvailable;
}
