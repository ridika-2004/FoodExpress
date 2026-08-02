package com.example.cart_service.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.example.cart_service.dto.CartRequest;
import com.example.cart_service.dto.CartResponse;
import com.example.cart_service.service.CartService;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping("/items")
    @ResponseStatus(HttpStatus.CREATED)
    public CartResponse addItem(@RequestBody CartRequest request) {
        return cartService.addItem(request);
    }

    @GetMapping("/{userId}")
    public CartResponse getCart(@PathVariable String userId) {
        return cartService.getCart(userId);
    }

    @PutMapping("/{userId}/items/{menuItemId}")
    public CartResponse updateQuantity(
            @PathVariable String userId,
            @PathVariable String menuItemId,
            @RequestParam Integer quantity) {

        return cartService.updateQuantity(userId, menuItemId, quantity);
    }

    @DeleteMapping("/{userId}/items/{menuItemId}")
    public CartResponse removeItem(
            @PathVariable String userId,
            @PathVariable String menuItemId) {

        return cartService.removeItem(userId, menuItemId);
    }

    @DeleteMapping("/{userId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void clearCart(@PathVariable String userId) {
        cartService.clearCart(userId);
    }
}