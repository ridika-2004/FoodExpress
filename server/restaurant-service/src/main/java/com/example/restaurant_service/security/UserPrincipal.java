package com.example.restaurant_service.security;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UserPrincipal {
    private String id;
    private String role;
    private String name;
    private String email;
}
