// lib/api/services/formations.ts
import { apiClient } from '../client';
import { 
  Formation, 
  FormationDTO, 
  FormationSimple, 
  CreateFormationRequest, 
  UpdateFormationRequest,
  FormationFilters,
  FormationStats 
} from '@/types';

export const formationsService = {
  getAll: (filters?: FormationFilters): Promise<FormationDTO[]> =>
    apiClient.get('/formations', filters),

  getById: (id: number): Promise<FormationDTO> =>
    apiClient.get(`/formations/${id}`),

  create: (data: CreateFormationRequest): Promise<FormationDTO> =>
    apiClient.post('/formations', data),

  update: (id: number, data: UpdateFormationRequest): Promise<FormationDTO> =>
    apiClient.put(`/formations/${id}`, data),

  delete: (id: number): Promise<void> =>
    apiClient.delete(`/formations/${id}`),

  getStats: (): Promise<FormationStats> =>
    apiClient.get('/formations/stats'),

  getByResponsable: (responsableId: number): Promise<FormationDTO[]> =>
    apiClient.get(`/formations/responsable/${responsableId}`),
};