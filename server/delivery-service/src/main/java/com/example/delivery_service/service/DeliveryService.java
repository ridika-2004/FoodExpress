package com.example.delivery_service.service;

import com.example.delivery_service.entity.Deliveryman;
import com.example.delivery_service.entity.Order;
import com.example.delivery_service.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.regex.Pattern;

@Service
public class DeliveryService {

    private final OrderRepository orderRepository;
    private final MongoTemplate authMongoTemplate;

    public DeliveryService(
            OrderRepository orderRepository,
            @Qualifier("authMongoTemplate") MongoTemplate authMongoTemplate) {
        this.orderRepository = orderRepository;
        this.authMongoTemplate = authMongoTemplate;
    }

    // ── Orders ────────────────────────────────────────────────

    public List<Order> getAllOrders(String status) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        if (status != null && !status.isBlank() && !"all".equals(status)) {
            return orderRepository.findByStatus(status);
        }
        return orderRepository.findAll(sort);
    }

    public Order createOrder(Order order) {
        if (order.getStatus() == null || order.getStatus().isBlank()) {
            order.setStatus("pending");
        }
        return orderRepository.save(order);
    }

    public Order assignDeliveryman(String orderId, String deliverymanId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found: " + orderId));

        Deliveryman dm = authMongoTemplate.findById(deliverymanId, Deliveryman.class, "users");
        if (dm == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Deliveryman not found: " + deliverymanId);
        }

        order.setDeliverymanId(dm.getId());
        order.setDriverName(dm.getName());
        order.setDriverPhone(dm.getPhone());

        // Auto-advance status when assigned
        if ("pending".equals(order.getStatus()) || "confirmed".equals(order.getStatus())
                || "preparing".equals(order.getStatus())) {
            order.setStatus("out_for_delivery");
        }

        return orderRepository.save(order);
    }

    public Order updateStatus(String orderId, String newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found: " + orderId));
        order.setStatus(newStatus);
        return orderRepository.save(order);
    }

    // ── Deliverymen ───────────────────────────────────────────

    public List<Deliveryman> getDeliverymen() {
        // Match "DELIVERYMAN" (Java enum name) or "deliveryman" (lowercase) stored in MongoDB
        Query query = new Query(
                Criteria.where("role").regex(Pattern.compile("^deliveryman$", Pattern.CASE_INSENSITIVE)));
        return authMongoTemplate.find(query, Deliveryman.class, "users");
    }
}
