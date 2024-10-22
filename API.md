# API Documentation

## Table of Contents
1. [Authentication](#authentication)
2. [Admin Routes](#admin-routes)
3. [Articles Routes](#articles-routes)
4. [Discussion Routes](#discussion-routes)
5. [Icon Routes](#icon-routes)
6. [Plant Routes](#plant-routes)
7. [Trade Routes](#trade-routes)
8. [User Routes](#user-routes)
9. [Search Routes](#search-routes)

## Authentication

Most endpoints require authentication. Authentication is handled using NextAuth.js with JWT strategy. Authentication requirement is indicated for each endpoint as follows:
- 🔓 No authentication required
- 🔒 User authentication required 
- 🔑 Admin/Moderator authentication required

## Admin Routes

### Get Site Statistics
```
🔑 GET /api/admin/statistics
Response: {
  totalUsers: number,
  activeUsers: number,
  totalPlants: number,
  totalArticles: number,
  totalComments: number,
  flaggedContent: number,
  topContributors: {
    id: number,
    username: string,
    contributions: number
  }[]
}
```

### Review Flags
```
🔑 GET /api/admin/flags
Query Parameters: { page?: number, limit?: number }
Response: {
  flags: Flag[],
  pagination: {
    currentPage: number,
    totalPages: number,
    totalCount: number
  }
}

🔑 POST /api/admin/flags
Body: {
  flagId: number,
  action: 'APPROVE' | 'REJECT',
  strikeUser?: boolean
}
Response: { message: string }
```

## Articles Routes

### Create Article
```
🔒 POST /api/articles
Body: {
  title: string,
  content: string,
  plantId: number
}
Response: Article
```

### Get Article
```
🔒 GET /api/articles/:id
Response: {
  ...Article,
  contributors: {
    id: number,
    username: string,
    profilePicture: string
  }[],
  plant: {
    id: number,
    name: string,
    scientificName: string,
    icon: string
  },
  comments: Comment[],
  changeRequests?: ChangeRequest[] // Only for moderators/admins
}
```

### Upload Article Photo
```
🔒 POST /api/articles/:id/photos
Body: FormData {
  file: File,
  caption?: string
}
Response: {
  success: boolean,
  photo: ArticlePhoto
}
```

### Article Change Requests
```
🔒 GET /api/articles/:id/change-requests
Response: ChangeRequest[]

🔒 POST /api/articles/:id/change-requests
Body: {
  content: string
}
Response: ChangeRequest

🔑 PUT /api/articles/:id/change-requests/:requestId
Body: {
  action: 'APPROVE' | 'REJECT'
}
Response: ChangeRequest
```

## Discussion Routes

### Create Discussion
```
🔒 POST /api/discussions
Body: {
  content: string,
  articleId: number,
  parentId?: number
}
Response: Discussion
```

### Get Discussions
```
🔒 GET /api/discussions
Query Parameters: { articleId: number }
Response: Discussion[]
```

## Icon Routes

### Save Plant Icon
```
🔒 POST /api/icon/save/:plantId
Body: {
  imageData: string,
  layers: Layer[],
  userId: number
}
Response: {
  message: string,
  version: number,
  fileName: string,
  iconId: number
}
```

### Load Plant Icon
```
🔒 GET /api/icon/load/:plantId/:version
Response: {
  imageData: string,
  layers: Layer[],
  creator: {
    id: number,
    username: string
  },
  status: string
}
```

## Plant Routes

### Create Plant
```
🔒 POST /api/plants
Body: FormData {
  name: string,
  scientificName: string,
  commonName: string,
  family: string,
  icon: File,
  light: string,
  temperature: string,
  soil: string,
  climate: string,
  humidity: string,
  growthCycle: string,
  toxicity: string,
  petSafe: boolean,
  plantType: string
}
Response: Plant
```

### Get Plant
```
🔒 GET /api/plants/:id
Response: Plant
```

### Upload Plant Photo
```
🔑 POST /api/plants/:id/photos
Body: FormData {
  file: File,
  description?: string
}
Response: {
  success: boolean,
  photo: PlantPhoto
}
```

### Upload Plant Icon
```
🔑 POST /api/plants/:id/icon
Body: FormData {
  file: File
}
Response: {
  success: boolean,
  plant: Plant
}
```

### Plant Care Tips
```
🔒 GET /api/plants/:id/care-tips
Response: CareTip[]

🔒 POST /api/plants/:id/care-tips
Body: {
  title: string,
  content: string
}
Response: CareTip

🔒 PUT /api/plants/:id/care-tips/:tipId
Body: {
  action: 'LIKE' | 'UNLIKE'
}
Response: { message: string }

🔒 PATCH /api/plants/:id/care-tips/:tipId
Body: {
  reason: string
}
Response: { message: string }
```

### Plant Verification
```
🔒 POST /api/plants/verify
Body: FormData {
  name: string,
  scientificName: string,
  commonName: string,
  family: string,
  icon: File,
  image: File,
  light: string,
  temperature: string,
  soil: string,
  climate: string,
  humidity: string,
  growthCycle: string,
  toxicity: string,
  petSafe: boolean,
  plantType: string
}
Response: PlantVerification

🔑 PUT /api/plants/verify
Body: {
  id: number,
  status: 'APPROVED' | 'REJECTED'
}
Response: PlantVerification
```

## Trade Routes

### Create Trade Offer
```
🔒 POST /api/trades
Body: {
  offeredPlantId: number,
  requestedPlantId: number,
  message?: string
}
Response: TradeOffer
```

### Get Trade Offers
```
🔒 GET /api/trades
Response: TradeOffer[]
```

### Process Trade Offer
```
🔒 PUT /api/trades
Query Parameters: { id: number, action: 'accept' | 'reject' }
Response: { message: string }
```

## User Routes

### Register User
```
🔓 POST /api/register
Body: {
  username: string,
  email: string,
  password: string
}
Response: User
```

### Get User Profile
```
🔒 GET /api/users/profile
Response: {
  id: number,
  username: string,
  email: string,
  profilePicture: string,
  createdAt: Date,
  role: UserRole,
  wishlistPlants: WishlistPlant[],
  graveyardPlants: GraveyardPlant[],
  _count: {
    friends: number,
    library: {
      _count: {
        userPlants: number
      }
    }
  }
}
```

### Update Profile
```
🔒 PUT /api/users/profile
Body: {
  username?: string,
  email?: string
}
Response: User
```

### Upload Profile Picture
```
🔒 POST /api/users/profile/picture
Body: FormData {
  file: File
}
Response: {
  success: boolean,
  fileUrl: string
}
```

### User Library Management
```
🔒 GET /api/users/library
Query Parameters: { page?: number, limit?: number, search?: string }
Response: {
  library: UserLibrary,
  pagination: {
    currentPage: number,
    totalPages: number,
    totalCount: number
  }
}

🔒 POST /api/users/library/plants
Body: {
  plantId: number,
  nickname?: string,
  roomId?: number,
  notes?: string
}
Response: UserPlant

🔒 PUT /api/users/library/plants/:id
Body: FormData {
  data: string, // JSON string containing update data
  file?: File
}
Response: {
  success: boolean,
  plant: UserPlant
}
```

### Plant Care Logging
```
🔒 POST /api/users/library/plants/:id/watering
Body: {
  date: string,
  amount?: number,
  notes?: string
}
Response: WateringLog

🔒 POST /api/users/library/plants/:id/fertilizing
Body: {
  date: string,
  fertilizer: string,
  amount?: number,
  notes?: string
}
Response: FertilizingLog
```

### Room Management
```
🔒 GET /api/users/rooms
Response: Room[]

🔒 POST /api/users/rooms
Body: {
  name: string,
  type: RoomType,
  sunlight: string,
  humidity: string
}
Response: Room

🔒 PUT /api/users/rooms
Query Parameters: { id: number }
Body: {
  name?: string,
  type?: RoomType,
  sunlight?: string,
  humidity?: string
}
Response: Room

🔒 DELETE /api/users/rooms
Query Parameters: { id: number }
Response: { message: string }
```

### Friend Management
```
🔒 GET /api/users/friends
Response: {
  id: number,
  username: string,
  profilePicture: string
}[]

🔒 POST /api/users/friends
Body: {
  friendId: number
}
Response: {
  id: number,
  username: string,
  profilePicture: string
}

🔒 DELETE /api/users/friends
Query Parameters: { id: number }
Response: { message: string }
```

### Wishlist Management
```
🔒 GET /api/users/wishlist
Response: WishlistPlant[]

🔒 POST /api/users/wishlist
Body: {
  plantName: string
}
Response: WishlistPlant

🔒 DELETE /api/users/wishlist
Query Parameters: { id: number }
Response: { message: string }
```

### Graveyard Management
```
🔒 GET /api/users/graveyard
Response: GraveyardPlant[]

🔒 POST /api/users/graveyard
Body: {
  plantName: string,
  startDate: string,
  endDate: string
}
Response: GraveyardPlant

🔒 DELETE /api/users/graveyard
Query Parameters: { id: number }
Response: { message: string }
```

### Notification Management
```
🔒 GET /api/users/notifications
Response: UserNotification[]

🔒 POST /api/users/notifications
Body: {
  type: NotificationType,
  content: string,
  relatedId?: number
}
Response: UserNotification

🔒 PUT /api/users/notifications
Query Parameters: { id: number }
Response: UserNotification

🔒 DELETE /api/users/notifications
Query Parameters: { id: number }
Response: { message: string }
```

### Calendar Events
```
🔒 GET /api/users/calendar
Query Parameters: { startDate: string, endDate: string }
Response: {
  type: 'watering' | 'fertilizing',
  date: Date,
  plantName: string,
  plantId: number,
  fertilizer?: string
}[]
```

### Moderator Requests
```
🔒 POST /api/users/moderator-request
Response: ModeratorRequest

🔑 GET /api/users/moderator-request
Response: ModeratorRequest[]

🔑 PUT /api/users/moderator-request
Query Parameters: { id: number, action: 'approve' | 'reject' }
Response: { message: string }
```

## Search Routes

### Global Search
```
🔒 GET /api/search
Query Parameters: {
  query: string,
  type?: 'ALL' | 'PLANTS' | 'ARTICLES' | 'USERS'
}
Response: {
  plants: Plant[],
  articles: Article[],
  users: {
    id: number,
    username: string,
    profilePicture: string
  }[]
}
```

### User Search
```
🔒 GET /api/users/search
Query Parameters: { q: string }
Response: {
  id: number,
  username: string,
  email: string,
  profilePicture: string
}[]
```