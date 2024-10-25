import { apiClient } from '../client';
import { LoginCredentials, RegisterCredentials, AuthResponse } from '@/types';

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/auth/signin', credentials);
  return data;
}

export async function register(credentials: RegisterCredentials): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/auth/register', credentials);
  return data;
}

export async function logout(): Promise<void> {
  await apiClient.post('/auth/signout');
}

export async function getCurrentUser(): Promise<AuthResponse | null> {
  try {
    const { data } = await apiClient.get<AuthResponse>('/auth/session');
    return data;
  } catch {
    return null;
  }
}
