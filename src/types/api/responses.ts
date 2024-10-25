// types/api/responses.ts
import type { Plant, Article, Room, UserPlant, Discussion } from '../prisma';
import { PublicUser } from './auth';

export interface PlantResponse extends Plant {
  article?: ArticleResponse;
  careTips?: CareTipResponse[];
}

export interface ArticleResponse extends Omit<Article, 'plantId'> {
  plant: Pick<Plant, 'id' | 'name' | 'icon'>;
  contributors: PublicUser[];
  comments: CommentResponse[];
  photos: ArticlePhotoResponse[];
}

export interface UserPlantResponse extends Omit<UserPlant, 'plantId' | 'libraryId'> {
  plant: Pick<Plant, 'name' | 'scientificName' | 'icon'>;
  room?: Pick<Room, 'name'>;
  lastWatering?: string;
  lastFertilizing?: string;
}

export interface CommentResponse {
  id: number;
  content: string;
  createdAt: string;
  user: PublicUser;
}

export interface ArticlePhotoResponse {
  id: number;
  url: string;
  caption?: string;
  createdAt: string;
  uploadedBy: PublicUser;
}

export interface DiscussionResponse extends Omit<Discussion, 'authorId'> {
  author: PublicUser;
  replies: DiscussionResponse[];
}

export interface CareTipResponse {
  id: number;
  title: string;
  content: string;
  plant: Pick<Plant, 'id' | 'name'>;
  author: PublicUser;
  likes: number;
  flags: number;
}