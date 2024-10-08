# Plant Wiki API Documentation

This document provides details on the available API endpoints for the Plant Wiki Website.

## Table of Contents

1. [Authentication](#authentication)
2. [Users](#users)
3. [Plants](#plants)
4. [Articles](#articles)
5. [Discussions](#discussions)
6. [User Plants](#user-plants)
7. [Rooms](#rooms)
8. [Watering and Fertilizing](#watering-and-fertilizing)
9. [Wishlist and Graveyard](#wishlist-and-graveyard)
10. [Moderation](#moderation)

## Authentication

### Register a new user

```
POST /api/auth/register
```

Request body:
```json
{
  "username": "plantlover",
  "email": "user@example.com",
  "password": "password123"
}
```

### Login

```
POST /api/auth/login
```

Request body:
```json
{
  "username": "plantlover",
  "password": "password123"
}
```

## Users

### Get user profile

```
GET /api/users/profile
```

### Update user profile

```
PUT /api/users/profile
```

Request body:
```json
{
  "username": "newusername",
  "email": "newemail@example.com"
}
```

### Search users

```
GET /api/users/search?q=searchterm
```

## Plants

### Get all plants

```
GET /api/plants
```

### Create a new plant

```
POST /api/plants
```

Request body:
```json
{
  "name": "Monstera Deliciosa",
  "scientificName": "Monstera deliciosa",
  "commonName": "Swiss Cheese Plant",
  "family": "Araceae",
  "light": "Bright indirect light",
  "temperature": "65-85°F",
  "soil": "Well-draining potting mix",
  "climate": "Tropical",
  "humidity": "High",
  "growthCycle": "Perennial",
  "toxicity": "Mildly toxic to pets and humans",
  "petSafe": false,
  "plantType": "Climbing vine",
  "sex": "Monoecious"
}
```

### Get plant details

```
GET /api/plants/{id}
```

### Update a plant

```
PUT /api/plants/{id}
```

Request body: (same as create plant)

## Articles

### Get all articles

```
GET /api/articles
```

### Create a new article

```
POST /api/articles
```

Request body:
```json
{
  "title": "Caring for Monstera Deliciosa",
  "content": "Monstera deliciosa, also known as the Swiss Cheese Plant, is a popular houseplant...",
  "plantId": 1
}
```

### Get article details

```
GET /api/articles/{id}
```

### Update an article

```
PUT /api/articles/{id}
```

Request body: (same as create article)

## Discussions

### Get discussions for an article

```
GET /api/discussions?articleId=1
```

### Create a new discussion

```
POST /api/discussions
```

Request body:
```json
{
  "content": "Great article! I have a question about watering frequency.",
  "articleId": 1,
  "parentId": null
}
```

## User Plants

### Get user's plant library

```
GET /api/users/library
```

### Add plant to user's library

```
POST /api/users/library/plants
```

Request body:
```json
{
  "plantId": 1,
  "nickname": "Monty",
  "roomId": 2,
  "notes": "Got this as a gift from Mom"
}
```

## Rooms

### Get user's rooms

```
GET /api/users/rooms
```

### Create a new room

```
POST /api/users/rooms
```

Request body:
```json
{
  "name": "Living Room",
  "type": "LIVING_ROOM",
  "sunlight": "Bright indirect",
  "humidity": "Medium"
}
```

## Watering and Fertilizing

### Log watering

```
POST /api/users/library/plants/{id}/watering
```

Request body:
```json
{
  "date": "2023-06-15T10:30:00Z",
  "amount": 250,
  "notes": "Used rainwater"
}
```

### Log fertilizing

```
POST /api/users/library/plants/{id}/fertilizing
```

Request body:
```json
{
  "date": "2023-06-15T10:30:00Z",
  "fertilizer": "Organic liquid fertilizer",
  "amount": 50,
  "notes": "Half-strength solution"
}
```

## Wishlist and Graveyard

### Get user's wishlist

```
GET /api/users/wishlist
```

### Add plant to wishlist

```
POST /api/users/wishlist
```

Request body:
```json
{
  "plantName": "Philodendron Pink Princess"
}
```

### Get user's plant graveyard

```
GET /api/users/graveyard
```

### Add plant to graveyard

```
POST /api/users/graveyard
```

Request body:
```json
{
  "plantName": "Fiddle Leaf Fig",
  "startDate": "2023-01-01T00:00:00Z",
  "endDate": "2023-06-01T00:00:00Z"
}
```

## Moderation

### Get pending change requests

```
GET /api/moderation/change-requests
```

### Review change request

```
PUT /api/moderation/change-requests/{id}
```

Request body:
```json
{
  "action": "approve",
  "comment": "Looks good, thanks for the contribution!"
}
```

### Flag content

```
POST /api/moderation/flags
```

Request body:
```json
{
  "type": "DISCUSSION",
  "contentId": 123,
  "reason": "Inappropriate language"
}
```

This API documentation covers the main endpoints of the Plant Wiki Website. Ensure proper authentication and authorization are implemented for these endpoints in your application.