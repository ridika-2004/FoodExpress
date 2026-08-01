package com.example.authentication_service.controller;

import com.example.authentication_service.dto.AuthResponse;
import com.example.authentication_service.dto.LoginRequest;
import com.example.authentication_service.dto.RegisterRequest;
import com.example.authentication_service.dto.UserResponse;
import com.example.authentication_service.security.UserPrincipal;
import com.example.authentication_service.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @GetMapping("/me")
    public UserResponse me(Authentication authentication) {
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        return authService.getUserById(principal.id());
    }
}
