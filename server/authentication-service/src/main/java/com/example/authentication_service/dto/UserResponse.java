package com.example.authentication_service.dto;

import com.example.authentication_service.entity.User;

public record UserResponse(
        String id,
        String name,
        String email,
        String phone,
        String avatar,
        String role,
        Boolean isAvailable,
        String restaurantId
) {
    public static UserResponse from(User user) {
        String avatar = "https://ui-avatars.com/api/?name="
                + user.getName().replace(" ", "+")
                + "&background=ef4444&color=fff&size=200";
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                avatar,
                user.getRole().name().toLowerCase(),
                user.getIsAvailable(),
                user.getRestaurantId()
        );
    }
}
