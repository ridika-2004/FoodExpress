package com.example.user_service.service;

import com.example.user_service.dto.UserResponse;
import com.example.user_service.entity.User;
import com.example.user_service.repository.UserRepository;
import com.example.user_service.security.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class UserService {

    private static final String ROLE_DELIVERYMAN = "DELIVERYMAN";

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public UserService(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    // ── Token helpers ─────────────────────────────────────────

    /** Validates the Authorization header and returns the token. */
    public String requireToken(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Missing or invalid Authorization header");
        }
        String token = authHeader.substring(7).trim();
        if (!jwtUtil.isValid(token)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid or expired token");
        }
        return token;
    }

    private User requireUser(String token) {
        String userId = jwtUtil.extractUserId(token);
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private User requireDeliveryman(String token) {
        String role = jwtUtil.extractRole(token);
        if (!ROLE_DELIVERYMAN.equalsIgnoreCase(role)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only delivery partners can manage availability");
        }
        return requireUser(token);
    }

    // ── Profile ───────────────────────────────────────────────

    public UserResponse getMe(String authHeader) {
        return UserResponse.from(requireUser(requireToken(authHeader)));
    }

    public UserResponse getById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found: " + id));
        return UserResponse.from(user);
    }

    // ── Availability ──────────────────────────────────────────

    /**
     * Sets the calling deliveryman's availability.
     * When {@code desired} is null the current value is flipped.
     */
    public UserResponse setMyAvailability(String authHeader, Boolean desired) {
        User user = requireDeliveryman(requireToken(authHeader));
        boolean current = Boolean.TRUE.equals(user.getIsAvailable());
        user.setIsAvailable(desired != null ? desired : !current);
        return UserResponse.from(userRepository.save(user));
    }

    public UserResponse getMyAvailability(String authHeader) {
        return UserResponse.from(requireDeliveryman(requireToken(authHeader)));
    }

    // ── Deliverymen directory (used by delivery-service / admin) ──

    public List<UserResponse> getDeliverymen(Boolean available) {
        List<User> users = available == null
                ? userRepository.findByRoleIgnoreCase(ROLE_DELIVERYMAN)
                : userRepository.findByRoleIgnoreCaseAndIsAvailable(ROLE_DELIVERYMAN, available);
        return users.stream().map(UserResponse::from).toList();
    }
}
