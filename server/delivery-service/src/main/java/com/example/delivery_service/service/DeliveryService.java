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
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import com.example.delivery_service.config.RabbitMQConstants;
import com.example.delivery_service.dto.DeliveryStatusChangedEvent;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class DeliveryService {

    private final OrderRepository orderRepository;
    private final MongoTemplate authMongoTemplate;
    private final RabbitTemplate rabbitTemplate;

    public DeliveryService(
            OrderRepository orderRepository,
            @Qualifier("authMongoTemplate") MongoTemplate authMongoTemplate,
            RabbitTemplate rabbitTemplate) {
        this.orderRepository = orderRepository;
        this.authMongoTemplate = authMongoTemplate;
        this.rabbitTemplate = rabbitTemplate;
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

        // Availability is owned by the user-service (same users collection).
        // Refuse assignment when the partner has toggled themselves off duty.
        if (!Boolean.TRUE.equals(dm.getIsAvailable())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    dm.getName() + " is currently unavailable");
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
        Order savedOrder = orderRepository.save(order);

        try {
            DeliveryStatusChangedEvent event = DeliveryStatusChangedEvent.builder()
                    .orderId(savedOrder.getId())
                    .status(savedOrder.getStatus())
                    .build();
            rabbitTemplate.convertAndSend(
                    RabbitMQConstants.EXCHANGE,
                    RabbitMQConstants.DELIVERY_STATUS_ROUTING_KEY,
                    event
            );
            log.info("Published delivery.status.changed event for Order ID: {} with status: {}", savedOrder.getId(), savedOrder.getStatus());
        } catch (Exception e) {
            log.error("Failed to publish delivery.status.changed event for Order ID: {}. Error: {}", savedOrder.getId(), e.getMessage());
        }

        return savedOrder;
    }

    public boolean orderExists(String orderId) {
        return orderRepository.existsById(orderId);
    }

    // ── Deliverymen ───────────────────────────────────────────

    public List<Deliveryman> getDeliverymen(Boolean available) {
        // Match "DELIVERYMAN" (Java enum name) or "deliveryman" (lowercase) stored in MongoDB
        Query query = new Query(
                Criteria.where("role").regex(Pattern.compile("^deliveryman$", Pattern.CASE_INSENSITIVE)));
        if (available != null) {
            query.addCriteria(Criteria.where("isAvailable").is(available));
        }
        return authMongoTemplate.find(query, Deliveryman.class, "users");
    }
}
