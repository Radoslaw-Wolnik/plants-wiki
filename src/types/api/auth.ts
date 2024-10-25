// types/api/auth.ts
import type { User, UserRole } from '../prisma';

export type SafeUser = Omit<User, 'password' | 'tokens'>;
export type PublicUser = Pick<User, 'id' | 'username' | 'profilePicture' | 'role'>;

export interface SessionUser {
  id: number;
  email: string;
  username: string;
  role: UserRole;
  profilePicture?: string;
}

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
  user: SessionUser;
  token?: string;
}