export interface ApiBaseResponse {
  success: boolean;
  code: string;
  message: string;
  timestamp: string;
}

export interface ApiSuccessResponse<T> extends ApiBaseResponse {
  // Successful response
  success: true;
  data: T;
}

export interface ApiErrorResponse extends ApiBaseResponse {
  // Error response
  success: false;
  // Optional detailed
  fieldErrors?: Record<string, string>;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
