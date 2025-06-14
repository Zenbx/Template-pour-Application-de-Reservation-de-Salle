// src/contexts/AuthContext.tsx
'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Enseignant, EnseignantDTO, UserRole } from '@/types';

// Interface unifiée pour l'utilisateur
export interface User {
  id: string;
  idEnseignant: number;
  username: string;
  nomEnseignant: string;
  prenomEnseignant: string;
  email: string;
  telephone?: string;
  specialite?: string;
  role: UserRole;
  fullName: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction = 
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'RESTORE_SESSION'; payload: User };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true };
    case 'LOGIN_SUCCESS':
      return { 
        user: action.payload, 
        isLoading: false, 
        isAuthenticated: true 
      };
    case 'LOGIN_FAILURE':
    case 'LOGOUT':
      return { 
        user: null, 
        isLoading: false, 
        isAuthenticated: false 
      };
    case 'RESTORE_SESSION':
      return { 
        user: action.payload, 
        isLoading: false, 
        isAuthenticated: true 
      };
    default:
      return state;
  }
};

// Comptes de démonstration mis à jour
const demoUsers: Record<string, { user: User; password: string }> = {
  'responsable@univ.fr': {
    password: 'password123',
    user: {
      id: '1',
      idEnseignant: 1,
      username: 'responsable',
      nomEnseignant: 'Martin',
      prenomEnseignant: 'Jean',
      fullName: 'Jean Martin',
      role: UserRole.RESPONSABLE,
      email: 'responsable@univ.fr',
      telephone: '01.23.45.67.89',
      specialite: 'Informatique'
    },
  },
  'enseignant@univ.fr': {
    password: 'password123',
    user: {
      id: '2',
      idEnseignant: 2,
      username: 'enseignant',
      nomEnseignant: 'Dubois',
      prenomEnseignant: 'Marie',
      fullName: 'Marie Dubois',
      role: UserRole.ENSEIGNANT,
      email: 'enseignant@univ.fr',
      telephone: '01.23.45.67.90',
      specialite: 'Mathématiques'
    },
  }
};

// Service API simplifié
const authService = {
  loginWithDemo: async (email: string, password: string): Promise<{ success: boolean; user?: User }> => {
    // Simuler un délai d'API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const demoAccount = demoUsers[email];
    if (demoAccount && demoAccount.password === password) {
      return { success: true, user: demoAccount.user };
    }
    
    return { success: false };
  },

  // Méthode pour l'API réelle (si nécessaire plus tard)
  loginWithAPI: async (email: string, password: string): Promise<{ success: boolean; user?: User; token?: string }> => {
    try {
      // Remplacez par votre URL d'API réelle
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        return { 
          success: true, 
          user: data.user, 
          token: data.token 
        };
      }
      
      return { success: false };
    } catch (error) {
      console.error('Erreur API login:', error);
      return { success: false };
    }
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isLoading: false,
    isAuthenticated: false
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        dispatch({ type: 'RESTORE_SESSION', payload: user });
      } catch {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log("Tentative de connexion avec", email);
    dispatch({ type: 'LOGIN_START' });

    try {
      // 1. Tester d'abord avec les comptes de démonstration
      const demoLogin = await authService.loginWithDemo(email, password);
      if (demoLogin.success && demoLogin.user) {
        localStorage.setItem('user', JSON.stringify(demoLogin.user));
        dispatch({ type: 'LOGIN_SUCCESS', payload: demoLogin.user });
        return true;
      }

      // 2. Si pas de compte démo, essayer l'API réelle (optionnel)
      if (process.env.NEXT_PUBLIC_API_URL) {
        const apiLogin = await authService.loginWithAPI(email, password);
        if (apiLogin.success && apiLogin.user) {
          if (apiLogin.token) {
            localStorage.setItem('authToken', apiLogin.token);
          }
          localStorage.setItem('user', JSON.stringify(apiLogin.user));
          dispatch({ type: 'LOGIN_SUCCESS', payload: apiLogin.user });
          return true;
        }
      }

      // 3. Échec de connexion
      dispatch({ type: 'LOGIN_FAILURE' });
      return false;

    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      dispatch({ type: 'LOGIN_FAILURE' });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ 
      ...state, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}