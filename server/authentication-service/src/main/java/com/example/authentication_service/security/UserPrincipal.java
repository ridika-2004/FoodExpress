package com.example.authentication_service.security;

public record UserPrincipal(String id, String role, String name, String email) {}
