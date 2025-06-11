// hooks/useEnseignants.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enseignantsService } from '@/lib/api';
import { 
  EnseignantFilters, 
  CreateEnseignantRequest, 
  UpdateEnseignantRequest,
  EnseignantDTO,
  Formation,
  Reservation 
} from '@/types';
import { toast } from 'react-hot-toast';

export const useEnseignants = (filters?: EnseignantFilters) => {
  return useQuery({
    queryKey: ['enseignants', filters],
    queryFn: () => enseignantsService.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useEnseignant = (id: number) => {
  return useQuery({
    queryKey: ['enseignant', id],
    queryFn: () => enseignantsService.getById(id),
    enabled: !!id,
  });
};

export const useCreateEnseignant = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateEnseignantRequest) => enseignantsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enseignants'] });
      toast.success('Enseignant créé avec succès');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la création');
    },
  });
};

export const useUpdateEnseignant = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateEnseignantRequest }) =>
      enseignantsService.update(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['enseignants'] });
      queryClient.invalidateQueries({ queryKey: ['enseignant', variables.id] });
      toast.success('Enseignant mis à jour avec succès');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour');
    },
  });
};

export const useDeleteEnseignant = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => enseignantsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enseignants'] });
      toast.success('Enseignant supprimé avec succès');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
    },
  });
};