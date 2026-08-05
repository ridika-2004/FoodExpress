package com.example.user_service.dto;

import com.example.user_service.entity.User;

public record UserResponse(
        String id,
        String name,
        String email,
        String phone,
        String role,
        Boolean isAvailable
) {
    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole() != null ? user.getRole().toLowerCase() : null,
                user.getIsAvailable()
        );
    }
}
