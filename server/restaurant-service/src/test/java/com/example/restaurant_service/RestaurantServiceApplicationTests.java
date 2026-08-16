package com.example.restaurant_service;

import com.example.restaurant_service.dto.MenuItemRequest;
import com.example.restaurant_service.dto.MenuItemResponse;
import com.example.restaurant_service.dto.RestaurantRequest;
import com.example.restaurant_service.dto.RestaurantResponse;
import com.example.restaurant_service.entity.Restaurant;
import com.example.restaurant_service.repository.RestaurantRepository;
import com.example.restaurant_service.service.RestaurantService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class RestaurantServiceApplicationTests {

	@Autowired
	private RestaurantService restaurantService;

	@Autowired
	private RestaurantRepository restaurantRepository;

	@Test
	void testCreateRestaurantAndAddMenu() {
		String ownerId = "test-owner-" + System.currentTimeMillis();

		// 1. Create a restaurant
		RestaurantRequest request = RestaurantRequest.builder()
				.name("Test Resto")
				.address("123 Street")
				.contact("123456")
				.cuisine("Fast Food")
				.rating(4.5)
				.deliveryTime("15-20 min")
				.deliveryFee("10")
				.minOrder("50")
				.isOpen(true)
				.isPromoted(false)
				.categories(List.of("Burgers"))
				.build();

		RestaurantResponse response = restaurantService.createRestaurant(request, ownerId);
		assertNotNull(response.getRestaurantId(), "Restaurant ID should not be null after creation");
		System.out.println("Created restaurant with ID: " + response.getRestaurantId());

		// 2. Fetch the restaurant from repo
		Optional<Restaurant> found = restaurantRepository.findById(response.getRestaurantId());
		assertTrue(found.isPresent(), "Should find restaurant by the returned ID in repository");

		// 3. Try to add a menu item
		MenuItemRequest itemRequest = MenuItemRequest.builder()
				.name("Fries")
				.description("Crispy french fries")
				.price(49.0)
				.category("Sides")
				.image("http://image.url")
				.isPopular(true)
				.isVegetarian(true)
				.build();

		MenuItemResponse itemResponse = restaurantService.addMenuItem(response.getRestaurantId(), itemRequest, ownerId);
		assertNotNull(itemResponse.getMenuItemId(), "Menu item ID should not be null after adding");
		assertEquals(response.getRestaurantId(), itemResponse.getRestaurantId());
		System.out.println("Added menu item with ID: " + itemResponse.getMenuItemId());
	}
}
