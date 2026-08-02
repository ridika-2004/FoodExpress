# Authentication Service

FoodExpress authentication microservice. Handles user registration, login, and JWT-based session management.

## Tech Stack

- Java 17, Spring Boot 3.3.5
- Spring Security + JWT (jjwt 0.12.6)
- JPA + H2 in-memory database (dev)
- BCrypt password hashing

## Run Locally

```bash
cd server/authentication-service
./mvnw spring-boot:run
```

The service starts on **http://localhost:9001**.

## API Endpoints

### POST /api/auth/register
Register a new user.

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+63 912 345 6789",
  "password": "password123",
  "secretCode": "restaurant"
}
```

**Secret codes:**
- `"restaurant"` → Restaurant owner role
- `"delivery"` → Delivery partner role
- `(empty/omit)` → Regular user role

### POST /api/auth/login
Authenticate and receive a JWT token.

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### GET /api/auth/me
Get current user profile (requires `Authorization: Bearer <token>` header).

## Seeded Accounts (dev)

| Email | Role | Password |
|---|---|---|
| ridika@example.com | User | password123 |
| restaurant@foodexpress.com | Restaurant | password123 |
| john@foodexpress.com | Delivery | password123 |
| maria@foodexpress.com | Delivery | password123 |

## Connecting from Frontend

The frontend expects the auth API at `http://localhost:9001/api/auth`.
Set `VITE_AUTH_API_URL=http://localhost:9001/api/auth` in `.env` in the frontend project.