// lib/api/services/enseignants.ts
/*import { apiClient } from '../client';
import { 
  Enseignant, 
  EnseignantDTO, 
  EnseignantSimple, 
  EnseignantFilters,
  CreateEnseignantRequest,
  UpdateEnseignantRequest 
} from '@/types';

export const enseignantsService = {
  // Récupérer tous les enseignants
  getAll: (filters?: EnseignantFilters): Promise<EnseignantDTO[]> =>
    apiClient.get('/enseignants', filters),

  // Récupérer un enseignant par ID
  getById: (id: number): Promise<EnseignantDTO> =>
    apiClient.get(`/enseignants/${id}`),

  // Créer un enseignant
  create: (data: CreateEnseignantRequest): Promise<EnseignantDTO> =>
    apiClient.post('/enseignants', data),

  // Mettre à jour un enseignant
  update: (id: number, data: UpdateEnseignantRequest): Promise<EnseignantDTO> =>
    apiClient.put(`/enseignants/${id}`, data),

  // Supprimer un enseignant
  delete: (id: number): Promise<void> =>
    apiClient.delete(`/enseignants/${id}`),

  // Récupérer les formations d'un enseignant
  getFormations: (id: number): Promise<Formation[]> =>
    apiClient.get(`/enseignants/${id}/formations`),

  // Récupérer les réservations d'un enseignant
  getReservations: (id: number): Promise<Reservation[]> =>
    apiClient.get(`/enseignants/${id}/reservations`),
};*/

import { apiClient } from '../client';
import { 
  EnseignantDTO, 
  CreateEnseignantRequest, 
  UpdateEnseignantRequest,
  EnseignantFilters 
} from '@/types';

export const enseignantsService = {
  getAll: (filters?: EnseignantFilters): Promise<EnseignantDTO[]> =>
    apiClient.get('/enseignants', filters),

  getById: (id: number): Promise<EnseignantDTO> =>
    apiClient.get(`/enseignants/${id}`),

  create: (data: CreateEnseignantRequest): Promise<EnseignantDTO> =>
    apiClient.post('/enseignants', data),

  update: (id: number, data: UpdateEnseignantRequest): Promise<EnseignantDTO> =>
    apiClient.put(`/enseignants/${id}`, data),

  delete: (id: number): Promise<void> =>
    apiClient.delete(`/enseignants/${id}`),
};