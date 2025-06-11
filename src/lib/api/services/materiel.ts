// lib/api/services/materiel.ts
import { apiClient } from '../client';
import { 
  Materiel, 
  MaterielSimple, 
  OrdinateurSimple, 
  VideoProjecteurSimple,
  CreateMaterielRequest,
  UpdateMaterielRequest 
} from '@/types';

export const materielService = {
  getAll: (): Promise<MaterielSimple[]> =>
    apiClient.get('/materiel'),

  getById: (codeMateriel: string): Promise<MaterielSimple> =>
    apiClient.get(`/materiel/${codeMateriel}`),

  getOrdinateurs: (): Promise<OrdinateurSimple[]> =>
    apiClient.get('/materiel/ordinateurs'),

  getVideoProjecteurs: (): Promise<VideoProjecteurSimple[]> =>
    apiClient.get('/materiel/video-projecteurs'),

  create: (data: CreateMaterielRequest): Promise<MaterielSimple> =>
    apiClient.post('/materiel', data),

  update: (codeMateriel: string, data: UpdateMaterielRequest): Promise<MaterielSimple> =>
    apiClient.put(`/materiel/${codeMateriel}`, data),

  delete: (codeMateriel: string): Promise<void> =>
    apiClient.delete(`/materiel/${codeMateriel}`),

  getDisponibles: (dateDebut: string, dateFin: string): Promise<MaterielSimple[]> =>
    apiClient.get('/materiel/disponibles', { dateDebut, dateFin }),
};
