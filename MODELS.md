# Data Models

This document describes the data models used in the Plant Wiki application.

## User

Represents registered users of the application.

```prisma
model User {
  id              Int       @id @default(autoincrement())
  username        String    @unique
  email           String    @unique
  password        String
  profilePicture  String?
  role            UserRole  @default(USER)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  library         UserLibrary?
  articles        Article[]
  comments        Comment[]
  friends         User[]    @relation("UserFriends")
  friendsOf       User[]    @relation("UserFriends")
  wishlistPlants  WishlistPlant[]
  graveyardPlants GraveyardPlant[]
  rooms           Room[]
  changeRequests  ChangeRequest[]
  approvals       Approval[]
  flags           UserFlag[]
  strikes         Int       @default(0)
  isBanned        Boolean   @default(false)
  banExpiresAt    DateTime?
  lastActive      DateTime  @default(now())
}

enum UserRole {
  USER
  MODERATOR
  ADMIN
}
```

## Plant

Represents plant species in the database.

```prisma
model Plant {
  id              Int       @id @default(autoincrement())
  name            String
  scientificName  String    @unique
  commonName      String
  family          String
  icon            String
  light           String
  temperature     String
  soil            String
  climate         String
  humidity        String
  growthCycle     String
  toxicity        String
  petSafe         Boolean
  plantType       String
  sex             String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  article         Article?
  userPlants      UserPlant[]
}
```

## Article

Represents wiki articles about plants.

```prisma
model Article {
  id              Int       @id @default(autoincrement())
  title           String
  content         String
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  author          User      @relation(fields: [authorId], references: [id])
  authorId        Int
  plant           Plant     @relation(fields: [plantId], references: [id])
  plantId         Int       @unique
  discussions     Discussion[]
  changeRequests  ChangeRequest[]
}
```

## UserLibrary

Represents a user's collection of plants.

```prisma
model UserLibrary {
  id        Int         @id @default(autoincrement())
  user      User        @relation(fields: [userId], references: [id])
  userId    Int         @unique
  userPlants UserPlant[]
}
```

## UserPlant

Represents a specific plant owned by a user.

```prisma
model UserPlant {
  id              Int       @id @default(autoincrement())
  library         UserLibrary @relation(fields: [libraryId], references: [id])
  libraryId       Int
  plant           Plant     @relation(fields: [plantId], references: [id])
  plantId         Int
  nickname        String?
  acquiredDate    DateTime
  notes           String?
  photos          UserPlantPhoto[]
  wateringLogs    WateringLog[]
  fertilizingLogs FertilizingLog[]
  room            Room?     @relation(fields: [roomId], references: [id])
  roomId          Int?
}
```

## Room

Represents a room or area where plants are kept.

```prisma
model Room {
  id        Int      @id @default(autoincrement())
  name      String
  type      RoomType
  sunlight  String
  humidity  String
  user      User     @relation(fields: [userId], references: [id])
  userId    Int
  plants    UserPlant[]
}

enum RoomType {
  LIVING_ROOM
  BEDROOM
  BATHROOM
  KITCHEN
  BALCONY
  OUTDOOR
  GREENHOUSE
}
```

## WateringLog

Represents a record of watering a plant.

```prisma
model WateringLog {
  id          Int       @id @default(autoincrement())
  userPlant   UserPlant @relation(fields: [userPlantId], references: [id])
  userPlantId Int
  date        DateTime
  amount      Float?
  notes       String?
}
```

## FertilizingLog

Represents a record of fertilizing a plant.

```prisma
model FertilizingLog {
  id          Int       @id @default(autoincrement())
  userPlant   UserPlant @relation(fields: [userPlantId], references: [id])
  userPlantId Int
  date        DateTime
  fertilizer  String
  amount      Float?
  notes       String?
}
```

## WishlistPlant

Represents a plant that a user wishes to acquire.

```prisma
model WishlistPlant {
  id        Int      @id @default(autoincrement())
  plantName String
  user      User     @relation(fields: [userId], references: [id])
  userId    Int
}
```

## GraveyardPlant

Represents a plant that a user once had but has died.

```prisma
model GraveyardPlant {
  id        Int      @id @default(autoincrement())
  plantName String
  startDate DateTime
  endDate   DateTime
  user      User     @relation(fields: [userId], references: [id])
  userId    Int
}
```

## Discussion

Represents discussions on articles.

```prisma
model Discussion {
  id           Int      @id @default(autoincrement())
  content      String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  author       User     @relation(fields: [authorId], references: [id])
  authorId     Int
  article      Article  @relation(fields: [articleId], references: [id])
  articleId    Int
  parentId     Int?
  parent       Discussion? @relation("DiscussionReplies", fields: [parentId], references: [id])
  replies      Discussion[] @relation("DiscussionReplies")
}
```

## ChangeRequest

Represents proposed changes to articles.

```prisma
model ChangeRequest {
  id        Int      @id @default(autoincrement())
  content   String
  status    RequestStatus @default(PENDING)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
  article   Article  @relation(fields: [articleId], references: [id])
  articleId Int
  approvals Approval[]
  flags     Flag[]
}

enum RequestStatus {
  PENDING
  APPROVED
  REJECTED
}
```

## Approval

Represents moderator approvals for change requests.

```prisma
model Approval {
  id              Int           @id @default(autoincrement())
  createdAt       DateTime      @default(now())
  moderator       User          @relation(fields: [moderatorId], references: [id])
  moderatorId     Int
  changeRequest   ChangeRequest @relation(fields: [changeRequestId], references: [id])
  changeRequestId Int
}
```

## Flag

Represents flags on content for moderation.

```prisma
model Flag {
  id              Int           @id @default(autoincrement())
  reason          String
  createdAt       DateTime      @default(now())
  changeRequest   ChangeRequest @relation(fields: [changeRequestId], references: [id])
  changeRequestId Int
  reviewer        User?         @relation(fields: [reviewerId], references: [id])
  reviewerId      Int?
  resolved        Boolean       @default(false)
  resolvedAt      DateTime?
}
```

These models define the structure of the data used in the Plant Wiki application. They are implemented using Prisma ORM and correspond to tables in the PostgreSQL database.