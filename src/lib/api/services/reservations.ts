// lib/api/services/reservations.ts
import { apiClient } from '../client';
/*import { 
  Reservation, 
  ReservationDTO, 
  CreateReservationRequest, 
  UpdateReservationRequest,
  ReservationFilters 
} from '@/types';

export const reservationsService = {
  getAll: (filters?: ReservationFilters): Promise<ReservationDTO[]> =>
    apiClient.get('/reservations', filters),

  getById: (numero: number): Promise<ReservationDTO> =>
    apiClient.get(`/reservations/${numero}`),

  create: (data: CreateReservationRequest): Promise<ReservationDTO> =>
    apiClient.post('/reservations', data),

  update: (numero: number, data: UpdateReservationRequest): Promise<ReservationDTO> =>
    apiClient.put(`/reservations/${numero}`, data),

  delete: (numero: number): Promise<void> =>
    apiClient.delete(`/reservations/${numero}`),

  confirmer: (numero: number): Promise<ReservationDTO> =>
    apiClient.patch(`/reservations/${numero}/confirmer`),

  annuler: (numero: number): Promise<ReservationDTO> =>
    apiClient.patch(`/reservations/${numero}/annuler`),

  getByEnseignant: (enseignantId: number): Promise<ReservationDTO[]> =>
    apiClient.get(`/reservations/enseignant/${enseignantId}`),

  getByFormation: (formationId: number): Promise<ReservationDTO[]> =>
    apiClient.get(`/reservations/formation/${formationId}`),
};*/

import { 
  ReservationDTO, 
  CreateReservationRequest, 
  UpdateReservationRequest,
  ReservationFilters 
} from '@/types';

export const reservationsService = {
  getAll: (filters?: ReservationFilters): Promise<ReservationDTO[]> =>
    apiClient.get('/reservations', filters),

  getById: (numero: number): Promise<ReservationDTO> =>
    apiClient.get(`/reservations/${numero}`),

  getByEnseignant: (enseignantId: number): Promise<ReservationDTO[]> =>
    apiClient.get(`/reservations/enseignant/${enseignantId}`),

  create: (data: CreateReservationRequest): Promise<ReservationDTO> =>
    apiClient.post('/reservations', data),

  update: (numero: number, data: UpdateReservationRequest): Promise<ReservationDTO> =>
    apiClient.put(`/reservations/${numero}`, data),

  confirmer: (numero: number): Promise<void> =>
    apiClient.patch(`/reservations/${numero}/confirmer`, {}),

  annuler: (numero: number): Promise<void> =>
    apiClient.patch(`/reservations/${numero}/annuler`, {}),

  delete: (numero: number): Promise<void> =>
    apiClient.delete(`/reservations/${numero}`),
};