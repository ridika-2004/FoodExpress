# Order Service

FoodExpress order microservice. Handles order placement, retrieving orders, viewing user order history, viewing restaurant orders, and updating order status.

## Tech Stack

- Java 17
- Spring Boot 4.1.0
- Spring Data MongoDB
- MongoDB
- Spring Web MVC

## Run Locally

    cd server/order-service
    ./mvnw spring-boot:run

The service starts on **http://localhost:9004**.

## API Endpoints

### POST /api/orders

Place a new order during checkout.

Request body:

    {
      "userId": "user123",
      "customerName": "John Doe",
      "phone": "01712345678",
      "deliveryAddress": "Dhaka, Bangladesh",
      "restaurantId": "restaurant123",
      "restaurantName": "Burger House",
      "items": [
        {
          "menuItemId": "item123",
          "menuItemName": "Cheese Burger",
          "menuItemImage": "https://example.com/burger.jpg",
          "menuItemPrice": 250,
          "quantity": 2
        },
        {
          "menuItemId": "item456",
          "menuItemName": "French Fries",
          "menuItemImage": "https://example.com/fries.jpg",
          "menuItemPrice": 120,
          "quantity": 1
        }
      ],
      "itemCount": 3,
      "subtotal": 620,
      "deliveryFee": 0,
      "total": 620
    }

The order status is automatically set to `PENDING` and the creation time is automatically recorded.

---

### GET /api/orders/{orderId}

Retrieve a specific order by its ID.

Example:

    GET http://localhost:9004/api/orders/order123

---

### GET /api/orders/user/{userId}

Retrieve all orders placed by a specific user.

Example:

    GET http://localhost:9004/api/orders/user/user123

This endpoint can be used to display the user's order history.

---

### GET /api/orders/restaurant/{restaurantId}

Retrieve all orders placed for a specific restaurant.

Example:

    GET http://localhost:9004/api/orders/restaurant/restaurant123

This endpoint can be used by the restaurant dashboard to display incoming orders.

---

### PUT /api/orders/{orderId}/status?status=CONFIRMED

Update the status of an order.

Example:

    PUT http://localhost:9004/api/orders/order123/status?status=CONFIRMED

Available order statuses:

    PENDING
    CONFIRMED
    PREPARING
    OUT_FOR_DELIVERY
    DELIVERED
    CANCELLED

## Order Flow

The order follows this general flow:

    Checkout
       ↓
    PENDING
       ↓
    CONFIRMED
       ↓
    PREPARING
       ↓
    OUT_FOR_DELIVERY
       ↓
    DELIVERED

An order can also be changed to:

    CANCELLED

## Order Data

Each order stores:

- User ID
- Customer Name
- Phone
- Delivery Address
- Restaurant ID
- Restaurant Name
- Ordered Items
- Item Count
- Subtotal
- Delivery Fee
- Total
- Order Status
- Creation Timestamp

Menu item information is stored as a snapshot inside the order so that the original menu item details remain available even if the restaurant later changes the menu.

## Database

MongoDB Database:

    foodexpress_order

MongoDB Collection:

    orders

Example document:

    {
      "id": "...",
      "userId": "user123",
      "customerName": "John Doe",
      "phone": "01712345678",
      "deliveryAddress": "Dhaka, Bangladesh",
      "restaurantId": "restaurant123",
      "restaurantName": "Burger House",
      "items": [
        {
          "menuItem": {
            "id": "item123",
            "name": "Cheese Burger",
            "image": "https://example.com/burger.jpg",
            "price": 250
          },
          "quantity": 2
        }
      ],
      "itemCount": 2,
      "subtotal": 500,
      "deliveryFee": 0,
      "total": 500,
      "status": "PENDING",
      "createdAt": "2026-08-08T10:30:00"
    }

## Connecting from Frontend

The frontend expects the order API at:

    http://localhost:9004/api/orders

Set the following in the frontend `.env` file:

    VITE_ORDER_API_URL=http://localhost:9004/api/orders