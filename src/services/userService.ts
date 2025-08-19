import { apiService } from './apiUtils';
import type { AccountCreationDto, ApiResult, UserDto } from '../types/api';

interface LoginRequest {
  email: string;
  password: string;
}

export class UserService {
  async login(credentials: LoginRequest): Promise<ApiResult<void>> {
    return apiService.post<void, LoginRequest>('/user/login', credentials);
  }

  async getProfile(): Promise<ApiResult<UserDto>> {
    return apiService.get<UserDto>('/user/me');
  }

  async createAccount(userData: AccountCreationDto): Promise<ApiResult<UserDto>> {
    return apiService.post<UserDto, AccountCreationDto>('/user/register', userData);
  }

  async logout(): Promise<ApiResult<void>> {
    return apiService.get<void>('/user/logout');
  }
}

export const userService = new UserService();
