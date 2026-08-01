package com.example.authentication_service.config;

import com.example.authentication_service.entity.Role;
import com.example.authentication_service.entity.User;
import com.example.authentication_service.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) return;

        String defaultPassword = passwordEncoder.encode("password123");

        // Regular user
        createUser("Ridika Naznin", "ridika@example.com", "+880 1234 567890",
                defaultPassword, Role.USER, null, null);

        // Restaurant owner
        createUser("Restaurant Owner", "restaurant@foodexpress.com", "+63 911 111 1111",
                defaultPassword, Role.RESTAURANT, "1", null);

        // Delivery partners
        createUser("John Cruz", "john@foodexpress.com", "+63 912 345 6789",
                defaultPassword, Role.DELIVERYMAN, null, true);

        createUser("Maria Santos", "maria@foodexpress.com", "+63 913 456 7890",
                defaultPassword, Role.DELIVERYMAN, null, true);
    }

    private void createUser(String name, String email, String phone, String password,
                            Role role, String restaurantId, Boolean isAvailable) {
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPhone(phone);
        user.setPassword(password);
        user.setRole(role);
        user.setRestaurantId(restaurantId);
        user.setIsAvailable(isAvailable);
        userRepository.save(user);
    }
}
