import { AxiosError, AxiosHeaders, type InternalAxiosRequestConfig } from "axios";
import { realRequest } from "../realApi";

export type Params = Record<string, unknown>;

export interface Page<T> {
  content: T[];
  totalElements?: number;
  last?: boolean;
}

export type Handler = (ctx: { method: string; id?: string; params: Params; body: unknown }) => Promise<unknown>;

export interface Route {
  pattern: RegExp;
  handle: Handler;
}

const FETCH_ALL_SIZE = 100;

// The screens default `sort` to the placeholder ["string"], which the backend would reject.
export const pageParams = (params: Params): Params => {
  const { sort, ...rest } = params;
  const real = Array.isArray(sort) ? sort.filter((s) => s !== "string") : [];
  return real.length ? { ...rest, sort: real } : rest;
};

export async function fetchAll<T>(url: string, params: Params = {}): Promise<T[]> {
  const rows: T[] = [];
  for (let page = 0; ; page++) {
    const result = await realRequest<Page<T>>({ method: "get", url, params: { ...params, page, size: FETCH_ALL_SIZE } });
    rows.push(...result.content);
    if (result.last !== false || result.content.length === 0) return rows;
  }
}

/** Shares one in-flight/recent result between callers for `ttlMs`, so list + detail screens don't refetch everything. */
export function cached<T>(load: () => Promise<T>, ttlMs = 30_000): () => Promise<T> {
  let entry: { at: number; value: Promise<T> } | null = null;
  return () => {
    if (!entry || Date.now() - entry.at > ttlMs) {
      const value = load();
      entry = { at: Date.now(), value };
      value.catch(() => (entry = null));
    }
    return entry.value;
  };
}

const IMAGE_BASE_URL: string = import.meta.env.VITE_IMAGE_URL_PREFIX || "https://cdn-dev.tidala.vn";

/** Backend images are storage object keys (or occasionally full URLs); the screens expect URLs. */
export const media = (key: string | null | undefined): string => {
  if (!key) return "";
  if (/^(https?:|blob:|data:)/.test(key)) return key;
  return `${IMAGE_BASE_URL.replace(/\/$/, "")}/${key.replace(/^\//, "")}`;
};

/** An error in the shape the screens' error handling reads (`response.data.message`). */
export const apiError = (status: number, message: string, code = "UNSUPPORTED"): AxiosError => {
  const config = { headers: new AxiosHeaders() } as InternalAxiosRequestConfig;
  return new AxiosError(message, String(status), config, undefined, {
    data: { success: false, code, message },
    status,
    statusText: message,
    headers: {},
    config,
  });
};

export const unsupported = (what: string) =>
  Promise.reject(apiError(501, `Backend chưa hỗ trợ ${what}.`));

export const notFound = () => Promise.reject(apiError(404, "Không tìm thấy dữ liệu", "NOT_FOUND"));

/** Returned by a handler to let the demo adapter serve the request instead. */
export const DEMO = Symbol("demo");
