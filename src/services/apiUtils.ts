import { api } from 'boot/axios';
import type { ProblemDetail } from '../types/api';
import type { AxiosError } from 'axios';
import { ApiError } from 'src/types/erros';

class ApiService {
  private isAxiosError(error: unknown): error is AxiosError {
    return error instanceof Error && 'isAxiosError' in error;
  }

  private handleError(error: unknown): never {
    if (this.isAxiosError(error)) {
      if (error.response?.status === 401) {
        this.clearToken();

        if (error.response?.data) {
          const data = error.response.data;
          if (this.isProblemDetail(data)) {
            throw new ApiError(data as ProblemDetail);
          }
        }

        throw new ApiError({
          title: 'Sessão expirada',
          status: 401,
          detail: 'Sua sessão expirou. Por favor, faça login novamente.',
        });
      }

      if (error.response?.data) {
        const data = error.response.data;
        if (this.isProblemDetail(data)) {
          throw new ApiError(data as ProblemDetail);
        }

        throw new ApiError({
          title: 'Erro no servidor',
          status: error.response.status,
          detail: typeof data === 'string' ? data : 'Ocorreu um erro inesperado',
        });
      }

      if (error.request) {
        throw new ApiError({
          title: 'Erro de Conexão',
          status: 0,
          detail: 'Não foi possível conectar ao servidor. Tente novamente mais tarde',
        });
      }
    }

    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    throw new ApiError({
      title: 'Erro Inesperado',
      status: 0,
      detail: errorMessage,
    });
  }

  private isProblemDetail(data: unknown): boolean {
    return (
      typeof data === 'object' &&
      data !== null &&
      'title' in data &&
      'detail' in data &&
      'status' in data
    );
  }

  setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  clearToken(): void {
    localStorage.removeItem('authToken');
  }

  async get<T>(endpoint: string): Promise<T> {
    try {
      const response = await api.get<T>(endpoint);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async post<T, D = unknown>(endpoint: string, data?: D): Promise<T> {
    try {
      const response = await api.post<T>(endpoint, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async put<T, D = unknown>(endpoint: string, data?: D): Promise<T> {
    try {
      const response = await api.put<T>(endpoint, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async delete<T>(endpoint: string): Promise<T> {
    try {
      const response = await api.delete<T>(endpoint);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async patch<T, D = unknown>(endpoint: string, data?: D): Promise<T> {
    try {
      const response = await api.patch<T>(endpoint, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }
}

export const apiService = new ApiService();
