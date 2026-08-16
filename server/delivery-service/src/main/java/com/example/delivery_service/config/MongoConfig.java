package com.example.delivery_service.config;

import com.mongodb.client.MongoClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.SimpleMongoClientDatabaseFactory;

@Configuration
public class MongoConfig {

    @Value("${spring.mongodb.database:foodexpress_delivery}")
    private String primaryDatabase;

    @Value("${app.auth.mongodb.database}")
    private String authDatabase;

    /**
     * Primary MongoTemplate for this service's own database (foodexpress_delivery).
     * Declared explicitly because defining any MongoTemplate bean causes Spring Boot's
     * MongoDataAutoConfiguration to back off — so we own all MongoDB template setup here.
     */
    @Bean
    @Primary
    public MongoTemplate mongoTemplate(MongoClient mongoClient) {
        MongoDatabaseFactory factory = new SimpleMongoClientDatabaseFactory(mongoClient, primaryDatabase);
        return new MongoTemplate(factory);
    }

    /**
     * Secondary MongoTemplate that reads from the auth service's database
     * so we can look up deliverymen (users with role=deliveryman) without
     * duplicating user data in this service.
     */
    @Bean("authMongoTemplate")
    public MongoTemplate authMongoTemplate(MongoClient mongoClient) {
        return new MongoTemplate(mongoClient, authDatabase);
    }
}
