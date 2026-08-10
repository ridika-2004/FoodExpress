package com.example.user_service.dto;

/**
 * Optional body for PATCH /api/users/me/availability.
 * When {@code isAvailable} is null the current value is simply flipped.
 */
public record AvailabilityRequest(Boolean isAvailable) {
}
