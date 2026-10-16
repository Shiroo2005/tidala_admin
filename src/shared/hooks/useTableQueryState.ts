/**
 * useTableQueryState
 *
 * Persists table filter/pagination/sort state in the URL search params.
 * This means navigating to a detail page and pressing "Back" will restore
 * the exact page, filters, and sort the user had before.
 *
 * Usage:
 *   const [params, setParam, resetParams] = useTableQueryState({
 *     page:   { key: "p",    parse: Number, serialize: String, default: 1 },
 *     search: { key: "q",    parse: String, serialize: String, default: "" },
 *     type:   { key: "type", parse: String, serialize: String, default: "ALL" },
 *   });
 */

import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

// ─── Generic descriptor for a single URL param field ────────────────────────

export interface TableQueryField<T> {
  /** The URL search-param key (e.g. "p", "q", "sort") */
  key: string;
  /** Default value when the param is absent or invalid */
  default: T;
  /** Convert URL string → typed value */
  parse: (raw: string) => T;
  /** Convert typed value → URL string (omit key when result equals default) */
  serialize: (value: T) => string;
}

export type TableQuerySchema<Fields extends Record<string, unknown>> = {
  [K in keyof Fields]: TableQueryField<Fields[K]>;
};

export type UseTableQueryStateReturn<
  Fields extends Record<string, unknown>,
> = [
  /** Current parsed state */
  state: Fields,
  /** Update one or more fields (resets page to 1 unless `preservePage` is true) */
  setParam: (
    updates: Partial<Fields>,
    options?: { preservePage?: boolean; pageKey?: keyof Fields },
  ) => void,
  /** Reset all fields to their defaults */
  resetParams: () => void,
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function safeRead<T>(
  params: URLSearchParams,
  field: TableQueryField<T>,
): T {
  const raw = params.get(field.key);
  if (raw === null || raw === "") return field.default;
  try {
    const parsed = field.parse(raw);
    // Reject NaN for numeric fields
    if (typeof parsed === "number" && isNaN(parsed)) return field.default;
    return parsed;
  } catch {
    return field.default;
  }
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useTableQueryState<Fields extends Record<string, unknown>>(
  schema: TableQuerySchema<Fields>,
): UseTableQueryStateReturn<Fields> {
  const [searchParams, setSearchParams] = useSearchParams();

  // Derive current state from URL
  const state = useMemo<Fields>(() => {
    const result = {} as Fields;
    for (const k in schema) {
      (result as Record<string, unknown>)[k] = safeRead(
        searchParams,
        schema[k],
      );
    }
    return result;
  }, [schema, searchParams]);

  // Update one or more params. By default, also resets the page param to 1.
  const setParam = useCallback(
    (
      updates: Partial<Fields>,
      options?: { preservePage?: boolean; pageKey?: keyof Fields },
    ) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);

          // Apply updates
          for (const k in updates) {
            const field = schema[k];
            if (!field) continue;
            const value = updates[k] as Fields[typeof k];
            const serialized = field.serialize(value);
            if (
              serialized === "" ||
              serialized === field.serialize(field.default)
            ) {
              next.delete(field.key);
            } else {
              next.set(field.key, serialized);
            }
          }

          // Reset page to 1 unless the caller opts out or is updating page itself
          const pageKey = (options?.pageKey ?? "page") as keyof Fields;
          const isUpdatingPage = pageKey in updates;
          if (!options?.preservePage && !isUpdatingPage) {
            const pageField = schema[pageKey];
            if (pageField) {
              next.delete(pageField.key);
            }
          }

          return next;
        },
        { replace: true },
      );
    },
    [schema, setSearchParams],
  );

  // Reset all params to defaults (clears all keys managed by schema)
  const resetParams = useCallback(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        for (const k in schema) {
          next.delete(schema[k].key);
        }
        return next;
      },
      { replace: true },
    );
  }, [schema, setSearchParams]);

  return [state, setParam, resetParams];
}

// ─── Convenience parsers / serializers ──────────────────────────────────────

export const parseNumber = (raw: string) => Number(raw);
export const serializeNumber = (v: number) => String(v);

export const parseString = (raw: string) => raw;
export const serializeString = (v: string) => v;

/**
 * Parse a comma-separated string into a string array.
 * Empty string → empty array.
 */
export const parseStringArray = (raw: string): string[] =>
  raw ? raw.split(",").filter(Boolean) : [];

export const serializeStringArray = (v: string[]): string =>
  v.length > 0 ? v.join(",") : "";

/**
 * Parse a JSON-encoded sort array: [{id, desc}]
 * Fallback to empty array on error.
 */
export const parseSortFields = (
  raw: string,
): Array<{ id: string; desc: boolean }> => {
  try {
    const parsed = JSON.parse(decodeURIComponent(raw));
    if (Array.isArray(parsed)) return parsed;
  } catch {
    /* noop */
  }
  return [];
};

export const serializeSortFields = (
  v: Array<{ id: string; desc: boolean }>,
): string =>
  v.length > 0 ? encodeURIComponent(JSON.stringify(v)) : "";
