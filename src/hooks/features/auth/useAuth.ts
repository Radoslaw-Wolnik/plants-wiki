// useAuth.ts
import { createContext, useContext, useState, useEffect } from 'react';
import { AuthResponse, SafeUser } from '@/types';
import { login as loginApi, logout as logoutApi, getCurrentUser } from '@/lib/api';

interface AuthContextType {
  user: SafeUser | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: Error | null;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}