package com.example.restaurant_service.service;

import com.example.restaurant_service.dto.MenuItemRequest;
import com.example.restaurant_service.dto.MenuItemResponse;
import com.example.restaurant_service.dto.RestaurantRequest;
import com.example.restaurant_service.dto.RestaurantResponse;
import com.example.restaurant_service.entity.MenuItem;
import com.example.restaurant_service.entity.Restaurant;
import com.example.restaurant_service.repository.MenuItemRepository;
import com.example.restaurant_service.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final MenuItemRepository menuItemRepository;

    public RestaurantResponse createRestaurant(RestaurantRequest request, String ownerId) {
        if (restaurantRepository.findByOwnerId(ownerId).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Owner already has a restaurant");
        }
        
        Restaurant restaurant = Restaurant.builder()
                .ownerId(ownerId)
                .name(request.getName())
                .address(request.getAddress())
                .contact(request.getContact())
                .image(request.getImage())
                .cuisine(request.getCuisine())
                .rating(request.getRating())
                .deliveryTime(request.getDeliveryTime())
                .deliveryFee(request.getDeliveryFee())
                .minOrder(request.getMinOrder())
                .isOpen(request.isOpen())
                .isPromoted(request.isPromoted())
                .categories(request.getCategories())
                .build();
        restaurant = restaurantRepository.save(restaurant);
        return mapToRestaurantResponse(restaurant, List.of());
    }

    public List<RestaurantResponse> getAllRestaurants() {
        return restaurantRepository.findAll().stream()
                .map(restaurant -> {
                    List<MenuItem> menuItems = menuItemRepository.findByRestaurantId(restaurant.getRestaurantId());
                    return mapToRestaurantResponse(restaurant, menuItems);
                })
                .collect(Collectors.toList());
    }

    public RestaurantResponse getRestaurantById(String id) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Restaurant not found"));
        List<MenuItem> menuItems = menuItemRepository.findByRestaurantId(restaurant.getRestaurantId());
        return mapToRestaurantResponse(restaurant, menuItems);
    }

    public RestaurantResponse getRestaurantByOwnerId(String ownerId) {
        Restaurant restaurant = restaurantRepository.findByOwnerId(ownerId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Restaurant not found for this owner"));
        List<MenuItem> menuItems = menuItemRepository.findByRestaurantId(restaurant.getRestaurantId());
        return mapToRestaurantResponse(restaurant, menuItems);
    }

    public MenuItemResponse addMenuItem(String restaurantId, MenuItemRequest request, String ownerId) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Restaurant not found"));
                
        if (!ownerId.equals(restaurant.getOwnerId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied: You do not own this restaurant");
        }

        MenuItem menuItem = MenuItem.builder()
                .restaurantId(restaurantId)
                .name(request.getName())
                .price(request.getPrice())
                .category(request.getCategory())
                .description(request.getDescription())
                .image(request.getImage())
                .isPopular(request.isPopular())
                .isVegetarian(request.isVegetarian())
                .build();
        menuItem = menuItemRepository.save(menuItem);
        return mapToMenuItemResponse(menuItem);
    }

    public List<MenuItemResponse> getMenuItems(String restaurantId) {
        return menuItemRepository.findByRestaurantId(restaurantId).stream()
                .map(this::mapToMenuItemResponse)
                .collect(Collectors.toList());
    }

    private RestaurantResponse mapToRestaurantResponse(Restaurant restaurant, List<MenuItem> menuItems) {
        return RestaurantResponse.builder()
                .restaurantId(restaurant.getRestaurantId())
                .name(restaurant.getName())
                .address(restaurant.getAddress())
                .contact(restaurant.getContact())
                .image(restaurant.getImage())
                .cuisine(restaurant.getCuisine())
                .rating(restaurant.getRating())
                .deliveryTime(restaurant.getDeliveryTime())
                .deliveryFee(restaurant.getDeliveryFee())
                .minOrder(restaurant.getMinOrder())
                .isOpen(restaurant.isOpen())
                .isPromoted(restaurant.isPromoted())
                .categories(restaurant.getCategories())
                .menuItems(menuItems.stream().map(this::mapToMenuItemResponse).collect(Collectors.toList()))
                .build();
    }

    private MenuItemResponse mapToMenuItemResponse(MenuItem menuItem) {
        return MenuItemResponse.builder()
                .menuItemId(menuItem.getMenuItemId())
                .restaurantId(menuItem.getRestaurantId())
                .name(menuItem.getName())
                .price(menuItem.getPrice())
                .category(menuItem.getCategory())
                .description(menuItem.getDescription())
                .image(menuItem.getImage())
                .isPopular(menuItem.isPopular())
                .isVegetarian(menuItem.isVegetarian())
                .build();
    }
}
