// hooks/useAuth.ts
/*import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/lib/api';
import { LoginRequest } from '@/types';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: () => authService.getCurrentUser(),
    retry: false,
    staleTime: 10 * 60 * 1000,
  });

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: (data) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', data.token);
      }
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      toast.success('Connexion réussie');
      router.push('/dashboard');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur de connexion');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
      }
      queryClient.clear();
      router.push('/login');
      toast.success('Déconnexion réussie');
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !error,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoginLoading: loginMutation.isPending,
  };
};*/


// hooks/useAuth.ts
/*import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { authService } from '@/lib/api';
import { LoginRequest } from '@/types';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),
    onSuccess: (data) => {
      setUser(data); // Stockage local, pas besoin de token
      toast.success('Connexion réussie');
      router.push('/dashboard');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Identifiants invalides');
    },
  });

  const logout = () => {
    setUser(null);
    router.push('/login');
    toast.success('Déconnexion réussie');
  };

  return {
    user,
    isAuthenticated: !!user,
    login: loginMutation.mutate,
    logout,
    isLoginLoading: loginMutation.isPending,
  };
};*/

// hooks/useAuth.ts
import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Export du contexte pour usage direct si nécessaire
export { AuthContext } from '@/contexts/AuthContext';
