import { apiClient } from '../client';
import { LoginCredentials, RegisterCredentials, AuthResponse } from '../types/auth';

export const auth = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/signin', credentials);
    return data;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/register', credentials);
    return data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/signout');
  },

  getCurrentUser: async (): Promise<AuthResponse | null> => {
    try {
      const { data } = await apiClient.get<AuthResponse>('/auth/session');
      return data;
    } catch {
      return null;
    }
  },
};