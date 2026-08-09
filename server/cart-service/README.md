# Cart Service

FoodExpress cart microservice. Handles shopping cart operations, including adding items, updating quantities, removing items, retrieving the cart, and clearing the cart.

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

The service starts on **[http://localhost:9003](http://localhost:9003)**.

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

If the quantity is **0 or less**, the item is removed from the cart.

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

## Cart Responsibilities

The Cart Service is responsible only for managing cart contents.

It handles:

- Adding items
- Retrieving the cart
- Updating item quantities
- Removing items
- Clearing the cart
- Storing menu item information and quantity

The Cart Service does **not** calculate:

- Item Count
- Subtotal
- Delivery Fee
- Total Price

These calculations are handled by the **Order Service during checkout**.

## Business Rules

- A cart belongs to a single user.
- A cart can contain items from **only one restaurant** at a time.
- Adding an item from a different restaurant replaces the existing cart.
- Adding an existing menu item increases its quantity.
- Updating an item's quantity changes only that item's quantity.
- Setting an item's quantity to **0 or less** removes it from the cart.
- Removing an item removes it completely from the cart.
- Clearing the cart removes all items.
- The Cart Service does not calculate order totals.

## Database

MongoDB Collection:

```text
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
      "menuItem": {
        "id": "item123",
        "name": "Cheese Burger",
        "image": "https://example.com/burger.jpg",
        "price": 250
      },
      "quantity": 2
    }
  ]
}
```

## Connecting from Frontend

The frontend expects the cart API at:

```text
http://localhost:9003/api/cart
```

Set the following in the frontend `.env` file:

```env
VITE_CART_API_URL=http://localhost:9003/api/cart
```

## Checkout Integration

During checkout, the frontend will use the items stored in the Cart Service to create an order through the Order Service.

The flow is:

```text
Frontend
   ↓
Cart Service
   ↓
Retrieve Cart Items
   ↓
Order Service
   ↓
Calculate Subtotal
   ↓
Calculate Delivery Fee
   ↓
Calculate Total
   ↓
Create Order
   ↓
Clear Cart
```