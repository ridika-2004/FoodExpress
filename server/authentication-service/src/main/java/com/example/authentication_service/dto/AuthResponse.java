package com.example.authentication_service.dto;

public record AuthResponse(
        String token,
        UserResponse user
) {}
