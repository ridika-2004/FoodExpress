package com.example.authentication_service.service;

import com.example.authentication_service.dto.AuthResponse;
import com.example.authentication_service.dto.LoginRequest;
import com.example.authentication_service.dto.RegisterRequest;
import com.example.authentication_service.dto.UserResponse;
import com.example.authentication_service.entity.Role;
import com.example.authentication_service.entity.User;
import com.example.authentication_service.repository.UserRepository;
import com.example.authentication_service.security.JwtTokenProvider;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public AuthResponse register(RegisterRequest req) {
        // Check duplicate email
        if (userRepository.existsByEmailIgnoreCase(req.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An account with this email already exists");
        }

        // Resolve role from secret code
        Role role = resolveRole(req.secretCode());

        // Build user
        User user = new User();
        user.setName(req.name().trim());
        user.setEmail(req.email().trim().toLowerCase());
        user.setPhone(req.phone().trim());
        user.setPassword(passwordEncoder.encode(req.password()));
        user.setRole(role);
        if (role == Role.DELIVERYMAN) {
            user.setIsAvailable(true);
        }

        user = userRepository.save(user);
        String token = jwtTokenProvider.generateToken(user);
        return new AuthResponse(token, UserResponse.from(user));
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmailIgnoreCase(req.email().trim())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "No account found with this email. Please sign up first."));

        if (!passwordEncoder.matches(req.password(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Incorrect password. Please try again.");
        }

        String token = jwtTokenProvider.generateToken(user);
        return new AuthResponse(token, UserResponse.from(user));
    }

    public UserResponse getUserById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return UserResponse.from(user);
    }

    private Role resolveRole(String secretCode) {
        if (secretCode == null || secretCode.isBlank()) {
            return Role.USER;
        }
        return switch (secretCode.trim().toLowerCase()) {
            case "restaurant" -> Role.RESTAURANT;
            case "delivery" -> Role.DELIVERYMAN;
            default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Invalid secret code. Use \"restaurant\" or \"delivery\".");
        };
    }
}
