package com.example.user_service.config;

import com.mongodb.client.MongoClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.SimpleMongoClientDatabaseFactory;

/**
 * This service reads/writes the auth-service's `users` collection directly
 * (single source of truth for user data), so the template is bound to the
 * auth database explicitly.
 */
@Configuration
public class MongoConfig {

    @Value("${spring.mongodb.database:foodexpress_auth}")
    private String database;

    @Bean
    @Primary
    public MongoTemplate mongoTemplate(MongoClient mongoClient) {
        MongoDatabaseFactory factory = new SimpleMongoClientDatabaseFactory(mongoClient, database);
        return new MongoTemplate(factory);
    }
}
