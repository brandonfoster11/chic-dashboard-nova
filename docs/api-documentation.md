# StyleAI API Documentation

## Overview
This document provides comprehensive documentation for all API endpoints and services in the StyleAI application.

## Authentication API

### Register User
- **Endpoint**: `/auth/register`
- **Method**: POST
- **Description**: Creates a new user account
- **Request Body**:
  ```typescript
  {
    email: string;
    password: string;
    username?: string;
    full_name?: string;
  }
  ```
- **Response**: 
  ```typescript
  {
    user: User;
    session: Session;
  }
  ```
- **Error Codes**:
  - 400: Invalid input
  - 409: Email already exists
  - 500: Server error

### Login
- **Endpoint**: `/auth/login`
- **Method**: POST
- **Description**: Authenticates a user and creates a session
- **Request Body**:
  ```typescript
  {
    email: string;
    password: string;
  }
  ```
- **Response**: 
  ```typescript
  {
    user: User;
    session: Session;
  }
  ```
- **Error Codes**:
  - 400: Invalid credentials
  - 429: Too many attempts (rate limited)
  - 500: Server error

### Reset Password
- **Endpoint**: `/auth/reset-password`
- **Method**: POST
- **Description**: Sends a password reset email
- **Request Body**:
  ```typescript
  {
    email: string;
  }
  ```
- **Response**: 
  ```typescript
  {
    success: boolean;
  }
  ```

### Logout
- **Endpoint**: `/auth/logout`
- **Method**: POST
- **Description**: Ends the current user session
- **Response**: 
  ```typescript
  {
    success: boolean;
  }
  ```

## Wardrobe API

### Get Wardrobe Items
- **Endpoint**: `/wardrobe`
- **Method**: GET
- **Description**: Retrieves all wardrobe items for the authenticated user
- **Query Parameters**:
  - `category`: Filter by category
  - `limit`: Maximum number of items to return
  - `offset`: Number of items to skip
- **Response**: 
  ```typescript
  {
    items: WardrobeItem[];
    count: number;
  }
  ```

### Get Wardrobe Item
- **Endpoint**: `/wardrobe/:id`
- **Method**: GET
- **Description**: Retrieves a specific wardrobe item
- **Response**: 
  ```typescript
  {
    item: WardrobeItem;
  }
  ```
- **Error Codes**:
  - 404: Item not found

### Create Wardrobe Item
- **Endpoint**: `/wardrobe`
- **Method**: POST
- **Description**: Creates a new wardrobe item
- **Request Body**:
  ```typescript
  {
    name: string;
    category: string;
    subcategory?: string;
    color?: string;
    pattern?: string;
    brand?: string;
    seasons?: string[];
    formality?: number;
    size?: string;
    condition?: string;
    price?: number;
    purchase_date?: string;
    notes?: string;
    image_url?: string;
  }
  ```
- **Response**: 
  ```typescript
  {
    item: WardrobeItem;
  }
  ```
- **Error Codes**:
  - 400: Invalid input
  - 500: Server error

### Update Wardrobe Item
- **Endpoint**: `/wardrobe/:id`
- **Method**: PUT
- **Description**: Updates an existing wardrobe item
- **Request Body**: Same as Create Wardrobe Item
- **Response**: 
  ```typescript
  {
    item: WardrobeItem;
  }
  ```
- **Error Codes**:
  - 400: Invalid input
  - 404: Item not found
  - 500: Server error

### Delete Wardrobe Item
- **Endpoint**: `/wardrobe/:id`
- **Method**: DELETE
- **Description**: Deletes a wardrobe item
- **Response**: 
  ```typescript
  {
    success: boolean;
  }
  ```
- **Error Codes**:
  - 404: Item not found
  - 500: Server error

## Outfit API

### Get Outfits
- **Endpoint**: `/outfits`
- **Method**: GET
- **Description**: Retrieves all outfits for the authenticated user
- **Query Parameters**:
  - `occasion`: Filter by occasion
  - `season`: Filter by season
  - `limit`: Maximum number of outfits to return
  - `offset`: Number of outfits to skip
- **Response**: 
  ```typescript
  {
    outfits: Outfit[];
    count: number;
  }
  ```

### Get Outfit
- **Endpoint**: `/outfits/:id`
- **Method**: GET
- **Description**: Retrieves a specific outfit with its items
- **Response**: 
  ```typescript
  {
    outfit: Outfit;
    items: WardrobeItem[];
  }
  ```
- **Error Codes**:
  - 404: Outfit not found

### Create Outfit
- **Endpoint**: `/outfits`
- **Method**: POST
- **Description**: Creates a new outfit
- **Request Body**:
  ```typescript
  {
    name: string;
    description?: string;
    occasion?: string;
    season?: string;
    items?: string[]; // Array of wardrobe item IDs
  }
  ```
- **Response**: 
  ```typescript
  {
    outfit: Outfit;
  }
  ```
- **Error Codes**:
  - 400: Invalid input
  - 500: Server error

### Update Outfit
- **Endpoint**: `/outfits/:id`
- **Method**: PUT
- **Description**: Updates an existing outfit
- **Request Body**: Same as Create Outfit
- **Response**: 
  ```typescript
  {
    outfit: Outfit;
  }
  ```
- **Error Codes**:
  - 400: Invalid input
  - 404: Outfit not found
  - 500: Server error

### Delete Outfit
- **Endpoint**: `/outfits/:id`
- **Method**: DELETE
- **Description**: Deletes an outfit
- **Response**: 
  ```typescript
  {
    success: boolean;
  }
  ```
- **Error Codes**:
  - 404: Outfit not found
  - 500: Server error

### Generate Outfit
- **Endpoint**: `/outfits/generate`
- **Method**: POST
- **Description**: Generates an outfit based on user preferences and wardrobe items
- **Request Body**:
  ```typescript
  {
    occasion?: string;
    season?: string;
    preferences?: Record<string, any>;
  }
  ```
- **Response**: 
  ```typescript
  {
    outfit: Outfit;
    items: WardrobeItem[];
  }
  ```
- **Error Codes**:
  - 400: Invalid input
  - 429: Rate limit exceeded
  - 500: Server error

## User Profile API

### Get Profile
- **Endpoint**: `/profile`
- **Method**: GET
- **Description**: Retrieves the authenticated user's profile
- **Response**: 
  ```typescript
  {
    profile: Profile;
  }
  ```

### Update Profile
- **Endpoint**: `/profile`
- **Method**: PUT
- **Description**: Updates the authenticated user's profile
- **Request Body**:
  ```typescript
  {
    username?: string;
    full_name?: string;
    avatar_url?: string;
    style_preferences?: Record<string, any>;
    body_measurements?: Record<string, any>;
  }
  ```
- **Response**: 
  ```typescript
  {
    profile: Profile;
  }
  ```
- **Error Codes**:
  - 400: Invalid input
  - 500: Server error

## Style Preferences API

### Get Style Preferences
- **Endpoint**: `/style-preferences`
- **Method**: GET
- **Description**: Retrieves the authenticated user's style preferences
- **Response**: 
  ```typescript
  {
    preferences: StylePreference;
  }
  ```

### Update Style Preferences
- **Endpoint**: `/style-preferences`
- **Method**: PUT
- **Description**: Updates the authenticated user's style preferences
- **Request Body**:
  ```typescript
  {
    preferences: Record<string, any>;
  }
  ```
- **Response**: 
  ```typescript
  {
    preferences: StylePreference;
  }
  ```
- **Error Codes**:
  - 400: Invalid input
  - 500: Server error

## Storage API

### Upload Image
- **Endpoint**: `/storage/upload`
- **Method**: POST
- **Description**: Uploads an image to the wardrobe storage bucket
- **Request Body**: FormData with 'image' file
- **Response**: 
  ```typescript
  {
    url: string;
  }
  ```
- **Error Codes**:
  - 400: Invalid file type or size
  - 429: Rate limit exceeded
  - 500: Server error

## CCPA Compliance API

### Export User Data
- **Endpoint**: `/privacy/export`
- **Method**: GET
- **Description**: Exports all user data in compliance with CCPA
- **Response**: JSON file download containing all user data

### Delete User Data
- **Endpoint**: `/privacy/delete`
- **Method**: POST
- **Description**: Deletes all user data in compliance with CCPA
- **Response**: 
  ```typescript
  {
    success: boolean;
  }
  ```

### Anonymize User Data
- **Endpoint**: `/privacy/anonymize`
- **Method**: POST
- **Description**: Anonymizes user data as an alternative to deletion
- **Response**: 
  ```typescript
  {
    success: boolean;
  }
  ```

## Rate Limits

| Endpoint | Rate Limit |
|----------|------------|
| `/auth/login` | 5 requests per 5 minutes |
| `/outfits/generate` | 5 requests per minute |
| `/storage/upload` | 10 requests per hour |
| All other endpoints | 20 requests per minute |

## Error Handling

All API endpoints return errors in the following format:

```typescript
{
  error: {
    code: number;
    message: string;
    details?: any;
  }
}
```

Common error codes:
- 400: Bad Request - Invalid input parameters
- 401: Unauthorized - Authentication required
- 403: Forbidden - Insufficient permissions
- 404: Not Found - Resource not found
- 429: Too Many Requests - Rate limit exceeded
- 500: Internal Server Error - Server-side error
