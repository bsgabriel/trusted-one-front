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

export interface PasswordResetRequest {
  token: string;
  password: string;
  confirmPassword: string;
}
