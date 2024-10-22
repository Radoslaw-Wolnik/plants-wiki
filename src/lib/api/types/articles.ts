// src/lib/api/types/articles.ts
export interface Article {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    plantId: number;
    plant: {
      id: number;
      name: string;
      scientificName: string;
      icon: string;
    };
    contributors: {
      id: number;
      username: string;
      profilePicture?: string;
    }[];
    comments: Comment[];
    photos: ArticlePhoto[];
  }
  
  export interface Comment {
    id: number;
    content: string;
    createdAt: string;
    user: {
      id: number;
      username: string;
      profilePicture?: string;
    };
  }
  
  export interface ArticlePhoto {
    id: number;
    url: string;
    caption?: string;
    createdAt: string;
    uploadedBy: {
      id: number;
      username: string;
    };
  }
  
  export interface Discussion {
    id: number;
    content: string;
    createdAt: string;
    author: {
      id: number;
      username: string;
      profilePicture?: string;
    };
    replies: Discussion[];
  }