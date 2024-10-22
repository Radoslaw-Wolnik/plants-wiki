// src/lib/api/types/article.ts
export interface Article {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    plant: {
      id: number;
      name: string;
      icon: string;
    };
    contributors: {
      id: number;
      username: string;
      profilePicture?: string;
    }[];
  }
  
  export interface ChangeRequest {
    id: number;
    content: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    createdAt: string;
    author: {
      id: number;
      username: string;
    };
  }
  