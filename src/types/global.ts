export type UserRole = 'USER' | 'MODERATOR' | 'ADMIN';

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  profilePicture: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  strikes: number;
  isBanned: boolean;
  banExpiresAt?: Date;
  Deactivated?: Date;
  lastActive: Date;
}

export interface Plant {
  id: number;
  name: string;
  scientificName: string;
  commonName: string;
  family: string;
  icon: string;
  light: string;
  temperature: string;
  soil: string;
  climate: string;
  humidity: string;
  growthCycle: string;
  toxicity: string;
  petSafe: boolean;
  plantType: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Article {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  plantId: number;
}

export interface Comment {
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  articleId: number;
}

export type RoomType = 'LIVING_ROOM' | 'BEDROOM' | 'BATHROOM' | 'KITCHEN' | 'BALCONY' | 'OUTDOOR' | 'GREENHOUSE';

export interface Room {
  id: number;
  name: string;
  type: RoomType;
  sunlight: string;
  humidity: string;
  userId: number;
}

export interface UserPlant {
  id: number;
  libraryId: number;
  plantId: number;
  nickname?: string;
  acquiredDate: Date;
  notes?: string;
  roomId?: number;
}

export interface UserLibrary {
  id: number;
  userId: number;
}

export interface Discussion {
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  articleId: number;
  authorId: number;
  parentId?: number;
}

export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface ChangeRequest {
  id: number;
  content: string;
  status: RequestStatus;
  createdAt: Date;
  updatedAt: Date;
  authorId: number;
  articleId: number;
}

export interface Approval {
  id: number;
  createdAt: Date;
  moderatorId: number;
  changeRequestId: number;
}

export interface UserFlag {
  id: number;
  reason: string;
  createdAt: Date;
  userId: number;
  flaggedArticleId?: number;
  flaggedDiscussionId?: number;
  resolved: boolean;
  resolvedAt?: Date;
}

export interface Flag {
  id: number;
  reason: string;
  createdAt: Date;
  changeRequestId?: number;
  resolved: boolean;
  resolvedAt?: Date;
}

export type TokenType = 'PASSWORD_RESET' | 'ACCOUNT_VERIFICATION' | 'ONE_TIME_LOGIN' | 'DEACTIVATION';

export interface Token {
  id: number;
  userId: number;
  token: string;
  type: TokenType;
  expiresAt: Date;
  createdAt: Date;
  isActive: boolean;
}

export type SafeUser = Omit<User, 'password' | 'tokens'>;
export type PublicUser = Pick<User, 'id' | 'username' | 'profilePicture' | 'role'>;

export interface SessionUser extends SafeUser {
  id: number;
  email: string;
  username: string;
  role: UserRole;
}

export type AuthToken = {
  token: string;
  expiresAt: Date;
};