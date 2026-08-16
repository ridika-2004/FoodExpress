package com.example.restaurant_service.controller;

import com.example.restaurant_service.dto.MenuItemRequest;
import com.example.restaurant_service.dto.MenuItemResponse;
import com.example.restaurant_service.dto.RestaurantRequest;
import com.example.restaurant_service.dto.RestaurantResponse;
import com.example.restaurant_service.service.RestaurantService;
import com.example.restaurant_service.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
@RequiredArgsConstructor
public class RestaurantController {

    private final RestaurantService restaurantService;

    @PostMapping
    public ResponseEntity<RestaurantResponse> createRestaurant(@RequestBody RestaurantRequest request) {
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return new ResponseEntity<>(restaurantService.createRestaurant(request, principal.getId()), HttpStatus.CREATED);
    }

    @GetMapping("/my-restaurant")
    public ResponseEntity<RestaurantResponse> getMyRestaurant() {
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(restaurantService.getRestaurantByOwnerId(principal.getId()));
    }

    @GetMapping
    public ResponseEntity<List<RestaurantResponse>> getAllRestaurants() {
        return ResponseEntity.ok(restaurantService.getAllRestaurants());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RestaurantResponse> getRestaurantById(@PathVariable("id") String id) {
        return ResponseEntity.ok(restaurantService.getRestaurantById(id));
    }

    @PostMapping("/{restaurantId}/menu")
    public ResponseEntity<MenuItemResponse> addMenuItem(@PathVariable("restaurantId") String restaurantId, @RequestBody MenuItemRequest request) {
        UserPrincipal principal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return new ResponseEntity<>(restaurantService.addMenuItem(restaurantId, request, principal.getId()), HttpStatus.CREATED);
    }

    @GetMapping("/{restaurantId}/menu")
    public ResponseEntity<List<MenuItemResponse>> getMenuItems(@PathVariable("restaurantId") String restaurantId) {
        return ResponseEntity.ok(restaurantService.getMenuItems(restaurantId));
    }
}
