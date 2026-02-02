import { apiService } from './apiUtils';
import type { AccountCreationDto, UserDto } from '../types/user';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
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

}

export const userService = new UserService();
