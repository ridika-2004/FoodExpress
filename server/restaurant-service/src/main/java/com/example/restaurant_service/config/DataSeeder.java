package com.example.restaurant_service.config;

import com.example.restaurant_service.entity.MenuItem;
import com.example.restaurant_service.entity.Restaurant;
import com.example.restaurant_service.repository.MenuItemRepository;
import com.example.restaurant_service.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final RestaurantRepository restaurantRepository;
    private final MenuItemRepository menuItemRepository;

    @Override
    public void run(String... args) {

        if (restaurantRepository.count() > 0) {
            return;
        }

        Restaurant restaurant = new Restaurant();
        restaurant.setRestaurantId("1");
        restaurant.setName("Pizza Palace");
        restaurant.setAddress("123 Main St");
        restaurant.setContact("123-456-7890");
        restaurant.setImage("https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop");
        restaurant.setCuisine("Italian • Pizza");
        restaurant.setRating(4.8);
        restaurant.setDeliveryTime("25-35 min");
        restaurant.setDeliveryFee("Free");
        restaurant.setMinOrder("₱150");
        restaurant.setOpen(true);
        restaurant.setPromoted(true);
        restaurant.setCategories(List.of("Pizza", "Italian"));

        restaurant = restaurantRepository.save(restaurant);

        MenuItem menuItem = new MenuItem();
        menuItem.setMenuItemId("101");
        menuItem.setName("Margherita Pizza");
        menuItem.setPrice(299.0);
        menuItem.setCategory("Pizza");
        menuItem.setDescription("Fresh mozzarella, tomato sauce, basil");
        menuItem.setImage("https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop");
        menuItem.setPopular(true);
        menuItem.setVegetarian(true);
        menuItem.setRestaurantId(restaurant.getRestaurantId());

        menuItemRepository.save(menuItem);
        
        MenuItem menuItem2 = new MenuItem();
        menuItem2.setMenuItemId("102");
        menuItem2.setName("Pepperoni Pizza");
        menuItem2.setPrice(369.0);
        menuItem2.setCategory("Pizza");
        menuItem2.setDescription("Double pepperoni, mozzarella, signature sauce");
        menuItem2.setImage("https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop");
        menuItem2.setPopular(true);
        menuItem2.setVegetarian(false);
        menuItem2.setRestaurantId(restaurant.getRestaurantId());

        menuItemRepository.save(menuItem2);

        System.out.println("Sample Restaurant Data Inserted.");
    }
}