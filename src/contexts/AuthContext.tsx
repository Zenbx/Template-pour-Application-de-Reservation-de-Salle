// src/contexts/AuthContext.tsx
'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, AuthState, UserRole } from '@/types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

// Comptes de démonstration par email
const demoUsers: Record<string, { user: User; password: string }> = {
  'responsable@univ.fr': {
    password: 'password123',
    user: {
      id: '1',
      username: 'responsable',
      fullName: 'Prof. Responsable',
      role: UserRole.RESPONSABLE,
      email: 'responsable@univ.fr',
    },
  },
  'enseignant@univ.fr': {
    password: 'password123',
    user: {
      id: '2',
      username: 'enseignant',
      fullName: 'Prof. Enseignant',
      role: UserRole.ENSEIGNANT,
      email: 'enseignant@univ.fr',
    },
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
  console.log("Tentative de connexion avec", email, password);
  dispatch({ type: 'LOGIN_START' });

  // 1. Tester login avec comptes de démonstration
  const demoLogin = await apiClient.loginWithDemo(email, password);
  if (demoLogin.success) {
    dispatch({ type: 'LOGIN_SUCCESS', payload: demoLogin.user });
    return true;
  }

  // 2. Sinon appeler l'API réelle (si disponible)
  try {
    const response = await apiClient.post('/auth/login', { email, password }); // si API réelle prévue
    localStorage.setItem('authToken', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    dispatch({ type: 'LOGIN_SUCCESS', payload: response.user });
    return true;
  } catch (error) {
    console.warn('Login échoué via API réelle :', error);
    dispatch({ type: 'LOGIN_FAILURE' });
    return false;
  }
};


  const logout = () => {
    localStorage.removeItem('user');
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
