import { apiService } from './apiUtils';
import type { AccountCreationDto, UserDto } from '../types/user';

interface LoginRequest {
  email: string;
  password: string;
}

export class UserService {
  async login(credentials: LoginRequest): Promise<void> {
    return apiService.post<void, LoginRequest>('/user/login', credentials);
  }

  async getProfile(): Promise<UserDto> {
    return apiService.get<UserDto>('/user/me');
  }

  async createAccount(userData: AccountCreationDto): Promise<void> {
    return apiService.post<void, AccountCreationDto>('/user/register', userData);
  }

  async logout(): Promise<void> {
    return apiService.get<void>('/user/logout');
  }
}

export const userService = new UserService();
