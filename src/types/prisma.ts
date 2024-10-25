// types/prisma.ts
import { Prisma } from '@prisma/client';

// Base Prisma types
export type User = Prisma.UserGetPayload<{}>;
export type Plant = Prisma.PlantGetPayload<{}>;
export type Article = Prisma.ArticleGetPayload<{}>;
export type Comment = Prisma.CommentGetPayload<{}>;
export type UserLibrary = Prisma.UserLibraryGetPayload<{}>;
export type UserPlant = Prisma.UserPlantGetPayload<{}>;
export type Room = Prisma.RoomGetPayload<{}>;
export type Discussion = Prisma.DiscussionGetPayload<{}>;
export type ChangeRequest = Prisma.ChangeRequestGetPayload<{}>;
export type Approval = Prisma.ApprovalGetPayload<{}>;
export type UserFlag = Prisma.UserFlagGetPayload<{}>;
export type Flag = Prisma.FlagGetPayload<{}>;
export type Token = Prisma.TokenGetPayload<{}>;
export type WateringLog = Prisma.WateringLogGetPayload<{}>;
export type FertilizingLog = Prisma.FertilizingLogGetPayload<{}>;
export type WishlistPlant = Prisma.WishlistPlantGetPayload<{}>;
export type GraveyardPlant = Prisma.GraveyardPlantGetPayload<{}>;
export type ModeratorRequest = Prisma.ModeratorRequestGetPayload<{}>;
export type TradeOffer = Prisma.TradeOfferGetPayload<{}>;
export type UserNotification = Prisma.UserNotificationGetPayload<{}>;
export type PlantVerification = Prisma.PlantVerificationGetPayload<{}>;
export type CareTip = Prisma.CareTipGetPayload<{}>;
export type CareTipLike = Prisma.CareTipLikeGetPayload<{}>;
export type CareTipFlag = Prisma.CareTipFlagGetPayload<{}>;
export type PlantPhoto = Prisma.PlantPhotoGetPayload<{}>;
export type ArticlePhoto = Prisma.ArticlePhotoGetPayload<{}>;
export type PlantIcon = Prisma.PlantIconGetPayload<{}>;

// Export all enums directly from Prisma
export {
  UserRole,
  TokenType,
  RoomType,
  RequestStatus,
  ModeratorRequestStatus,
  TradeStatus,
  NotificationType,
  VerificationStatus,
  IconStatus,
} from '@prisma/client';