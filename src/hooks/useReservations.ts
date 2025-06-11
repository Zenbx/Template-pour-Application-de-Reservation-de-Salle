// hooks/useReservations.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reservationsService } from '@/lib/api';
import { ReservationFilters, CreateReservationRequest, UpdateReservationRequest } from '@/types';
import { toast } from 'react-hot-toast';

export const useReservations = (filters?: ReservationFilters) => {
  return useQuery({
    queryKey: ['reservations', filters],
    queryFn: () => reservationsService.getAll(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes - plus frais pour les réservations
  });
};

export const useReservation = (numero: number) => {
  return useQuery({
    queryKey: ['reservation', numero],
    queryFn: () => reservationsService.getById(numero),
    enabled: !!numero,
  });
};

export const useReservationsByEnseignant = (enseignantId: number) => {
  return useQuery({
    queryKey: ['reservations', 'enseignant', enseignantId],
    queryFn: () => reservationsService.getByEnseignant(enseignantId),
    enabled: !!enseignantId,
  });
};

export const useCreateReservation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateReservationRequest) => reservationsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      queryClient.invalidateQueries({ queryKey: ['salles'] });
      queryClient.invalidateQueries({ queryKey: ['materiel'] });
      toast.success('Réservation créée avec succès');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la création');
    },
  });
};

export const useConfirmerReservation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (numero: number) => reservationsService.confirmer(numero),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      toast.success('Réservation confirmée');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la confirmation');
    },
  });
};

export const useAnnulerReservation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (numero: number) => reservationsService.annuler(numero),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      toast.success('Réservation annulée');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'annulation');
    },
  });
};