// lib/api/services/salles.ts
import { apiClient } from '../client';
import { SalleDTO, CreateSalleRequest, UpdateSalleRequest } from '@/types';

export const sallesService = {
  getAll: (): Promise<SalleDTO[]> =>
    apiClient.get('/salles'),

  getById: (codeSalle: string): Promise<SalleDTO> =>
    apiClient.get(`/salles/${codeSalle}`),

  getDisponibles: (date: string, heureDebut: string, heureFin: string): Promise<SalleDTO[]> =>
    apiClient.get('/salles/disponibles', { date, heureDebut, heureFin }),

  create: (data: CreateSalleRequest): Promise<SalleDTO> =>
    apiClient.post('/salles', data),

  update: (codeSalle: string, data: UpdateSalleRequest): Promise<SalleDTO> =>
    apiClient.put(`/salles/${codeSalle}`, data),

  delete: (codeSalle: string): Promise<void> =>
    apiClient.delete(`/salles/${codeSalle}`),
};