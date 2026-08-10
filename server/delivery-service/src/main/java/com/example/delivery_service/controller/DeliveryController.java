package com.example.delivery_service.controller;

import com.example.delivery_service.dto.AssignRequest;
import com.example.delivery_service.dto.StatusUpdateRequest;
import com.example.delivery_service.entity.Deliveryman;
import com.example.delivery_service.entity.Order;
import com.example.delivery_service.service.DeliveryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/delivery")
public class DeliveryController {

    private final DeliveryService deliveryService;

    public DeliveryController(DeliveryService deliveryService) {
        this.deliveryService = deliveryService;
    }

    // ── Orders ────────────────────────────────────────────────

    @GetMapping("/orders")
    public List<Order> getOrders(@RequestParam(required = false) String status) {
        return deliveryService.getAllOrders(status);
    }

    @PostMapping("/orders")
    public Order createOrder(@RequestBody Order order) {
        return deliveryService.createOrder(order);
    }

    @PatchMapping("/orders/{id}/assign")
    public Order assignDeliveryman(@PathVariable String id, @RequestBody AssignRequest request) {
        return deliveryService.assignDeliveryman(id, request.getDeliverymanId());
    }

    @PatchMapping("/orders/{id}/status")
    public Order updateStatus(@PathVariable String id, @RequestBody StatusUpdateRequest request) {
        return deliveryService.updateStatus(id, request.getStatus());
    }

    // ── Deliverymen ───────────────────────────────────────────

    @GetMapping("/deliverymen")
    public List<Deliveryman> getDeliverymen(@RequestParam(required = false) Boolean available) {
        return deliveryService.getDeliverymen(available);
    }
}
