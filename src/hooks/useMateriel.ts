// hooks/useMateriel.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { materielService } from '@/lib/api';
import { 
  MaterielSimple, 
  OrdinateurSimple, 
  VideoProjecteurSimple,
  CreateMaterielRequest,
  UpdateMaterielRequest 
} from '@/types';
import { toast } from 'react-hot-toast';

export const useMateriel = () => {
  return useQuery({
    queryKey: ['materiel'],
    queryFn: () => materielService.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useMaterielById = (codeMateriel: string) => {
  return useQuery({
    queryKey: ['materiel', codeMateriel],
    queryFn: () => materielService.getById(codeMateriel),
    enabled: !!codeMateriel,
  });
};

export const useOrdinateurs = () => {
  return useQuery({
    queryKey: ['materiel', 'ordinateurs'],
    queryFn: () => materielService.getOrdinateurs(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useVideoProjecteurs = () => {
  return useQuery({
    queryKey: ['materiel', 'video-projecteurs'],
    queryFn: () => materielService.getVideoProjecteurs(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useMaterielDisponible = (dateDebut: string, dateFin: string) => {
  return useQuery({
    queryKey: ['materiel', 'disponibles', dateDebut, dateFin],
    queryFn: () => materielService.getDisponibles(dateDebut, dateFin),
    enabled: !!(dateDebut && dateFin),
    staleTime: 1 * 60 * 1000, // 1 minute pour disponibilité
  });
};

export const useCreateMateriel = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateMaterielRequest) => materielService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materiel'] });
      toast.success('Matériel ajouté avec succès');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'ajout');
    },
  });
};

export const useUpdateMateriel = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ codeMateriel, data }: { codeMateriel: string; data: UpdateMaterielRequest }) =>
      materielService.update(codeMateriel, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['materiel'] });
      queryClient.invalidateQueries({ queryKey: ['materiel', variables.codeMateriel] });
      toast.success('Matériel mis à jour avec succès');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour');
    },
  });
};

export const useDeleteMateriel = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (codeMateriel: string) => materielService.delete(codeMateriel),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materiel'] });
      toast.success('Matériel supprimé avec succès');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
    },
  });
};