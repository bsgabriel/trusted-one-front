import { api } from 'boot/axios';
import type { ApiResult, ApiError, ProblemDetail } from '../types/api';
import type { AxiosError } from 'axios';

class ApiService {
  private isAxiosError(error: unknown): error is AxiosError {
    return error instanceof Error && 'isAxiosError' in error;
  }

  private handleError(error: unknown): ApiError {
    if (this.isAxiosError(error)) {
      if (error.response && error.response.data) {
        const data = error.response.data as ProblemDetail;
        return {
          success: false,
          message: data?.detail || 'Erro no servidor',
          details: data?.title,
          status: error.response.status,
        };
      }

      if (error.request) {
        return {
          success: false,
          message: 'Erro de conexão com o servidor',
          details: 'Verifique sua conexão com a internet',
        };
      }
    }

    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return {
      success: false,
      message: 'Erro inesperado',
      details: errorMessage,
    };
  }

  async get<T>(endpoint: string): Promise<ApiResult<T>> {
    try {
      const response = await api.get<T>(endpoint);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async post<T, D = unknown>(endpoint: string, data?: D): Promise<ApiResult<T>> {
    try {
      const response = await api.post<T>(endpoint, data);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async put<T, D = unknown>(endpoint: string, data?: D): Promise<ApiResult<T>> {
    try {
      const response = await api.put<T>(endpoint, data);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async delete<T>(endpoint: string): Promise<ApiResult<T>> {
    try {
      const response = await api.delete<T>(endpoint);
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }
}

export const apiService = new ApiService();
