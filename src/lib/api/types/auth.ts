// Types directory: src/lib/api/types/auth.ts
export interface LoginCredentials {
    username: string;
    password: string;
  }
  
  export interface RegisterCredentials {
    username: string;
    email: string;
    password: string;
  }
  
  export interface AuthResponse {
    user: {
      id: number;
      username: string;
      email: string;
      role: 'USER' | 'MODERATOR' | 'ADMIN';
      profilePicture?: string;
    };
  }