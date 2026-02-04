import { apiService } from './apiUtils';
import type { AccountCreationDto, PasswordResetRequest, UserDto } from '../types/user';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  type: string;
  expiresIn: number;
}

export class UserService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return apiService.post<LoginResponse, LoginRequest>('/user/login', credentials);
  }

  async getProfile(): Promise<UserDto> {
    return apiService.get<UserDto>('/user/me');
  }

  async createAccount(userData: AccountCreationDto): Promise<void> {
    return apiService.post<void, AccountCreationDto>('/user/register', userData);
  }

  async logout(refreshToken: string): Promise<void> {
    try {
      await apiService.post<void>('/user/logout', { refreshToken });
    } finally {
      apiService.clearTokens();
    }
  }

  async requestPasswordChange(email: string): Promise<void> {
    return apiService.post<void, { email: string }>('/user/forgot-password', { email });
  }

  async validateResetToken(token: string): Promise<void> {
    const queryParams = new URLSearchParams();
    queryParams.append('token', token);

    return apiService.get<void>(`/user/reset-password/validate?${queryParams.toString()}`);
  }

  async resetPassword(request: PasswordResetRequest): Promise<void> {
    return apiService.post<void, PasswordResetRequest>('/user/reset-password', request);
  }
}

export const userService = new UserService();
