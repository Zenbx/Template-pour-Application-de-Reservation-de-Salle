// lib/api/services/auth.ts
import { apiClient } from '../client';
import { EnseignantDTO, LoginRequest, LoginResponse } from '@/types';

export const authService = {
  login: (credentials: LoginRequest): Promise<LoginResponse> =>
    apiClient.post('/auth/login', credentials),

  logout: (): Promise<void> =>
    apiClient.post('/auth/logout'),

  getCurrentUser: (): Promise<EnseignantDTO> =>
    apiClient.get('/auth/me'),

  refreshToken: (): Promise<LoginResponse> =>
    apiClient.post('/auth/refresh'),
};