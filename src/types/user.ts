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
