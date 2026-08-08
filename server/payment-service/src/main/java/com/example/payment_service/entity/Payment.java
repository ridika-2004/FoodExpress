package com.example.payment_service.entity;

import com.example.payment_service.enums.PaymentMethod;
import com.example.payment_service.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "payments")
public class Payment {

    @Id
    private String paymentId;

    private String orderId;

    private String userId;

    private Double amount;

    private PaymentMethod paymentMethod;

    private PaymentStatus paymentStatus;

    private String transactionReference;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}