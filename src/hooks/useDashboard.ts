// hooks/useDashboard.ts
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/lib/api';
import { TableauBordResponsable, DashboardStats } from '@/types';

export const useTableauBordResponsable = (responsableId: number) => {
  return useQuery({
    queryKey: ['dashboard', 'responsable', responsableId],
    queryFn: () => dashboardService.getTableauBordResponsable(responsableId),
    enabled: !!responsableId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => dashboardService.getStats(),
    staleTime: 2 * 60 * 1000,
  });
};

export const useDashboardStatsEnseignant = (enseignantId: number) => {
  return useQuery({
    queryKey: ['dashboard', 'enseignant', enseignantId],
    queryFn: () => dashboardService.getStatsEnseignant(enseignantId),
    enabled: !!enseignantId,
    staleTime: 5 * 60 * 1000,
  });
};