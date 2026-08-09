# Order Service

FoodExpress order microservice. Handles order placement, retrieving orders, viewing user order history, viewing restaurant orders, calculating order totals, and updating order status.

## Tech Stack

- Java 17
- Spring Boot 4.1.0
- Spring Data MongoDB
- MongoDB
- Spring Web MVC

## Run Locally

```bash
cd server/order-service
./mvnw spring-boot:run
```

The service starts on **http://localhost:9004**.

## API Endpoints

### POST /api/orders

Place a new order during checkout.

The client sends only the order and item information. The Order Service automatically calculates the item count, subtotal, delivery fee, and total amount.

Request body:

```json
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
  ]
}
```

The Order Service automatically calculates:

```text
Item Count = 3
Subtotal   = 620
Delivery   = 0
Total      = 620
```

The order status is automatically set to `PENDING` and the creation time is automatically recorded.

The client should **not** send:

- `itemCount`
- `subtotal`
- `deliveryFee`
- `total`

These values are calculated by the Order Service.

---

### GET /api/orders/{orderId}

Retrieve a specific order by its ID.

Example:

```http
GET http://localhost:9004/api/orders/order123
```

---

### GET /api/orders/user/{userId}

Retrieve all orders placed by a specific user.

Example:

```http
GET http://localhost:9004/api/orders/user/user123
```

This endpoint can be used to display the user's order history.

---

### GET /api/orders/restaurant/{restaurantId}

Retrieve all orders placed for a specific restaurant.

Example:

```http
GET http://localhost:9004/api/orders/restaurant/restaurant123
```

This endpoint can be used by the restaurant dashboard to display incoming orders.

---

### PUT /api/orders/{orderId}/status?status=CONFIRMED

Update the status of an order.

Example:

```http
PUT http://localhost:9004/api/orders/order123/status?status=CONFIRMED
```

Available order statuses:

```text
PENDING
CONFIRMED
PREPARING
OUT_FOR_DELIVERY
DELIVERED
CANCELLED
```

## Order Calculation

The Order Service is responsible for calculating the final order amount.

The calculation is based on the price and quantity of each ordered item.

```text
Subtotal = Sum of (Item Price × Quantity)

Delivery Fee:
- 0 when subtotal is 0
- 0 when subtotal is 500 or more
- 60 when subtotal is below 500

Total = Subtotal + Delivery Fee
```

For example:

```text
Cheese Burger: 250 × 2 = 500
French Fries:  120 × 1 = 120
--------------------------------
Subtotal                  = 620
Delivery Fee              = 0
Total                     = 620
```

The frontend does not determine the final order amount.

## Order Flow

The order follows this general flow:

```text
Checkout
   ↓
Order Service
   ↓
Calculate Order Amount
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
```

An order can also be changed to:

```text
CANCELLED
```

## Microservice Responsibilities

### Cart Service

The Cart Service is responsible for:

- Adding items to the cart
- Updating item quantities
- Removing items
- Retrieving the cart
- Clearing the cart

The Cart Service does not calculate the final order amount.

### Order Service

The Order Service is responsible for:

- Creating orders
- Calculating item count
- Calculating subtotal
- Calculating delivery fee
- Calculating total amount
- Storing order information
- Managing order status
- Providing order history
- Providing restaurant orders

### Payment Service

The Payment Service will be responsible for processing the actual payment after the Order Service determines the amount that needs to be paid.

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

```text
foodexpress_order
```

MongoDB Collection:

```text
orders
```

Example document:

```json
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
```

## Connecting from Frontend

The frontend expects the order API at:

```text
http://localhost:9004/api/orders
```

Set the following in the frontend `.env` file:

```env
VITE_ORDER_API_URL=http://localhost:9004/api/orders
```