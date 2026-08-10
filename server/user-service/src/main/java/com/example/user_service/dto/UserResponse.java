package com.example.user_service.dto;

import com.example.user_service.entity.User;

/**
 * Mirrors the auth-service UserResponse shape so the frontend can use the
 * same AppUser type regardless of which service answered.
 */
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
        String name = user.getName() == null ? "" : user.getName();
        String avatar = "https://ui-avatars.com/api/?name="
                + name.replace(" ", "+")
                + "&background=ef4444&color=fff&size=200";
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                avatar,
                user.getRole() != null ? user.getRole().toLowerCase() : null,
                user.getIsAvailable(),
                user.getRestaurantId()
        );
    }
}
