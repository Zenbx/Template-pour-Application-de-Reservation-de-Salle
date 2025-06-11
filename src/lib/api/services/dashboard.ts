
// lib/api/services/dashboard.ts
import { apiClient } from '../client';
import { TableauBordResponsable, DashboardStats } from '@/types';

export const dashboardService = {
  getTableauBordResponsable: (responsableId: number): Promise<TableauBordResponsable> =>
    apiClient.get(`/dashboard/responsable/${responsableId}`),

  getStats: (): Promise<DashboardStats> =>
    apiClient.get('/dashboard/stats'),

  getStatsEnseignant: (enseignantId: number): Promise<any> =>
    apiClient.get(`/dashboard/enseignant/${enseignantId}`),
};
