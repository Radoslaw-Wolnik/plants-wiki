# PlantPal API Documentation

## Table of Contents
1. [Authentication](#authentication)
2. [Users](#users)
3. [Plants](#plants)
4. [Articles](#articles)
5. [Discussions](#discussions)
6. [Rooms](#rooms)
7. [Trade Offers](#trade-offers)
8. [Notifications](#notifications)
9. [Moderation](#moderation)

## Authentication

Authentication is handled using NextAuth.js. Most endpoints require a valid session.

```
POST /api/auth/[...nextauth]
```

## Users

### Get User Profile

```
🔒 GET /api/users/profile
Response: SafeUser
```

Returns the profile of the authenticated user.

### Update User Profile

```
🔒 PUT /api/users/profile
Body: { username?: string, email?: string }
Response: SafeUser
```

Updates the profile of the authenticated user.

### Upload Profile Picture

```
🔒 POST /api/users/profile/picture
Body: FormData (file)
Response: { success: boolean, fileUrl: string }
```

Uploads a new profile picture for the authenticated user.

### Get User Library

```
🔒 GET /api/users/[id]/library?page=number&limit=number&search=string
Response: {
  library: UserLibrary & { userPlants: (UserPlant & { plant: Plant, room: Room })[] },
  pagination: { currentPage: number, totalPages: number, totalCount: number }
}
```

Retrieves the plant library for a specific user.

### Add Plant to Library

```
🔒 POST /api/users/library/plants
Body: { plantId: number, nickname?: string, roomId?: number, notes?: string }
Response: UserPlant & { plant: Plant, room: Room }
```

Adds a new plant to the user's library.

### Get User Plant Details

```
🔒 GET /api/users/library/plants?userPlantId=number
Response: UserPlant & { 
  plant: Plant, 
  room: Room, 
  photos: UserPlantPhoto[], 
  wateringLogs: WateringLog[], 
  fertilizingLogs: FertilizingLog[] 
}
```

Retrieves detailed information about a specific plant in the user's library.

### Update User Plant

```
🔒 PUT /api/users/library/plants/[id]
Body: FormData (data: string, file?: File)
Response: { success: boolean, plant: UserPlant }
```

Updates information about a specific plant in the user's library.

### Log Watering for User Plant

```
🔒 POST /api/users/library/plants/[id]/watering
Body: { date: string, amount?: number, notes?: string }
Response: WateringLog
```

Logs a watering event for a specific plant.

### Log Fertilizing for User Plant

```
🔒 POST /api/users/library/plants/[id]/fertilizing
Body: { date: string, fertilizer: string, amount?: number, notes?: string }
Response: FertilizingLog
```

Logs a fertilizing event for a specific plant.

### Move Plant to Room

```
🔒 PUT /api/users/library/plants/[id]/move
Body: { roomId: number }
Response: UserPlant & { plant: Plant, room: Room }
```

Moves a plant to a different room.

### Add Plant to Graveyard

```
🔒 POST /api/users/library/plants/[id]/graveyard
Body: { endDate: string }
Response: GraveyardPlant
```

Moves a plant from the user's library to the graveyard.

### Get User Rooms

```
🔒 GET /api/users/rooms
Response: (Room & { userPlants: { id: number, nickname: string, plant: { name: string, icon: string } }[] })[]
```

Retrieves all rooms belonging to the authenticated user.

### Create Room

```
🔒 POST /api/users/rooms
Body: { name: string, type: RoomType, sunlight: string, humidity: string }
Response: Room
```

Creates a new room for the authenticated user.

### Update Room

```
🔒 PUT /api/users/rooms?id=number
Body: { name: string, type: RoomType, sunlight: string, humidity: string }
Response: Room
```

Updates an existing room.

### Delete Room

```
🔒 DELETE /api/users/rooms?id=number
Response: { message: string }
```

Deletes a room.

### Get User Wishlist

```
🔒 GET /api/users/wishlist
Response: WishlistPlant[]
```

Retrieves the user's plant wishlist.

### Add to Wishlist

```
🔒 POST /api/users/wishlist
Body: { plantName: string }
Response: WishlistPlant
```

Adds a plant to the user's wishlist.

### Remove from Wishlist

```
🔒 DELETE /api/users/wishlist?id=number
Response: { message: string }
```

Removes a plant from the user's wishlist.

### Get User Graveyard

```
🔒 GET /api/users/graveyard
Response: GraveyardPlant[]
```

Retrieves the user's plant graveyard.

### Add to Graveyard

```
🔒 POST /api/users/graveyard
Body: { plantName: string, startDate: string, endDate: string }
Response: GraveyardPlant
```

Adds a plant to the user's graveyard.

### Remove from Graveyard

```
🔒 DELETE /api/users/graveyard?id=number
Response: { message: string }
```

Removes a plant from the user's graveyard.

### Get User Friends

```
🔒 GET /api/users/friends
Response: { id: number, username: string, profilePicture: string }[]
```

Retrieves the user's friends list.

### Add Friend

```
🔒 POST /api/users/friends
Body: { friendId: number }
Response: { id: number, username: string, profilePicture: string }
```

Adds a new friend to the user's friend list.

### Remove Friend

```
🔒 DELETE /api/users/friends?id=number
Response: { message: string }
```

Removes a friend from the user's friend list.

### Search Users

```
🔒 GET /api/users/search?q=string
Response: { id: number, username: string, email: string, profilePicture: string }[]
```

Searches for users based on a query string.

## Plants

### Create Plant

```
🔒 POST /api/plants
Body: FormData (plant details + icon file)
Response: Plant
```

Creates a new plant in the database.

### Get Plant Details

```
GET /api/plants/[id]
Response: Plant
```

Retrieves details about a specific plant.

### Upload Plant Photo

```
🔒 POST /api/plants/[id]/photos
Body: FormData (file, description)
Response: { success: boolean, photo: PlantPhoto }
```

Uploads a photo for a specific plant.

### Upload Plant Icon

```
🔒 POST /api/plants/[id]/icon
Body: FormData (file)
Response: { success: boolean, plant: Plant }
```

Uploads or updates the icon for a specific plant.

### Get Plant Care Tips

```
🔒 GET /api/plants/[id]/care-tips
Response: (CareTip & { author: { id: number, username: string }, _count: { likes: number, flags: number } })[]
```

Retrieves care tips for a specific plant.

### Add Plant Care Tip

```
🔒 POST /api/plants/[id]/care-tips
Body: { title: string, content: string }
Response: CareTip
```

Adds a new care tip for a specific plant.

### Like/Unlike Care Tip

```
🔒 PUT /api/plants/[id]/care-tips/[tipId]
Response: { message: string }
```

Toggles the like status of a care tip.

### Flag Care Tip

```
🔒 PATCH /api/plants/[id]/care-tips/[tipId]
Body: { reason: string }
Response: { message: string }
```

Flags a care tip for review.

## Articles

### Create Article

```
🔒 POST /api/articles
Body: { title: string, content: string, plantId: number }
Response: Article
```

Creates a new article.

### Get Article Details

```
GET /api/articles/[id]
Response: Article & {
  contributors: { id: number, username: string, profilePicture: string }[],
  plant: { id: number, name: string, scientificName: string, icon: string },
  comments: (Comment & { user: { id: number, username: string, profilePicture: string } })[],
  changeRequests?: ChangeRequest[]
}
```

Retrieves details about a specific article.

### Upload Article Photo

```
🔒 POST /api/articles/[id]/photos
Body: FormData (file, caption)
Response: { success: boolean, photo: ArticlePhoto }
```

Uploads a photo for a specific article.

### Get Article Change Requests

```
🔒 GET /api/articles/[id]/change-requests
Response: (ChangeRequest & { 
  author: { id: number, username: string }, 
  approvals: { moderator: { id: number, username: string } }[] 
})[]
```

Retrieves change requests for a specific article.

### Create Change Request

```
🔒 POST /api/articles/[id]/change-requests
Body: { content: string }
Response: ChangeRequest
```

Creates a new change request for an article.

### Process Change Request

```
🔒 PUT /api/articles/[id]/change-requests/[requestId]
Body: { action: 'APPROVE' | 'REJECT' }
Response: ChangeRequest
```

Approves or rejects a change request for an article.

## Discussions

### Create Discussion

```
🔒 POST /api/discussions
Body: { content: string, articleId: number, parentId?: number }
Response: Discussion
```

Creates a new discussion or reply.

### Get Discussions

```
🔒 GET /api/discussions?articleId=number
Response: (Discussion & { 
  author: { id: number, username: string, profilePicture: string }, 
  replies: (Discussion & { author: { id: number, username: string, profilePicture: string } })[] 
})[]
```

Retrieves discussions for a specific article.

## Trade Offers

### Create Trade Offer

```
🔒 POST /api/trade-offers
Body: { offeredPlantId: number, requestedPlantId: number, message?: string }
Response: TradeOffer
```

Creates a new trade offer.

### Get Trade Offers

```
🔒 GET /api/trade-offers
Response: (TradeOffer & {
  offerer: { id: number, username: string, profilePicture: string },
  recipient: { id: number, username: string, profilePicture: string },
  offeredPlant: { plant: Plant },
  requestedPlant: { plant: Plant }
})[]
```

Retrieves all trade offers for the authenticated user.

### Process Trade Offer

```
🔒 PUT /api/trade-offers?id=number&action=string
Response: { message: string }
```

Accepts or rejects a trade offer.

## Notifications

### Get User Notifications

```
🔒 GET /api/users/notifications
Response: UserNotification[]
```

Retrieves notifications for the authenticated user.

### Create Notification

```
🔒 POST /api/users/notifications
Body: { type: NotificationType, content: string, relatedId?: number }
Response: UserNotification
```

Creates a new notification for the authenticated user.

### Mark Notification as Read

```
🔒 PUT /api/users/notifications?id=number
Response: UserNotification
```

Marks a notification as read.

### Delete Notification

```
🔒 DELETE /api/users/notifications?id=number
Response: { message: string }
```

Deletes a notification.

## Moderation

### Request Moderator Status

```
🔒 POST /api/moderator-requests
Response: ModeratorRequest
```

Submits a request to become a moderator.

### Get Moderator Requests

```
🔒 GET /api/moderator-requests
Response: (ModeratorRequest & {
  user: {
    id: number,
    username: string,
    createdAt: Date,
    _count: { approvals: number },
    library: { _count: { userPlants: number } }
  }
})[]
```

Retrieves all pending moderator requests (admin only).

### Process Moderator Request

```
🔒 PUT /api/moderator-requests?id=number&action=string
Response: { message: string }
```

Approves or rejects a moderator request (admin only).

### Get Unresolved Flags

```
🔒 GET /api/flags?page=number&limit=number
Response: {
  flags: (Flag & { 
    flaggedChange: { 
      author: { id: number, username: string } 
    } 
  })[],
  pagination: { currentPage: number, totalPages: number, totalCount: number }
}
```

Retrieves unresolved flags (moderator/admin only).

### Review Flag

```
🔒 POST /api/flags
Body: { flagId: number, action: 'APPROVE' | 'REJECT', strikeUser?: boolean }
Response: { message: string }
```

Reviews a flagged item (moderator/admin only).

### Get Site Statistics

```
🔒 GET /api/admin/statistics
Response: {
  totalUsers: number,
  activeUsers: number,
  totalPlants: number,
  totalArticles: number,
  totalComments: number,
  flaggedContent: number,
  topContributors: { id: number, username: string, contributions: number }[]
}
```

Retrieves site-wide statistics (admin only).

## Search

### Global Search

```
🔒 GET /api/search?query=string&type=string
Response: {
  plants: Plant[],
  articles: Article[],
  users: { id: number, username: string, profilePicture: string }[]
}
```

Performs a global search across plants, articles, and users.

## Plant Verification

### Submit Plant for Verification

```
🔒 POST /api/plants/verification
Body: FormData (plant details + icon file + image file)
Response: PlantVerification
```

Submits a new plant for verification.

### Review Plant Verification

```
🔒 PUT /api/plants/verification
Body: { id: number, status: 'APPROVED' | 'REJECTED' }
Response: PlantVerification
```

Reviews a plant verification submission (moderator/admin only).

## Calendar

### Get Calendar Events

```
🔒 GET /api/users/calendar?startDate=string&endDate=string
Response: {
  type: 'watering' | 'fertilizing',
  date: Date,
  plantName: string,
  plantId: number,
  fertilizer?: string
}[]
```

Retrieves calendar events (watering and fertilizing logs) for the authenticated user within a specified date range.
