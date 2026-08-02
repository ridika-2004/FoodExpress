# FoodExpress Application

This repository contains the FoodExpress frontend client and the microservices backend architecture (including Authentication Service and Restaurant Service).

## Prerequisites

Before running the application, make sure you have the following installed on your machine:
- **Node.js** (v18 or higher) for the React frontend
- **Java Development Kit (JDK 17 or higher)** for the Spring Boot backends
- **MongoDB**: Make sure MongoDB is running locally on the default port `27017` (or update the `application.yml` files in the respective services to point to your MongoDB cluster URI).

---

## 1. Running the Backends (Spring Boot)

There are currently two microservices that power the backend. You need to run both of them.

### Start the Restaurant Service
The Restaurant Service handles all data related to restaurants, menus, and searching.
1. Open a terminal and navigate to the `restaurant-service` folder:
   ```bash
   cd server/restaurant-service
   ```
2. Run the application using the Maven wrapper:
   - On Windows: `.\mvnw.cmd spring-boot:run`
   - On Mac/Linux: `./mvnw spring-boot:run`
3. The service will start on port **9002** and will automatically seed sample data (e.g., Pizza Palace) into your MongoDB instance if the collection is empty.

### Start the Authentication Service
The Authentication Service handles user registration, logins, and JWT token generation.
1. Open a new terminal and navigate to the `authentication-service` folder:
   ```bash
   cd server/authentication-service
   ```
2. Run the application:
   - On Windows: `.\mvnw.cmd spring-boot:run`
   - On Mac/Linux: `./mvnw spring-boot:run`
3. The service will start on port **9001**.

*(Note: If you have a Eureka Discovery service or API Gateway configured, ensure those are running first, though the services can operate standalone for development).*

---

## 2. Running the Frontend (React + Vite)

The frontend is a modern React application built with Vite and Tailwind CSS.
1. Open a new terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install the necessary dependencies (you only need to do this the first time):
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. The frontend will be accessible in your browser at **http://localhost:5173**. 
   It is already configured in `src/constants/env.ts` to route requests to the Restaurant Service on port `9002` and the Auth Service on port `9001`.

---

## 3. Using the App

1. **Browse Restaurants**: Go to `http://localhost:5173` to see the home page. The application will fetch the list of restaurants dynamically from your local Spring Boot `restaurant-service`.
2. **View Menus**: Click on any restaurant to navigate to its details page. You will see its specific menu items fetched from the backend.
3. **Cart**: You can add menu items to your cart, increasing/decreasing quantities as desired.
4. **Login/Register**: Navigate to the Login/Sign Up pages to test the authentication flow directly against the `authentication-service`.
