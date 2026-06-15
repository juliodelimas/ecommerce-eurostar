# E-Commerce Eurostar REST API

## Description

REST API for an e-commerce platform built with JavaScript and Express. Consumers can register, log in to receive a JWT token, and perform authenticated checkouts. All data is stored in memory — no database is required.

The API follows a layered architecture with Routes, Middleware, Controllers, Services, and Models under the `src` folder.

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd ecommerce-eurostar
```

2. Install dependencies:

```bash
npm install
```

## How to Run

Start the server:

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

The API runs on `http://localhost:3000` by default. You can change the port with the `PORT` environment variable.

## Rules

### Checkout

- **Payment methods**: Only `cash` or `credit_card` are accepted.
- **Cash discount**: Paying with `cash` applies a **10% discount** on the subtotal.
- **Authentication**: Only authenticated users (with a valid JWT token) can perform checkout.

### API

- Exactly **4 endpoints**: `POST /register`, `POST /login`, `POST /checkout`, and `GET /healthcheck`.
- All user and product data lives **in memory** and resets when the server restarts.

## Existent Data

### Users (password for all: `password123`)

| ID | Name            | Email               |
|----|-----------------|---------------------|
| 1  | Alice Johnson   | alice@example.com   |
| 2  | Bob Smith       | bob@example.com     |
| 3  | Carol Williams  | carol@example.com   |

### Products

| ID | Name                 | Price   | Stock |
|----|----------------------|---------|-------|
| 1  | Wireless Headphones  | $99.99  | 50    |
| 2  | Smart Watch          | $199.99 | 30    |
| 3  | USB-C Hub            | $49.99  | 100   |

## How to Use the Rest API

### 1. Healthcheck

Verify the API is running:

```bash
curl http://localhost:3000/healthcheck
```

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2026-06-15T12:00:00.000Z"
}
```

### 2. Register

Create a new user account:

```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "mypassword"
  }'
```

**Response:**

```json
{
  "user": {
    "id": 4,
    "email": "john@example.com",
    "name": "John Doe"
  },
  "token": "<JWT_TOKEN>"
}
```

### 3. Login

Authenticate and receive a JWT token:

```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "password123"
  }'
```

**Response:**

```json
{
  "user": {
    "id": 1,
    "email": "alice@example.com",
    "name": "Alice Johnson"
  },
  "token": "<JWT_TOKEN>"
}
```

### 4. Checkout

Perform a checkout (requires authentication). Use the token from login or register in the `Authorization` header.

**Cash payment (10% discount):**

```bash
curl -X POST http://localhost:3000/checkout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "items": [
      { "productId": 1, "quantity": 2 },
      { "productId": 3, "quantity": 1 }
    ],
    "paymentMethod": "cash"
  }'
```

**Credit card payment (no discount):**

```bash
curl -X POST http://localhost:3000/checkout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -d '{
    "items": [
      { "productId": 2, "quantity": 1 }
    ],
    "paymentMethod": "credit_card"
  }'
```

**Response (cash example):**

```json
{
  "orderId": 1718452800000,
  "userId": 1,
  "items": [
    {
      "productId": 1,
      "name": "Wireless Headphones",
      "price": 99.99,
      "quantity": 2,
      "itemTotal": 199.98
    },
    {
      "productId": 3,
      "name": "USB-C Hub",
      "price": 49.99,
      "quantity": 1,
      "itemTotal": 49.99
    }
  ],
  "paymentMethod": "cash",
  "subtotal": 249.97,
  "discount": 25.0,
  "discountRate": "10%",
  "total": 224.97
}
```

### Error Responses

| Status | Scenario                                      |
|--------|-----------------------------------------------|
| 400    | Missing or invalid request data               |
| 401    | Missing, invalid, or expired JWT token        |
| 404    | Product not found                             |
| 409    | Email already registered                      |
| 500    | Internal server error                         |
