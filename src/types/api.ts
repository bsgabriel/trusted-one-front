export interface UserLoginDto {
  email: string;
  password: string;
}

export interface AccountCreationDto {
  name: string;
  email: string;
  password: string;
}

export interface UserDto {
  userId: number;
  name: string;
  email: string;
}

export interface ProblemDetail {
  title: string;
  detail: string;
  errors?: string[];
}

export interface ApiResponse<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  message: string;
  details?: string;
  status?: number;
}

export type ApiResult<T> = ApiResponse<T> | ApiError;
