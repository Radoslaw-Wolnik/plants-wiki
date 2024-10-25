// src/contexts/AuthContext.tsx
import { createContext, useContext, useCallback, useEffect, useState } from 'react';
import { useSession, signIn as nextAuthSignIn, signOut as nextAuthSignOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { SafeUser } from '@/types';

export interface AuthContextType {
  user: SafeUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (credentials: { username: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<SafeUser | null>(null);

  const handleSignIn = useCallback(async (credentials: { username: string; password: string }) => {
    try {
      const result = await nextAuthSignIn('credentials', {
        redirect: false,
        username: credentials.username,
        password: credentials.password,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      router.push('/');
    } catch (error) {
      throw new Error('Authentication failed');
    }
  }, [router]);

  const handleSignOut = useCallback(async () => {
    await nextAuthSignOut({ redirect: false });
    router.push('/auth/signin');
  }, [router]);

  const refreshUser = async () => {
    try {
      const response = await fetch('/api/auth/me');
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  useEffect(() => {
    if (session?.user) {
      setUser(session.user as SafeUser);
    } else {
      setUser(null);
    }
  }, [session]);

  const value = {
    user: user,
    isLoading: status === 'loading',
    isAuthenticated: !!user,
    signIn: handleSignIn,
    signOut: handleSignOut,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}