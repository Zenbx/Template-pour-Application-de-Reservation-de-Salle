// hooks/useFormations.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { formationsService } from '@/lib/api';
import { FormationFilters, CreateFormationRequest, UpdateFormationRequest } from '@/types';
import { toast } from 'react-hot-toast';

export const useFormations = (filters?: FormationFilters) => {
  return useQuery({
    queryKey: ['formations', filters],
    queryFn: () => formationsService.getAll(filters),
    staleTime: 5 * 60 * 1000,
  });
};

export const useFormation = (id: number) => {
  return useQuery({
    queryKey: ['formation', id],
    queryFn: () => formationsService.getById(id),
    enabled: !!id,
  });
};

export const useFormationsByResponsable = (responsableId: number) => {
  return useQuery({
    queryKey: ['formations', 'responsable', responsableId],
    queryFn: () => formationsService.getByResponsable(responsableId),
    enabled: !!responsableId,
  });
};

export const useCreateFormation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateFormationRequest) => formationsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['formations'] });
      toast.success('Formation créée avec succès');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la création');
    },
  });
};

export const useUpdateFormation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateFormationRequest }) =>
      formationsService.update(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['formations'] });
      queryClient.invalidateQueries({ queryKey: ['formation', variables.id] });
      toast.success('Formation mise à jour avec succès');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour');
    },
  });
  };

  export const useDeleteFormation = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: (id: number) => formationsService.delete(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['formations'] });
        toast.success('Formation supprimé avec succès');
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
      },
    });
  };
