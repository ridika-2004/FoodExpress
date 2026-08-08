package com.example.payment_service.controller;

import com.example.payment_service.dto.CreatePaymentRequest;
import com.example.payment_service.dto.PaymentResponse;
import com.example.payment_service.dto.UpdatePaymentStatusRequest;
import com.example.payment_service.service.PaymentService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // Create payment
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PaymentResponse createPayment(
            @Valid @RequestBody CreatePaymentRequest request
    ) {
        return paymentService.createPayment(request);
    }

    // Get payment by payment ID
    @GetMapping("/{paymentId}")
    public PaymentResponse getPaymentById(
            @PathVariable String paymentId
    ) {
        return paymentService.getPaymentById(paymentId);
    }

    // Get payment by order ID
    @GetMapping("/order/{orderId}")
    public PaymentResponse getPaymentByOrderId(
            @PathVariable String orderId
    ) {
        return paymentService.getPaymentByOrderId(orderId);
    }

    // Get all payments of a user
    @GetMapping("/user/{userId}")
    public List<PaymentResponse> getPaymentsByUserId(
            @PathVariable String userId
    ) {
        return paymentService.getPaymentsByUserId(userId);
    }

    // Update payment status
    @PatchMapping("/{paymentId}/status")
    public PaymentResponse updatePaymentStatus(
            @PathVariable String paymentId,
            @Valid @RequestBody UpdatePaymentStatusRequest request
    ) {
        return paymentService.updatePaymentStatus(paymentId, request);
    }
}