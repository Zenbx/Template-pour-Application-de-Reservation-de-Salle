// hooks/useSalles.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sallesService } from '@/lib/api';
import { CreateSalleRequest, UpdateSalleRequest } from '@/types';
import { toast } from 'react-hot-toast';

export const useSalles = () => {
  return useQuery({
    queryKey: ['salles'],
    queryFn: () => sallesService.getAll(),
    staleTime: 10 * 60 * 1000, // 10 minutes - les salles changent peu
  });
};

export const useSalle = (codeSalle: string) => {
  return useQuery({
    queryKey: ['salle', codeSalle],
    queryFn: () => sallesService.getById(codeSalle),
    enabled: !!codeSalle,
  });
};

export const useSallesDisponibles = (date: string, heureDebut: string, heureFin: string) => {
  return useQuery({
    queryKey: ['salles', 'disponibles', date, heureDebut, heureFin],
    queryFn: () => sallesService.getDisponibles(date, heureDebut, heureFin),
    enabled: !!(date && heureDebut && heureFin),
    staleTime: 1 * 60 * 1000, // 1 minute pour disponibilité
  });
};