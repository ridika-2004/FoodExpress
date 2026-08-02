package com.example.cart_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ErrorResponse {

    private int status;
    private String message;

    public static ErrorResponse of(int status, String message) {
        return new ErrorResponse(status, message);
    }
}