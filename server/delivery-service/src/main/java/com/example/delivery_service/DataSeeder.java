package com.example.delivery_service;

import com.example.delivery_service.entity.Order;
import com.example.delivery_service.entity.OrderItem;
import com.example.delivery_service.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

/**
 * Seeds sample orders into MongoDB on first startup (only if the collection is empty).
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final OrderRepository orderRepository;

    @Override
    public void run(String... args) {
        if (orderRepository.count() > 0) {
            log.info("Orders collection already has data — skipping seed.");
            return;
        }

        List<Order> seed = List.of(
                Order.builder()
                        .restaurantId("1")
                        .restaurantName("Pizza Palace")
                        .restaurantImage("https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop")
                        .items(List.of(
                                OrderItem.builder().name("Margherita Pizza").price(299).quantity(2).image("https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop").build(),
                                OrderItem.builder().name("Garlic Bread").price(129).quantity(1).image("https://images.unsplash.com/photo-1619535860434-ba1d8fa12520?w=400&h=300&fit=crop").build()
                        ))
                        .total(727)
                        .status("pending")
                        .deliveryAddress("123 Main Street, Apt 4B, Downtown")
                        .paymentMethod("Credit Card •••• 4242")
                        .estimatedDelivery("30-45 min")
                        .createdAt(Instant.now().minus(10, ChronoUnit.MINUTES))
                        .build(),

                Order.builder()
                        .restaurantId("2")
                        .restaurantName("Burger Haven")
                        .restaurantImage("https://images.unsplash.com/photo-1561758033-7e924f619f47?w=600&h=400&fit=crop")
                        .items(List.of(
                                OrderItem.builder().name("Classic Cheeseburger").price(199).quantity(1).image("https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop").build(),
                                OrderItem.builder().name("Truffle Fries").price(149).quantity(1).image("https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop").build()
                        ))
                        .total(348)
                        .status("confirmed")
                        .deliveryAddress("456 Oak Avenue, Village Center")
                        .paymentMethod("GCash")
                        .estimatedDelivery("20-30 min")
                        .createdAt(Instant.now().minus(5, ChronoUnit.MINUTES))
                        .build(),

                Order.builder()
                        .restaurantId("3")
                        .restaurantName("Sushi Master")
                        .restaurantImage("https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&h=400&fit=crop")
                        .items(List.of(
                                OrderItem.builder().name("Salmon Nigiri (6 pcs)").price(399).quantity(2).image("https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop").build()
                        ))
                        .total(798)
                        .status("preparing")
                        .deliveryAddress("789 Pine Road, Suite 200")
                        .paymentMethod("Credit Card •••• 1234")
                        .estimatedDelivery("35-45 min")
                        .createdAt(Instant.now().minus(15, ChronoUnit.MINUTES))
                        .build(),

                Order.builder()
                        .restaurantId("5")
                        .restaurantName("Spice Garden")
                        .restaurantImage("https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop")
                        .items(List.of(
                                OrderItem.builder().name("Butter Chicken").price(349).quantity(1).build(),
                                OrderItem.builder().name("Garlic Naan").price(69).quantity(2).build()
                        ))
                        .total(487)
                        .status("out_for_delivery")
                        .deliveryAddress("321 Maple Lane")
                        .paymentMethod("GCash")
                        .estimatedDelivery("10-15 min")
                        .createdAt(Instant.now().minus(30, ChronoUnit.MINUTES))
                        .build(),

                Order.builder()
                        .restaurantId("7")
                        .restaurantName("Sweet Tooth")
                        .restaurantImage("https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&h=400&fit=crop")
                        .items(List.of(
                                OrderItem.builder().name("Chocolate Lava Cake").price(199).quantity(2).build(),
                                OrderItem.builder().name("Macarons (6 pcs)").price(249).quantity(1).build()
                        ))
                        .total(647)
                        .status("delivered")
                        .deliveryAddress("555 Desert Blvd")
                        .paymentMethod("Cash")
                        .estimatedDelivery("Delivered")
                        .createdAt(Instant.now().minus(2, ChronoUnit.HOURS))
                        .build()
        );

        orderRepository.saveAll(seed);
        log.info("Seeded {} sample orders into foodexpress_delivery.orders", seed.size());
    }
}
