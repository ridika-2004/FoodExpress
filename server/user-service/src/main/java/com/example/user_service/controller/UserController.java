package com.example.user_service.controller;

import com.example.user_service.dto.AvailabilityRequest;
import com.example.user_service.dto.UserResponse;
import com.example.user_service.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    /** Calling user's own profile. */
    @GetMapping("/me")
    public UserResponse getMe(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        return userService.getMe(authHeader);
    }

    /** Calling deliveryman's current availability state. */
    @GetMapping("/me/availability")
    public UserResponse getMyAvailability(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        return userService.getMyAvailability(authHeader);
    }

    /**
     * Set (or flip, when no body is sent) the calling deliveryman's availability.
     * DELIVERYMAN role only.
     */
    @PatchMapping("/me/availability")
    public UserResponse setMyAvailability(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody(required = false) AvailabilityRequest request) {
        return userService.setMyAvailability(authHeader, request != null ? request.isAvailable() : null);
    }

    /** Deliverymen directory — optionally filtered by availability. */
    @GetMapping("/deliverymen")
    public List<UserResponse> getDeliverymen(@RequestParam(required = false) Boolean available) {
        return userService.getDeliverymen(available);
    }

    @GetMapping("/{id}")
    public UserResponse getById(@PathVariable String id) {
        return userService.getById(id);
    }
}
