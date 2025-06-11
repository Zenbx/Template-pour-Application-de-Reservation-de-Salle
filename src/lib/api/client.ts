import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ApiResponse } from '@/types';

const demoUsers: Record<string, { password: string; role: string }> = {
  'responsable@univ.fr': { password: 'password123', role: 'responsable' },
  'enseignant@univ.fr': { password: 'password123', role: 'enseignant' },
};


class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://resama.onrender.com/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Intercepteur pour ajouter le token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Intercepteur pour gérer les erreurs globales
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        if (error.response?.status === 401) {
          console.warn("Erreur 401 - utilisateur non autorisé");
          this.handleUnauthorized();
        }
        return Promise.reject(error);
      }
    );
  }

  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  private handleUnauthorized() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
  }

  // ---------- Ajout: Connexion via comptes de démo ----------

  public async loginWithDemo(email: string, password: string): Promise<{ success: boolean; user?: any }> {
    const demo = demoUsers[email.trim()];
    if (demo && demo.password === password) {
      const user = { email, role: demo.role };
      localStorage.setItem('authToken', 'demo-token'); // Fake token
      localStorage.setItem('user', JSON.stringify(user));
      return { success: true, user };
    } else {
      return { success: false };
    }
  }

  // ---------- Méthodes HTTP génériques ----------

  async get<T>(url: string, params?: any): Promise<T> {
    const response = await this.client.get(url, { params });
    return response.data;
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.post(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.put(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response = await this.client.delete(url);
    return response.data;
  }

  async patch<T>(url: string, data?: any): Promise<T> {
    const response = await this.client.patch(url, data);
    return response.data;
  }
}

export const apiClient = new ApiClient();
