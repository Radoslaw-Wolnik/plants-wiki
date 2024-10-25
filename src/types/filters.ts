import { QueryParams } from "./api/common";

// Example for Plant filters
export interface PlantFilters extends QueryParams {
    petSafe?: boolean;
    light?: string;
    difficulty?: string;
    type?: string;
    search?: string;
  }
  
  // Example for Article filters
export interface ArticleFilters extends QueryParams {
    category?: string;
    author?: string;
    tags?: string;
    search?: string;
  }
  
  // Example for Search filters
export interface SearchFilters extends QueryParams {
    query?: string;
    type?: 'user' | 'plant' | 'article';
    sort?: 'relevance' | 'date';
  }

export interface UserFilters extends QueryParams {
    role?: string;
    status?: string;
    search?: string;
    [key: string]: string | number | boolean | undefined;
  }