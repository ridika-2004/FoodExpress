# Cart Service

FoodExpress cart microservice. Handles shopping cart operations, including adding items, updating quantities, removing items, clearing the cart, and calculating cart totals.

## Tech Stack

- Java 17
- Spring Boot 4.1.0
- Spring Data MongoDB
- MongoDB
- Spring Web MVC

## Run Locally

```bash
cd server/cart-service
./mvnw spring-boot:run
```

The service starts on **http://localhost:9003**.

## API Endpoints

### POST /api/cart/items

Add an item to the user's cart.

```json
{
  "userId": "user123",
  "restaurantId": "restaurant123",
  "restaurantName": "Burger House",
  "menuItemId": "item123",
  "menuItemName": "Cheese Burger",
  "menuItemImage": "https://example.com/burger.jpg",
  "menuItemPrice": 250,
  "quantity": 1
}
```

---

### GET /api/cart/{userId}

Retrieve the current cart of a user.

Example:

```http
GET /api/cart/user123
```

---

### PUT /api/cart/{userId}/items/{menuItemId}?quantity=2

Update the quantity of an item in the cart.

Example:

```http
PUT /api/cart/user123/items/item123?quantity=2
```

---

### DELETE /api/cart/{userId}/items/{menuItemId}

Remove a single item from the cart.

Example:

```http
DELETE /api/cart/user123/items/item123
```

---

### DELETE /api/cart/{userId}

Clear the entire cart.

Example:

```http
DELETE /api/cart/user123
```

## Cart Calculations

The cart service automatically calculates:

- Item Count
- Subtotal
- Delivery Fee
- Total Price

The frontend does **not** calculate these values. Every cart response returns the updated totals.

## Business Rules

- A cart belongs to a single user.
- A cart can contain items from **only one restaurant** at a time.
- Adding an item from a different restaurant replaces the existing cart.
- Updating an item's quantity automatically recalculates the cart totals.
- Setting an item's quantity to **0 or less** removes it from the cart.
- Clearing the cart removes all items and resets all totals.

## Database

MongoDB Collection:

```
carts
```

Example document:

```json
{
  "id": "...",
  "userId": "user123",
  "restaurantId": "restaurant123",
  "restaurantName": "Burger House",
  "items": [
    {
      "menuItemId": "item123",
      "menuItemName": "Cheese Burger",
      "menuItemImage": "https://example.com/burger.jpg",
      "menuItemPrice": 250,
      "quantity": 2
    }
  ],
  "itemCount": 2,
  "subtotal": 500,
  "deliveryFee": 25,
  "total": 525
}
```

## Connecting from Frontend

The frontend expects the cart API at:

```
http://localhost:9003/api/cart
```

Set the following in the frontend `.env` file:

```env
VITE_CART_API_URL=http://localhost:9003/api/cart
```