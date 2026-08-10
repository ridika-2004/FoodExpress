package com.example.user_service.repository;

import com.example.user_service.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByEmailIgnoreCase(String email);

    /** Case-insensitive role match — the role is stored as "DELIVERYMAN" by the auth-service. */
    @Query("{ 'role': { $regex: '^?0$', $options: 'i' } }")
    List<User> findByRoleIgnoreCase(String role);

    @Query("{ 'role': { $regex: '^?0$', $options: 'i' }, 'isAvailable': ?1 }")
    List<User> findByRoleIgnoreCaseAndIsAvailable(String role, boolean isAvailable);
}
