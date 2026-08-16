package com.example.payment_service.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.example.payment_service.dto.CreatePaymentRequest;
import com.example.payment_service.dto.PaymentResponse;
import com.example.payment_service.dto.UpdatePaymentStatusRequest;
import com.example.payment_service.service.PaymentService;

import jakarta.validation.Valid;

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
    @PutMapping("/{paymentId}/status")
    public PaymentResponse updatePaymentStatus(
            @PathVariable String paymentId,
            @Valid @RequestBody UpdatePaymentStatusRequest request
    ) {
        return paymentService.updatePaymentStatus(paymentId, request);
    }
}