package com.example.payment_service.service;

import com.example.payment_service.dto.CreatePaymentRequest;
import com.example.payment_service.dto.PaymentResponse;
import com.example.payment_service.dto.UpdatePaymentStatusRequest;
import com.example.payment_service.entity.Payment;
import com.example.payment_service.enums.PaymentMethod;
import com.example.payment_service.enums.PaymentStatus;
import com.example.payment_service.repository.PaymentRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;

    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    // Create / process a new payment
    public PaymentResponse createPayment(CreatePaymentRequest request) {

        // Prevent multiple payments for the same order
        if (paymentRepository.findByOrderId(request.getOrderId()).isPresent()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Payment already exists for this order"
            );
        }

        LocalDateTime now = LocalDateTime.now();

        PaymentStatus initialStatus;

        if (request.getPaymentMethod() == PaymentMethod.CASH_ON_DELIVERY) {
            initialStatus = PaymentStatus.PENDING;
        } else {
            // Card and GCash are simulated as successful payments
            initialStatus = PaymentStatus.SUCCESS;
        }

        Payment payment = Payment.builder()
                .orderId(request.getOrderId())
                .userId(request.getUserId())
                .amount(request.getAmount())
                .paymentMethod(request.getPaymentMethod())
                .paymentStatus(initialStatus)
                .transactionReference(generateTransactionReference())
                .createdAt(now)
                .updatedAt(now)
                .build();

        Payment savedPayment = paymentRepository.save(payment);

        return mapToResponse(savedPayment);
    }

    // Get payment using payment ID
    public PaymentResponse getPaymentById(String paymentId) {

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Payment not found"
                ));

        return mapToResponse(payment);
    }

    // Get payment using order ID
    public PaymentResponse getPaymentByOrderId(String orderId) {

        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Payment not found for this order"
                ));

        return mapToResponse(payment);
    }

    // Get all payments belonging to a user
    public List<PaymentResponse> getPaymentsByUserId(String userId) {

        return paymentRepository.findByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // Change payment status
    public PaymentResponse updatePaymentStatus(
            String paymentId,
            UpdatePaymentStatusRequest request
    ) {

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Payment not found"
                ));

        payment.setPaymentStatus(request.getPaymentStatus());
        payment.setUpdatedAt(LocalDateTime.now());

        Payment updatedPayment = paymentRepository.save(payment);

        return mapToResponse(updatedPayment);
    }

    // Generate a unique payment reference
    private String generateTransactionReference() {

        return "PAY-" +
                UUID.randomUUID()
                        .toString()
                        .replace("-", "")
                        .substring(0, 12)
                        .toUpperCase();
    }

    // Convert MongoDB Payment entity to API response
    private PaymentResponse mapToResponse(Payment payment) {

        return PaymentResponse.builder()
                .paymentId(payment.getPaymentId())
                .orderId(payment.getOrderId())
                .userId(payment.getUserId())
                .amount(payment.getAmount())
                .paymentMethod(payment.getPaymentMethod())
                .paymentStatus(payment.getPaymentStatus())
                .transactionReference(payment.getTransactionReference())
                .createdAt(payment.getCreatedAt())
                .updatedAt(payment.getUpdatedAt())
                .build();
    }
}