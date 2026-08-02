package com.example.restaurant_service.controller;

import com.example.restaurant_service.dto.MenuItemRequest;
import com.example.restaurant_service.dto.MenuItemResponse;
import com.example.restaurant_service.dto.RestaurantRequest;
import com.example.restaurant_service.dto.RestaurantResponse;
import com.example.restaurant_service.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
@RequiredArgsConstructor
public class RestaurantController {

    private final RestaurantService restaurantService;

    @PostMapping
    public ResponseEntity<RestaurantResponse> createRestaurant(@RequestBody RestaurantRequest request) {
        return new ResponseEntity<>(restaurantService.createRestaurant(request), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<RestaurantResponse>> getAllRestaurants() {
        return ResponseEntity.ok(restaurantService.getAllRestaurants());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RestaurantResponse> getRestaurantById(@PathVariable String id) {
        return ResponseEntity.ok(restaurantService.getRestaurantById(id));
    }

    @PostMapping("/{restaurantId}/menu")
    public ResponseEntity<MenuItemResponse> addMenuItem(@PathVariable String restaurantId, @RequestBody MenuItemRequest request) {
        return new ResponseEntity<>(restaurantService.addMenuItem(restaurantId, request), HttpStatus.CREATED);
    }

    @GetMapping("/{restaurantId}/menu")
    public ResponseEntity<List<MenuItemResponse>> getMenuItems(@PathVariable String restaurantId) {
        return ResponseEntity.ok(restaurantService.getMenuItems(restaurantId));
    }
}
