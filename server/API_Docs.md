# API Documentation

## Base URL

```
http://localhost:3000
```

## Authentication

All product endpoints require Bearer token authentication in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Routes

### POST /register

**Description:** Register a new user account

**Request:**

```json
{
  "username": "string (required)",
  "password": "string (required)"
}
```

**Response (201 - Created):**

```json
{
  "id": 1,
  "username": "testuser"
}
```

**Error Responses:**

- **400 Bad Request:**
  ```json
  {
    "error": "Username and password are required"
  }
  ```
- **400 Bad Request (Duplicate Username):**
  ```json
  {
    "error": "Username already exists"
  }
  ```

---

### POST /login

**Description:** Login with existing user credentials

**Request:**

```json
{
  "username": "string (required)",
  "password": "string (required)"
}
```

**Response (200 - OK):**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**

- **401 Unauthorized:**
  ```json
  {
    "error": "Invalid credentials"
  }
  ```
- **400 Bad Request:**
  ```json
  {
    "error": "Username and password are required"
  }
  ```

---

## Product Routes

### GET /products

**Description:** Get all products with pagination

**Request:**

- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters (Optional):**
  - `page`: number (default: 1)
  - `limit`: number (default: 10)

**Example:** `GET /products?page=1&limit=5`

**Response (200 - OK):**

```json
{
  "products": [
    {
      "id": 1,
      "name": "Product Name",
      "description": "Product description",
      "userId": 1,
      "image": "https://picsum.photos/200/200?random=Product_Name"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalProducts": 25,
    "limit": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

**Error Responses:**

- **401 Unauthorized:**
  ```json
  {
    "error": "Access denied. No token provided."
  }
  ```
- **401 Unauthorized (Invalid Token):**
  ```json
  {
    "error": "Invalid token."
  }
  ```

---

### GET /products/:id

**Description:** Get a specific product by ID

**Request:**

- **Headers:** `Authorization: Bearer <token>`
- **URL Parameters:** `id` (integer, required)

**Example:** `GET /products/1`

**Response (200 - OK):**

```json
{
  "id": 1,
  "name": "Product Name",
  "description": "Product description",
  "userId": 1,
  "image": "https://picsum.photos/200/200?random=Product_Name"
}
```

**Error Responses:**

- **400 Bad Request:**
  ```json
  {
    "error": "Invalid product ID"
  }
  ```
- **404 Not Found:**
  ```json
  {
    "error": "Product not found"
  }
  ```
- **401 Unauthorized:**
  ```json
  {
    "error": "Access denied. No token provided."
  }
  ```

---

### POST /products

**Description:** Create a new product

**Request:**

- **Headers:** `Authorization: Bearer <token>`
- **Body:**

```json
{
  "name": "string (required)",
  "description": "string (required)"
}
```

**Response (201 - Created):**

```json
{
  "id": 1,
  "name": "Product Name",
  "description": "Product description",
  "userId": 1,
  "image": "https://picsum.photos/200/200?random=Product_Name"
}
```

**Error Responses:**

- **400 Bad Request:**
  ```json
  {
    "error": "Name and description are required"
  }
  ```
- **401 Unauthorized:**
  ```json
  {
    "error": "Access denied. No token provided."
  }
  ```

---

### PUT /products/:id

**Description:** Update an existing product (only by owner)

**Request:**

- **Headers:** `Authorization: Bearer <token>`
- **URL Parameters:** `id` (integer, required)
- **Body:**

```json
{
  "name": "string (required)",
  "description": "string (required)"
}
```

**Response (200 - OK):**

```json
{
  "id": 1,
  "name": "Updated Product Name",
  "description": "Updated product description",
  "userId": 1,
  "image": "https://picsum.photos/200/200?random=Updated_Product_Name"
}
```

**Error Responses:**

- **400 Bad Request:**
  ```json
  {
    "error": "Name and description are required"
  }
  ```
- **401 Unauthorized:**
  ```json
  {
    "error": "Access denied. No token provided."
  }
  ```
- **403 Forbidden:**
  ```json
  {
    "error": "Access denied. You can only update your own products."
  }
  ```
- **404 Not Found:**
  ```json
  {
    "error": "Product not found"
  }
  ```

---

### DELETE /products/:id

**Description:** Delete a product (only by owner)

**Request:**

- **Headers:** `Authorization: Bearer <token>`
- **URL Parameters:** `id` (integer, required)

**Response (200 - OK):**

```json
{
  "message": "Product deleted successfully"
}
```

**Error Responses:**

- **401 Unauthorized:**
  ```json
  {
    "error": "Access denied. No token provided."
  }
  ```
- **403 Forbidden:**
  ```json
  {
    "error": "Access denied. You can only delete your own products."
  }
  ```
- **404 Not Found:**
  ```json
  {
    "error": "Product not found"
  }
  ```

---

## Common Error Codes

| Status Code | Description                                      |
| ----------- | ------------------------------------------------ |
| 400         | Bad Request - Invalid input data                 |
| 401         | Unauthorized - Missing or invalid authentication |
| 403         | Forbidden - Access denied to resource            |
| 404         | Not Found - Resource not found                   |
| 500         | Internal Server Error - Server error             |

## Notes

1. **Image Generation:** Product images are automatically generated using Lorem Picsum service based on the product name
2. **Authentication:** JWT tokens are required for all product operations
3. **Authorization:** Users can only modify/delete their own products
4. **Pagination:** Default pagination is 10 items per page
5. **Product Naming:** Special characters in product names are sanitized for image URL generation
