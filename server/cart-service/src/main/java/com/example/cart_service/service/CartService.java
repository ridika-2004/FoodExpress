package com.example.cart_service.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.cart_service.dto.CartItemResponse;
import com.example.cart_service.dto.CartRequest;
import com.example.cart_service.dto.CartResponse;
import com.example.cart_service.entity.Cart;
import com.example.cart_service.entity.CartItem;
import com.example.cart_service.entity.MenuItemSnapshot;
import com.example.cart_service.repository.CartRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;

    private static final double DELIVERY_FEE = 60.0;
    private static final double FREE_DELIVERY_THRESHOLD = 500.0;

    // Add item to cart
    public CartResponse addItem(CartRequest request) {

        Cart cart = cartRepository.findByUserId(request.getUserId())
                .orElse(
                        Cart.builder()
                                .userId(request.getUserId())
                                .restaurantId(request.getRestaurantId())
                                .restaurantName(request.getRestaurantName())
                                .items(new ArrayList<>())
                                .build());

        // Different restaurant -> clear cart
        if (cart.getRestaurantId() != null &&
                !cart.getRestaurantId().equals(request.getRestaurantId())) {

            cart.setRestaurantId(request.getRestaurantId());
            cart.setRestaurantName(request.getRestaurantName());
            cart.setItems(new ArrayList<>());
        }

        Optional<CartItem> existingItem = cart.getItems()
                .stream()
                .filter(item -> item.getMenuItem().getId().equals(request.getMenuItemId()))
                .findFirst();

        if (existingItem.isPresent()) {

            existingItem.get().setQuantity(
                    existingItem.get().getQuantity() + request.getQuantity());

        } else {

            MenuItemSnapshot menuItem = MenuItemSnapshot.builder()
                    .id(request.getMenuItemId())
                    .name(request.getMenuItemName())
                    .image(request.getMenuItemImage())
                    .price(request.getMenuItemPrice())
                    .build();

            CartItem cartItem = CartItem.builder()
                    .menuItem(menuItem)
                    .quantity(request.getQuantity())
                    .build();

            cart.getItems().add(cartItem);
        }

        calculateTotals(cart);

        Cart savedCart = cartRepository.save(cart);

        return mapToResponse(savedCart);
    }

    // Get cart
    public CartResponse getCart(String userId) {

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        return mapToResponse(cart);
    }

    // Update quantity
    public CartResponse updateQuantity(String userId, String menuItemId, Integer quantity) {

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        cart.getItems().removeIf(item -> {
            if (item.getMenuItem().getId().equals(menuItemId)) {
                if (quantity <= 0)
                    return true;

                item.setQuantity(quantity);
            }

            return false;
        });

        calculateTotals(cart);

        return mapToResponse(cartRepository.save(cart));
    }

    // Remove item
    public CartResponse removeItem(String userId, String menuItemId) {

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        cart.getItems()
                .removeIf(item -> item.getMenuItem().getId().equals(menuItemId));

        calculateTotals(cart);

        return mapToResponse(cartRepository.save(cart));
    }

    // Clear cart
    public void clearCart(String userId) {

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        cart.getItems().clear();

        calculateTotals(cart);

        cartRepository.save(cart);
    }

    // -------------------- Helper Methods --------------------

    private void calculateTotals(Cart cart) {

        int itemCount = 0;
        double subtotal = 0;

        for (CartItem item : cart.getItems()) {

            itemCount += item.getQuantity();

            subtotal += item.getMenuItem().getPrice()
                    * item.getQuantity();
        }

        double deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD || subtotal == 0
                ? 0
                : DELIVERY_FEE;

        cart.setItemCount(itemCount);
        cart.setSubtotal(subtotal);
        cart.setDeliveryFee(deliveryFee);
        cart.setTotal(subtotal + deliveryFee);
    }

    private CartResponse mapToResponse(Cart cart) {

        List<CartItemResponse> items = cart.getItems()
                .stream()
                .map(item -> CartItemResponse.builder()
                        .menuItem(item.getMenuItem())
                        .quantity(item.getQuantity())
                        .build())
                .toList();

        return CartResponse.builder()
                .id(cart.getId())
                .userId(cart.getUserId())
                .restaurantId(cart.getRestaurantId())
                .restaurantName(cart.getRestaurantName())
                .items(items)
                .itemCount(cart.getItemCount())
                .subtotal(cart.getSubtotal())
                .deliveryFee(cart.getDeliveryFee())
                .total(cart.getTotal())
                .build();
    }
}