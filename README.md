# FoodExpress — Backend Microservices Guide

A complete, beginner-friendly explanation of every service, folder, and file in the `server/` directory.
If you are a first-year student, read this top to bottom — nothing is assumed.

---

## 1. The big picture

FoodExpress is a food-delivery app. Instead of one giant backend program (a "monolith"),
the backend is split into **8 small Spring Boot programs** called **microservices**.
Each one owns a single job and its own database.

```text
                       ┌───────────────────────────┐
   React frontend ───► │  API GATEWAY  (port 8080) │  one door for everything
   (localhost:5173)    └─────────────┬─────────────┘
                                     │ asks "where is X?"
                       ┌─────────────▼─────────────┐
                       │ SERVICE REGISTRY  (8761)  │  Eureka phone book
                       └─────────────┬─────────────┘
        ┌──────────────┬─────────────┼──────────────┬──────────────┐
        ▼              ▼             ▼              ▼              ▼
  AUTH (9001)   RESTAURANT (9002)  CART (9003)  DELIVERY (9004)  PAYMENT (9005)
                                                  ORDER (9006)
        │              │             │              │              │
        └──────────────┴──── MongoDB Atlas ─────────┴──────────────┘
                     +  RabbitMQ (5672) for events between services
```

Three infrastructure pieces you must know:

| Piece | What it is | Why it exists here |
|---|---|---|
| **Eureka (Service Registry)** | A phone book. Every service says "hi, I'm CART-SERVICE at port 9003". | So services can find each other by **name**, not by hard-coded IP/port. |
| **API Gateway** | A single entry door at `http://localhost:8080`. | The frontend calls only one address; the gateway forwards to the right service. |
| **RabbitMQ** | A message broker (post office). | Services tell each other "something happened" **without waiting** for a reply. |

---

## 2. Ports cheat-sheet

| Service | Port | Database (MongoDB) | Uses RabbitMQ? |
|---|---|---|---|
| service-registry | 8761 | – | no |
| api-gateway | 8080 | – | no |
| authentication-service | 9001 | `foodexpress_auth` | no |
| restaurant-service | 9002 | `foodexpress_restaurant` | no |
| cart-service | 9003 | `foodexpress_cart` | yes (listens) |
| delivery-service | 9004 | `foodexpress_delivery` (+ reads `foodexpress_auth`) | yes (both) |
| payment-service | 9005 | `foodexpress_payment` | yes (publishes) |
| order-service | 9006 | `foodexpress_order` | yes (both) |

**Start order:** `service-registry` → all business services → `api-gateway`.
Eureka dashboard: <http://localhost:8761>.

---

## 3. Spring Boot vocabulary (read this once)

Every service repeats the same folder pattern. Learn it once, and you can read them all.

```text
src/main/java/com/example/<service>_service/
├── XxxApplication.java   ← the main() method that starts the service
├── config/               ← settings written as Java (CORS, RabbitMQ queues, Mongo)
├── controller/           ← the HTTP layer: URLs in, JSON out
├── dto/                  ← "Data Transfer Objects": the shape of request/response JSON
├── entity/               ← the shape of documents stored in MongoDB
├── enums/                ← fixed lists of allowed values (e.g. PENDING, SUCCESS)
├── exception/            ← turns Java errors into friendly JSON error messages
├── listener/             ← receives RabbitMQ events from other services
├── repository/           ← database access (Spring writes the queries for you)
└── service/              ← the brain: business rules and calculations
src/main/resources/
├── application.yml       ← port, service name, Eureka, RabbitMQ
└── application.properties← MongoDB URI, JWT secret
pom.xml                   ← Maven file: the list of libraries this service needs
```

The request flow inside one service is always:

```text
HTTP request → Controller → Service (rules) → Repository → MongoDB
                                    ↑
                          DTOs/entities carry the data
```

Common annotations:

- `@RestController` – this class answers HTTP requests.
- `@RequestMapping("/api/x")` – base URL for the class.
- `@GetMapping / @PostMapping / @PutMapping / @PatchMapping / @DeleteMapping` – one URL + HTTP verb.
- `@Service` – business-logic class; Spring creates one instance for you.
- `@Document(collection = "orders")` – this class maps to a MongoDB collection.
- `@Id` – the primary key field.
- `@Data`, `@Builder` (Lombok) – auto-generate getters/setters and a builder, so you write less code.
- `@RabbitListener(queues = "...")` – run this method whenever a message lands in that queue.

---

## 4. Service-by-service walkthrough

### 4.1 `service-registry` — the phone book (port 8761)

| File | What it does |
|---|---|
| `ServiceRegistryApplication.java` | `@EnableEurekaServer` turns this app into the Eureka server. |
| `application.yml` | Port 8761; `register-with-eureka: false` because it doesn't register with itself; self-preservation off so dead services disappear quickly in dev. |

Every other service has this block in its `application.yml`, which is how it registers:

```yaml
eureka:
  client:
    service-url:
      defaultZone: http://localhost:8761/eureka/
```

### 4.2 `api-gateway` — the single front door (port 8080)

| File | What it does |
|---|---|
| `ApiGatewayApplication.java` | `@EnableDiscoveryClient` so the gateway can look services up in Eureka. |
| `application.yml` | Route table + global CORS. |

Routing rules (path → service):

| Incoming URL | Forwarded to |
|---|---|
| `/api/auth/**` | `lb://AUTHENTICATION-SERVICE` |
| `/api/restaurants/**` | `lb://RESTAURANT-SERVICE` |
| `/api/cart/**` | `lb://CART-SERVICE` |
| `/api/orders/**` | `lb://ORDER-SERVICE` |
| `/api/payments/**` | `lb://PAYMENT-SERVICE` |
| `/api/delivery/**` | `lb://DELIVERY-SERVICE` |

`lb://` means **load balanced**: the gateway asks Eureka for the service's address, and if
several copies are running it spreads traffic between them.
`globalcors` allows the browser (a different origin, port 5173) to call the API.

### 4.3 `authentication-service` — who are you? (port 9001)

Handles registration, login and identity. It is the only service that creates JWTs.

| File | Role |
|---|---|
| `entity/User.java` | Mongo document in `users`: id, email (unique index), name, phone, hashed password, role, `restaurantId`, `isAvailable`, `createdAt`. |
| `entity/Role.java` | Enum: `USER`, `RESTAURANT`, `DELIVERYMAN`. |
| `dto/RegisterRequest.java` | Signup JSON + validation rules (valid email, strong password regex: 8+ chars, upper, lower, digit, symbol). |
| `dto/LoginRequest.java` | Email + password. |
| `dto/AuthResponse.java` | `{ token, user }` returned after register/login. |
| `dto/UserResponse.java` | The **safe** view of a user (never contains the password). |
| `dto/ErrorResponse.java` | `{ status, message, timestamp }`. |
| `repository/UserRepository.java` | `findByEmailIgnoreCase`, `existsByEmailIgnoreCase` — Spring Data writes the query from the method name. |
| `service/AuthService.java` | Business rules: reject duplicate email (409), hash password with BCrypt, map "secret code" → role (`restaurant`, `delivery`, empty = normal user), verify password on login, issue token. |
| `security/JwtTokenProvider.java` | Creates and verifies JWTs. Puts `role`, `name`, `email` inside the token; subject = user id; signed with HMAC-SHA using `app.jwt.secret`; expires after 24 h. |
| `security/JwtAuthenticationFilter.java` | Runs on every request: reads `Authorization: Bearer <token>`, validates it, loads the user, and marks the request as authenticated. |
| `security/UserPrincipal.java` | Tiny record describing the logged-in user during a request. |
| `config/SecurityConfig.java` | Stateless security: `/register` and `/login` are public, `/me` needs a token; CORS for `localhost:5173/4173`; BCrypt bean. |
| `exception/GlobalExceptionHandler.java` | Converts validation/other errors into clean JSON. |
| `controller/AuthController.java` | `POST /api/auth/register` (201), `POST /api/auth/login`, `GET /api/auth/me`. |

**JWT in one sentence:** a signed string the server gives you at login; you send it back on every
request, and any service can verify it with the shared secret without a database lookup.

### 4.4 `restaurant-service` — the menu catalogue (port 9002)

| File | Role |
|---|---|
| `entity/Restaurant.java` / `entity/MenuItem.java` | Mongo documents for restaurants and their dishes. |
| `dto/RestaurantRequest/Response`, `MenuItemRequest/Response` | Input and output shapes for create/update and listing. |
| `repository/RestaurantRepository`, `MenuItemRepository` | CRUD + lookups (e.g. menu items by restaurant id). |
| `service/RestaurantService.java` | Create/update restaurants, add/edit/delete menu items, map entities → DTOs. |
| `security/*` | Same JWT classes as auth-service (same secret) so this service can identify a restaurant owner. |
| `config/SecurityConfig.java`, `config/WebConfig.java` | Security rules and CORS. |
| `controller/RestaurantController.java` | `GET /api/restaurants`, `GET /api/restaurants/{id}`, menu-item endpoints, owner-only create/update/delete. |

### 4.5 `cart-service` — the shopping basket (port 9003)

| File | Role |
|---|---|
| `entity/Cart.java` | One cart per user: `userId`, `restaurantId`, `restaurantName`, `items`. |
| `entity/CartItem.java` + `MenuItemSnapshot.java` | A line in the cart. The **snapshot** copies id/name/image/price at the moment of adding, so later price changes do not alter an existing cart. |
| `dto/CartRequest/CartResponse/CartItemResponse` | Add-to-cart input and cart output. |
| `repository/CartRepository.java` | `findByUserId`. |
| `service/CartService.java` | Rules: create cart if none exists; if the user adds food from a **different restaurant**, wipe the cart and start fresh; increase quantity if the item is already there; update/remove/clear. |
| `exception/CartNotFoundException` + `GlobalExceptionHandler` | 404 and validation errors as JSON. |
| `config/RabbitMQConfig.java` + `RabbitMQConstants.java` | Declares exchange `foodexpress.exchange`, queue `cart.order.created.queue`, binding on routing key `order.created`, and a JSON message converter. |
| `listener/OrderCreatedListener.java` | When an order is created, **automatically empties that user's cart**. |
| `controller/CartController.java` | `POST /api/cart/items`, `GET /api/cart/{userId}`, `PUT /api/cart/{userId}/items/{menuItemId}?quantity=`, `DELETE .../items/{menuItemId}`, `DELETE /api/cart/{userId}`. |

### 4.6 `order-service` — the order brain (port 9006)

| File | Role |
|---|---|
| `entity/Order.java` | userId, customer info, restaurant info, items, itemCount, subtotal, deliveryFee, total, `status`, `paymentId`, `paymentStatus`, `createdAt`. |
| `entity/OrderStatus.java` | Enum: PENDING → CONFIRMED → PREPARING → OUT_FOR_DELIVERY → DELIVERED (or CANCELLED). |
| `entity/OrderItem.java`, `MenuItemSnapshot.java` | Frozen copy of each purchased dish. |
| `dto/OrderRequest/OrderResponse/OrderItem*` | API shapes. |
| `dto/OrderCreatedEvent`, `OrderConfirmedEvent`, `PaymentSuccessEvent`, `DeliveryStatusChangedEvent` | The message shapes exchanged over RabbitMQ. |
| `repository/OrderRepository.java` | `findByUserId`, `findByRestaurantId`. |
| `service/OrderService.java` | **The money maths:** subtotal = Σ price × qty; delivery fee = 60, but **free when subtotal ≥ 500** (or cart empty); total = subtotal + fee. Saves the order as PENDING, then publishes `order.created`. On status change to CONFIRMED it publishes `order.confirmed`. Also `syncStatus()` and `updatePaymentInfo()` used by listeners. |
| `listener/PaymentSuccessListener.java` | Payment succeeded → stores paymentId/status on the order (and moves it forward). |
| `listener/DeliveryStatusListener.java` | Delivery status text (`out_for_delivery`, `delivered`, …) → mapped to the `OrderStatus` enum and saved, so the customer's order page stays in sync. |
| `config/RabbitMQConfig.java`, `RabbitMQConstants.java` | Queues `order.payment.success.queue`, `order.delivery.status.queue`; routing keys `order.created`, `order.confirmed`, `payment.success`, `delivery.status.changed`. |
| `controller/OrderController.java` | `POST /api/orders`, `GET /api/orders/{id}`, `GET /api/orders/user/{userId}`, `GET /api/orders/restaurant/{restaurantId}`, `PUT /api/orders/{id}/status?status=`. |

### 4.7 `payment-service` — taking the money (port 9005)

| File | Role |
|---|---|
| `entity/Payment.java` | paymentId, orderId, userId, amount, method, status, transactionReference, timestamps. |
| `enums/PaymentMethod.java` | `CARD`, `GCASH`, `CASH_ON_DELIVERY`. |
| `enums/PaymentStatus.java` | `PENDING`, `PROCESSING`, `SUCCESS`, `FAILED`, `CANCELLED`. |
| `dto/CreatePaymentRequest`, `UpdatePaymentStatusRequest`, `PaymentResponse`, `PaymentSuccessEvent` | API + event shapes. |
| `repository/PaymentRepository.java` | `findByOrderId`, `findByUserId`. |
| `service/PaymentService.java` | Rejects a second payment for the same order (409). Cash-on-delivery starts `PENDING`; card/GCash are **simulated as instantly SUCCESS**. Generates a transaction reference (UUID). Whenever the status is SUCCESS it publishes `payment.success` so order-service can update itself. |
| `config/RabbitMQConfig.java`, `RabbitMQConstants.java` | Exchange + routing key `payment.success`. |
| `controller/PaymentController.java` | `POST /api/payments`, `GET /api/payments/{paymentId}`, `GET /api/payments/order/{orderId}`, `GET /api/payments/user/{userId}`, `PUT /api/payments/{paymentId}/status`. |

### 4.8 `delivery-service` — riders and tracking (port 9004)

| File | Role |
|---|---|
| `entity/Order.java` | A **delivery-side** copy of the order: restaurant info, items, total, status string (`pending`…`delivered`), address, assigned `deliverymanId`, driver name/phone. |
| `entity/OrderItem.java` | Item line for the delivery copy. |
| `entity/Deliveryman.java` | Read-only view of a rider from the shared `users` collection (id, name, phone, role, `isAvailable`). |
| `config/MongoConfig.java` | Special: creates a **second** Mongo connection (`authMongoTemplate`) pointed at `foodexpress_auth`, so this service can read riders from the auth database. |
| `dto/AssignRequest`, `StatusUpdateRequest` | `{ deliverymanId }` and `{ status }` request bodies. |
| `dto/OrderConfirmedEvent`, `OrderItemEvent`, `DeliveryStatusChangedEvent` | Event shapes. |
| `repository/OrderRepository.java` | `findByStatus`, plus standard CRUD. |
| `service/DeliveryService.java` | List/filter orders; create a delivery record; **assign a rider** (404 if rider missing, **409 if the rider toggled themselves unavailable**), auto-advance the status to `out_for_delivery`; `updateStatus()` saves and publishes `delivery.status.changed`; `getDeliverymen()` queries `users` with a case-insensitive `role = deliveryman` regex and optional `isAvailable` filter. |
| `listener/OrderConfirmedListener.java` | On `order.confirmed`, creates the delivery record. It first checks `orderExists()` — this is **idempotency**: if the same message arrives twice, nothing is duplicated. |
| `controller/DeliveryController.java` | `GET /api/delivery/orders?status=`, `POST /api/delivery/orders`, `PATCH /api/delivery/orders/{id}/assign`, `PATCH /api/delivery/orders/{id}/status`, `GET /api/delivery/deliverymen?available=`. |

---

## 5. How the services talk to each other (RabbitMQ)

One **topic exchange**: `foodexpress.exchange`. Publishers send with a *routing key*; queues bound
to that key receive a copy.

| Event (routing key) | Published by | Consumed by | Effect |
|---|---|---|---|
| `order.created` | order-service | cart-service (`cart.order.created.queue`) | The user's cart is emptied. |
| `payment.success` | payment-service | order-service (`order.payment.success.queue`) | Order stores paymentId + paid status. |
| `order.confirmed` | order-service | delivery-service (`delivery.order.confirmed.queue`) | A delivery record is created. |
| `delivery.status.changed` | delivery-service | order-service (`order.delivery.status.queue`) | Order status mirrors the delivery status. |

Full happy path:

```text
1. User adds food        → cart-service saves the cart
2. User checks out       → order-service creates order (PENDING)
                           └─ publishes order.created → cart cleared
3. User pays             → payment-service saves payment
                           └─ publishes payment.success → order marked paid
4. Restaurant confirms   → order-service sets CONFIRMED
                           └─ publishes order.confirmed → delivery record created
5. Admin assigns a rider → delivery-service sets out_for_delivery
                           └─ publishes delivery.status.changed → order updated
6. Rider marks delivered → same event → order becomes DELIVERED
```

**Why events instead of direct HTTP calls?** If the cart service is temporarily down, the order
still succeeds — the message waits in the queue. This is called *loose coupling*.

---

## 6. Data model summary

| Database | Collection | Owner service | Key fields |
|---|---|---|---|
| `foodexpress_auth` | `users` | authentication-service (delivery-service reads it) | email, password hash, role, isAvailable |
| `foodexpress_restaurant` | `restaurants`, `menu_items` | restaurant-service | name, cuisine, price, image |
| `foodexpress_cart` | `carts` | cart-service | userId, restaurantId, items[] |
| `foodexpress_order` | `orders` | order-service | totals, status, paymentStatus |
| `foodexpress_payment` | `payments` | payment-service | amount, method, status |
| `foodexpress_delivery` | `orders` | delivery-service | status, deliverymanId, driver info |

Rule of thumb in microservices: **one service owns one database**. Nobody else writes to it.
(The one exception here is delivery-service *reading* `users` to look up riders.)

---

## 7. Running everything locally

Prerequisites: **Java 17+**, **Maven** (a `mvnw` wrapper is included), **RabbitMQ** on 5672,
internet access for MongoDB Atlas.

```bash
# 1. Registry first — everything else registers into it
cd server/service-registry && ./mvnw spring-boot:run

# 2. Business services (each in its own terminal)
cd server/authentication-service && ./mvnw spring-boot:run   # 9001
cd server/restaurant-service     && ./mvnw spring-boot:run   # 9002
cd server/cart-service           && ./mvnw spring-boot:run   # 9003
cd server/delivery-service       && ./mvnw spring-boot:run   # 9004
cd server/payment-service        && ./mvnw spring-boot:run   # 9005
cd server/order-service          && ./mvnw spring-boot:run   # 9006

# 3. Gateway last
cd server/api-gateway && ./mvnw spring-boot:run              # 8080
```

Start RabbitMQ with Docker if you don't have it installed:

```bash
docker run -d --name rabbit -p 5672:5672 -p 15672:15672 rabbitmq:3-management
# management UI: http://localhost:15672  (guest / guest)
```

Quick test:

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","password":"Passw0rd!"}'
```

The React frontend should point at the gateway: `http://localhost:8080`.

---

## 8. Things a reviewer will notice (honest notes)

1. **Secrets are committed.** MongoDB Atlas credentials and the JWT secret sit in
   `application.properties`/`application.yml`. Move them to environment variables
   (`${MONGODB_URI}`, `${JWT_SECRET}`) before showing this publicly, and rotate the leaked ones.
2. **Only auth-service and restaurant-service verify JWTs.** Cart, order, payment and delivery
   endpoints trust the `userId` sent in the URL/body, so anyone could read another user's cart.
   The real fix is validating the token at the gateway or in each service.
3. **Duplicated code.** `RabbitMQConstants`, event DTOs and the JWT classes are copy-pasted per
   service. That is normal-ish in microservices (independence over reuse), but a shared
   `common-events` module is an option.
4. **Two order tables.** order-service and delivery-service each keep an order document. That is
   intentional (each service owns its own data), but they must be kept in sync by events.
5. **Payments are simulated.** Card/GCash always succeed; there is no real payment provider.
6. **`target/` folders are committed.** Those are build outputs — add them to `.gitignore`.
7. **No `user-service` in this bundle**, so the deliveryman availability toggle currently relies on
   `isAvailable` living in the shared `users` collection.

---

## 9. Glossary

| Term | Plain-English meaning |
|---|---|
| Microservice | A small program that does one job and can be deployed alone. |
| Eureka / Service discovery | A registry so services find each other by name. |
| API Gateway | One public address that forwards requests to the right service. |
| JWT | A signed ID card the client sends with each request. |
| BCrypt | A slow hashing algorithm for passwords — hashes cannot be reversed. |
| DTO | The JSON shape of a request or response. |
| Entity | The shape of a document saved in the database. |
| Repository | Interface that gives you database queries for free. |
| Exchange / Queue / Routing key | Post office / mailbox / address label in RabbitMQ. |
| Idempotency | Handling the same message twice safely. |
| CORS | Browser rule that lets `localhost:5173` call `localhost:8080`. |
| Snapshot | A frozen copy of data (e.g. price) so later edits don't rewrite history. |
