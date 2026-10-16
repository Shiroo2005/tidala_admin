import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig, type Method } from "axios";
import { emitForceLogout, tokenService } from "@/services/auth/token.service";

export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL || "https://dev-v2-api.tidala.vn";

interface Envelope<T> {
  message?: string;
  data: T;
}

interface BackendError {
  error_code?: string;
  message?: string;
  errors?: { field: string; message: string }[];
}

// Bare client: no demo adapter, no interceptors. Spring reads repeated `sort` params, not `sort[]`.
const http = axios.create({ baseURL: API_BASE_URL, paramsSerializer: { indexes: null } });

export interface RealRequest {
  method: Method;
  url: string;
  params?: Record<string, unknown>;
  data?: unknown;
  auth?: boolean;
}

// The UI's error handling expects { code, message, fieldErrors }, not the backend's error_code/errors.
const toUiError = (error: AxiosError<BackendError>, config?: InternalAxiosRequestConfig): AxiosError => {
  const body = error.response?.data;
  if (!error.response || !body || typeof body !== "object") return error;
  const fieldErrors = body.errors?.length
    ? Object.fromEntries(body.errors.map((e) => [e.field, e.message]))
    : undefined;
  const uiBody = { success: false, code: body.error_code, message: body.message, fieldErrors };
  return new AxiosError(body.message || error.message, error.code, config ?? error.config, error.request, {
    ...error.response,
    data: uiBody,
  });
};

let refreshing: Promise<boolean> | null = null;

const refreshTokens = (): Promise<boolean> => {
  refreshing ??= (async () => {
    const refreshToken = tokenService.getRefreshToken();
    if (!refreshToken) return false;
    try {
      const response = await http.post<Envelope<{ accessToken: string; refreshToken: string }>>(
        "/api/v1/auth/refresh",
        { refreshToken },
      );
      const tokens = response.data.data;
      tokenService.setTokens(tokens.accessToken, tokens.refreshToken);
      return true;
    } catch {
      return false;
    }
  })().finally(() => {
    refreshing = null;
  });
  return refreshing;
};

const send = <T>(request: RealRequest): Promise<AxiosResponse<Envelope<T>>> => {
  const token = request.auth === false ? null : tokenService.getAccessToken();
  return http.request<Envelope<T>>({
    method: request.method,
    url: request.url,
    params: request.params,
    data: request.data,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
};

/** Calls the real backend and returns the unwrapped `data` field of its envelope. */
export async function realRequest<T>(request: RealRequest): Promise<T> {
  try {
    return (await send<T>(request)).data?.data;
  } catch (error) {
    if (!(error instanceof AxiosError)) throw error;
    if (error.response?.status === 401 && request.auth !== false && tokenService.getRefreshToken()) {
      if (await refreshTokens()) {
        try {
          return (await send<T>(request)).data?.data;
        } catch (retryError) {
          throw retryError instanceof AxiosError ? toUiError(retryError) : retryError;
        }
      }
      tokenService.clear();
      emitForceLogout();
    }
    throw toUiError(error);
  }
}
