# Database Models Documentation

## Overview

This document provides comprehensive documentation for the database models used in the plant management application. The system is divided into several interconnected modules, each handling specific functionality.

## System Architecture

### Complete System Diagram
```mermaid
graph TB
    subgraph "Core User System"
        User[User]
        Token[Token]
        UserLibrary[UserLibrary]
        UserNotification[UserNotification]
    end

    subgraph "Plant Management"
        Plant[Plant]
        UserPlant[UserPlant]
        Room[Room]
        WateringLog[WateringLog]
        FertilizingLog[FertilizingLog]
        UserPlantPhoto[UserPlantPhoto]
        PlantIcon[PlantIcon]
    end

    subgraph "Content Management"
        Article[Article]
        Comment[Comment]
        Discussion[Discussion]
        ArticlePhoto[ArticlePhoto]
        CareTip[CareTip]
        CareTipLike[CareTipLike]
    end

    subgraph "Moderation System"
        ModeratorRequest[ModeratorRequest]
        ChangeRequest[ChangeRequest]
        UserFlag[UserFlag]
        CareTipFlag[CareTipFlag]
        Approval[Approval]
        PlantVerification[PlantVerification]
    end

    subgraph "Trading System"
        TradeOffer[TradeOffer]
        WishlistPlant[WishlistPlant]
        GraveyardPlant[GraveyardPlant]
    end

    User --> Token
    User --> UserLibrary
    User --> UserNotification
    User --> Room
    User --> ModeratorRequest
    User --> Article
    User --> Comment
    User --> Discussion
    User --> CareTip
    User --> CareTipLike
    User --> WishlistPlant
    User --> GraveyardPlant
    User --> TradeOffer
    User --> UserFlag
    User --> PlantVerification

    UserLibrary --> UserPlant
    Plant --> UserPlant
    Plant --> Article
    Plant --> CareTip
    Plant --> PlantIcon
    Plant --> PlantVerification

    UserPlant --> WateringLog
    UserPlant --> FertilizingLog
    UserPlant --> UserPlantPhoto
    UserPlant --> Room
    UserPlant --> TradeOffer

    Article --> Comment
    Article --> Discussion
    Article --> ArticlePhoto
    Article --> ChangeRequest

    ChangeRequest --> Approval
    CareTip --> CareTipFlag
    CareTip --> CareTipLike
```

### Core User System
```mermaid
graph LR
    subgraph "Authentication"
        User --> Token
        User --> UserNotification
    end

    subgraph "User Relations"
        User --> User
        User --> UserLibrary
    end

    subgraph "User States"
        User --> isBanned
        User --> strikes
        User --> role[UserRole]
    end

    classDef default fill:#e6f3ff,stroke:#333,stroke-width:2px;
    classDef state fill:#fff3e6,stroke:#333,stroke-width:2px;
    class isBanned,strikes,role state;
```

### Plant Management System
```mermaid
graph TB
    subgraph "Plant Core"
        Plant --> PlantIcon
        Plant --> PlantVerification
    end

    subgraph "User Plant Management"
        UserLibrary --> UserPlant
        UserPlant --> WateringLog
        UserPlant --> FertilizingLog
        UserPlant --> UserPlantPhoto
        UserPlant --> Room
    end

    Plant --> UserPlant

    classDef default fill:#e6ffe6,stroke:#333,stroke-width:2px;
    classDef tracking fill:#ffe6e6,stroke:#333,stroke-width:2px;
    class WateringLog,FertilizingLog,UserPlantPhoto tracking;
```

### Content Management System
```mermaid
graph LR
    subgraph "Article System"
        Article --> Comment
        Article --> Discussion
        Article --> ArticlePhoto
    end

    subgraph "Care Tips"
        CareTip --> CareTipLike
        CareTip --> CareTipFlag
    end

    Plant --> Article
    Plant --> CareTip

    classDef default fill:#fff0f7,stroke:#333,stroke-width:2px;
    classDef social fill:#f8f9fa,stroke:#333,stroke-width:2px;
    class Comment,Discussion social;
```

### Moderation System
```mermaid
stateDiagram-v2
    [*] --> Pending
    
    Pending --> Approved
    Pending --> Rejected
    
    state Pending {
        [*] --> UnderReview
        UnderReview --> NeedsChanges
        NeedsChanges --> UnderReview
    }
    
    Approved --> [*]
    Rejected --> [*]

    note right of Pending
        Applies to:
        - ModeratorRequests
        - ChangeRequests
        - PlantVerification
        - Icons
    end note
```

### Trading System
```mermaid
stateDiagram-v2
    [*] --> TradeOffer
    
    TradeOffer --> Pending: Created
    Pending --> Accepted: Recipient Accepts
    Pending --> Rejected: Recipient Rejects
    
    state TradeOffer {
        [*] --> OfferCreation
        OfferCreation --> PlantSelection
        PlantSelection --> MessageCreation
        MessageCreation --> Review
    }
    
    Accepted --> Complete: Trade Completed
    Rejected --> [*]
    Complete --> [*]
```

## Detailed Module Documentation

### 1. Core User System

#### User
Central entity managing user accounts and authentication.

**Key Relationships:**
```mermaid
graph LR
    User --> UserLibrary
    User --> Token
    User --> UserNotification
    User --> Room
    User --> Article
    User --> Comment
    User --> Discussion
    User --> CareTip
    User --> ModeratorRequest
    User --> TradeOffer
```


### Entity Flow Diagrams

#### Plant Creation and Verification Flow
```mermaid
sequenceDiagram
    participant U as User
    participant P as Plant
    participant V as PlantVerification
    participant M as Moderator
    
    U->>V: Submit new plant
    V->>M: Review request
    alt Approved
        M->>P: Create verified plant
        M->>U: Notify approval
    else Rejected
        M->>U: Notify rejection with reason
    end
```

#### Trade Flow
```mermaid
sequenceDiagram
    participant S as Sender
    participant T as TradeOffer
    participant R as Recipient
    
    S->>T: Create trade offer
    T->>R: Notify recipient
    alt Accepted
        R->>T: Accept offer
        T->>S: Notify acceptance
        T->>S: Transfer plants
        T->>R: Transfer plants
    else Rejected
        R->>T: Reject offer
        T->>S: Notify rejection
    end
```

## Query Examples and Best Practices

### Common Queries with Included Relations

```typescript
// Get user with complete profile
const userProfile = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    library: {
      include: {
        userPlants: {
          include: {
            plant: true,
            room: true,
            wateringLogs: { take: 5 },
            fertilizingLogs: { take: 5 }
          }
        }
      }
    },
    articles: true,
    careTips: true,
    rooms: true
  }
});

// Get plant with all related content
const plantDetails = await prisma.plant.findUnique({
  where: { id: plantId },
  include: {
    article: {
      include: {
        comments: true,
        discussions: true,
        photos: true
      }
    },
    careTips: {
      include: {
        likes: true,
        author: true
      }
    },
    icons: {
      where: { status: 'APPROVED' },
      orderBy: { version: 'desc' },
      take: 1
    }
  }
});
```


**Key Relationships:**
```mermaid
graph LR
    Plant --> UserPlant
    Plant --> Article
    Plant --> CareTip
    Plant --> PlantIcon
    Plant --> PlantVerification
    Plant --> PlantPhoto
```

**Fields:**
| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | Int | Primary key | @id @default(autoincrement()) |
| scientificName | String | Botanical name | @unique |
| commonName | String | Common name | Required |
| family | String | Plant family | Required |
| icon | String | Default icon path | Required |
| light | String | Light requirements | Required |
| temperature | String | Temperature range | Required |
| soil | String | Soil preferences | Required |
| climate | String | Climate zones | Required |
| humidity | String | Humidity needs | Required |
| growthCycle | String | Growth pattern | Required |
| toxicity | String | Toxicity info | Required |
| petSafe | Boolean | Pet safety status | Required |
| plantType | String | Plant category | Required |

#### UserPlant
Individual plant instances owned by users.

**Key Relationships:**
```mermaid
graph LR
    UserPlant --> WateringLog
    UserPlant --> FertilizingLog
    UserPlant --> UserPlantPhoto
    UserPlant --> Room
    UserPlant --> TradeOffer
```

**Fields:**
| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | Int | Primary key | @id @default(autoincrement()) |
| libraryId | Int | Owner's library | Required, FK |
| plantId | Int | Plant reference | Required, FK |
| nickname | String | Custom name | Optional |
| acquiredDate | DateTime | Acquisition date | Required |
| notes | String | Care notes | Optional |

### 3. Content Management System

#### Article
Comprehensive plant care guides.

**Key Relationships:**
```mermaid
graph LR
    Article --> Comment
    Article --> Discussion
    Article --> ChangeRequest
    Article --> ArticlePhoto
```

**Fields:**
| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | Int | Primary key | @id @default(autoincrement()) |
| title | String | Article title | Required |
| content | String | Main content | Required |
| plantId | Int | Related plant | Required, FK, @unique |

#### Discussion
Threaded conversations on articles.

**Fields:**
| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | Int | Primary key | @id @default(autoincrement()) |
| content | String | Message content | Required |
| articleId | Int | Parent article | Required, FK |
| authorId | Int | Author reference | Required, FK |
| parentId | Int? | Parent discussion | Optional, FK |

### 4. Moderation System

#### ModeratorRequest
User applications for moderator status.

**State Flow:**
```mermaid
stateDiagram-v2
    [*] --> PENDING: Submit Request
    PENDING --> APPROVED: Approved by Admin
    PENDING --> REJECTED: Rejected by Admin
    APPROVED --> [*]: Role Updated
    REJECTED --> [*]: Request Closed
```

**Fields:**
| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | Int | Primary key | @id @default(autoincrement()) |
| userId | Int | Applicant | Required, FK |
| status | ModeratorRequestStatus | Request state | @default(PENDING) |

#### PlantVerification
New plant entry verification system.

**Verification Flow:**
```mermaid
sequenceDiagram
    participant U as User
    participant V as Verification
    participant M as Moderator
    participant P as Plant
    
    U->>V: Submit plant details
    V->>M: Await review
    alt Approved
        M->>V: Approve submission
        V->>P: Create plant entry
        V->>U: Notify success
    else Rejected
        M->>V: Reject with reason
        V->>U: Notify rejection
    end
```

### 5. Trading System

#### TradeOffer
Plant exchange management.

**Trade Flow:**
```mermaid
stateDiagram-v2
    [*] --> PENDING: Create Offer
    PENDING --> ACCEPTED: Accept Trade
    PENDING --> REJECTED: Reject Trade
    ACCEPTED --> COMPLETED: Exchange Complete
    REJECTED --> [*]: Offer Closed
    COMPLETED --> [*]: Trade Finished
```

**Fields:**
| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | Int | Primary key | @id @default(autoincrement()) |
| offererId | Int | Offering user | Required, FK |
| recipientId | Int | Receiving user | Required, FK |
| offeredPlantId | Int | Offered plant | Required, FK |
| requestedPlantId | Int | Requested plant | Required, FK |
| status | TradeStatus | Trade state | Required |
| message | String | Trade message | Optional |

### 6. Notification System

#### UserNotification
User alert system.

**Notification Types:**
```mermaid
graph TB
    Notification[UserNotification] --> FR[FRIEND_REQUEST]
    Notification --> AC[ARTICLE_COMMENT]
    Notification --> CRA[CHANGE_REQUEST_APPROVED]
    Notification --> CRR[CHANGE_REQUEST_REJECTED]
```

**Fields:**
| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | Int | Primary key | @id @default(autoincrement()) |
| type | NotificationType | Alert type | Required |
| content | String | Message content | Required |
| userId | Int | Target user | Required, FK |
| read | Boolean | Read status | @default(false) |

## Common Queries and Patterns

### User Management

```typescript
// Create new user with library
const createUser = async (userData: UserCreateInput) => {
  return await prisma.user.create({
    data: {
      ...userData,
      library: {
        create: {} // Initialize empty library
      }
    },
    include: {
      library: true
    }
  });
};

// Get user profile with plants
const getUserProfile = async (userId: number) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      library: {
        include: {
          userPlants: {
            include: {
              plant: true,
              room: true
            }
          }
        }
      },
      rooms: true
    }
  });
};
```

### Plant Management

```typescript
// Add plant to user's library
const addPlantToLibrary = async (
  userId: number,
  plantId: number,
  data: UserPlantCreateInput
) => {
  return await prisma.userPlant.create({
    data: {
      ...data,
      library: {
        connect: { userId }
      },
      plant: {
        connect: { id: plantId }
      }
    },
    include: {
      plant: true
    }
  });
};

// Get plant with care history
const getPlantWithCare = async (userPlantId: number) => {
  return await prisma.userPlant.findUnique({
    where: { id: userPlantId },
    include: {
      wateringLogs: {
        orderBy: { date: 'desc' },
        take: 10
      },
      fertilizingLogs: {
        orderBy: { date: 'desc' },
        take: 10
      }
    }
  });
};
```

### Content Management

```typescript
// Create article with photos
const createArticle = async (
  plantId: number,
  data: ArticleCreateInput,
  photos: PhotoCreateInput[]
) => {
  return await prisma.article.create({
    data: {
      ...data,
      plant: {
        connect: { id: plantId }
      },
      photos: {
        create: photos
      }
    },
    include: {
      photos: true
    }
  });
};

// Get article with discussions
const getArticleWithDiscussions = async (articleId: number) => {
  return await prisma.article.findUnique({
    where: { id: articleId },
    include: {
      discussions: {
        include: {
          author: true,
          replies: {
            include: {
              author: true
            }
          }
        }
      }
    }
  });
};
```