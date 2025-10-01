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
