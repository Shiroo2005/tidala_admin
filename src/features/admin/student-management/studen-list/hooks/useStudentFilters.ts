/**
 * useStudentFilters — URL-backed filter + pagination + sort state.
 *
 * All values are stored in URL search params so navigating to a detail page
 * and pressing Back restores the exact previous state.
 */

import { useCallback, useMemo } from "react";
import { useDebounce } from "@/shared/hooks/useDebounce";
import {
  useTableQueryState,
  parseNumber,
  serializeNumber,
  parseString,
  serializeString,
  parseSortFields,
  serializeSortFields,
  type TableQuerySchema,
} from "@/shared/hooks/useTableQueryState";
import type { SortField } from "@/shared/components/admin-table";

/* ═══════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════ */

export interface StudentFilterValues {
  search: string;
  status: "all" | "ACTIVE" | "INACTIVE" | "DRAFT" | "BANNED" | "DELETED";
}

/* ═══════════════════════════════════════════════════
   SCHEMA
   ═══════════════════════════════════════════════════ */

const DEFAULT_SORT: SortField[] = [{ id: "createdAt", desc: true }];

const STUDENT_TABLE_SCHEMA = {
  page: {
    key: "p",
    default: 1,
    parse: parseNumber,
    serialize: serializeNumber,
  },
  pageSize: {
    key: "size",
    default: 10,
    parse: parseNumber,
    serialize: serializeNumber,
  },
  sorting: {
    key: "sort",
    default: DEFAULT_SORT as SortField[],
    parse: parseSortFields as (raw: string) => SortField[],
    serialize: serializeSortFields as (v: SortField[]) => string,
  },
  search: {
    key: "q",
    default: "",
    parse: parseString,
    serialize: serializeString,
  },
  status: {
    key: "st",
    default: "all" as StudentFilterValues["status"],
    parse: parseString as (raw: string) => StudentFilterValues["status"],
    serialize: serializeString,
  },
} satisfies TableQuerySchema<{
  page: number;
  pageSize: number;
  sorting: SortField[];
  search: string;
  status: StudentFilterValues["status"];
}>;

/* ═══════════════════════════════════════════════════
   HOOK
   ═══════════════════════════════════════════════════ */

export const useStudentFilters = () => {
  const [params, setParam, resetParams] = useTableQueryState(
    STUDENT_TABLE_SCHEMA,
  );

  const { page, pageSize, sorting, search, status } = params;

  // Debounce search for API calls
  const debouncedSearch = useDebounce(search, 500);

  // ── Setters ──────────────────────────────────────────────────────────────

  const setFilter = useCallback(
    <K extends keyof StudentFilterValues>(
      key: K,
      value: StudentFilterValues[K],
    ) => {
      setParam({ [key]: value } as Partial<typeof params>);
    },
    [setParam],
  );

  const resetFilters = useCallback(() => {
    resetParams();
  }, [resetParams]);

  // ── Build backend filter query ────────────────────────────────────────────

  const filterQuery = useMemo(() => {
    const conditions: string[] = [];

    if (debouncedSearch?.trim()) {
      const term = debouncedSearch.trim().replace(/'/g, "''");
      conditions.push(
        `(fullName~~'*${term}*' or email~~'*${term}*' or phoneNumber~~'*${term}*')`,
      );
    }

    if (status !== "all") {
      conditions.push(`status:'${status}'`);
    }

    return conditions.length > 0 ? conditions.join(" and ") : undefined;
  }, [debouncedSearch, status]);

  // ── Active filter count ───────────────────────────────────────────────────

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (status !== "all") count++;
    return count;
  }, [status]);

  const hasActiveFilters = useMemo(
    () => !!search || activeFilterCount > 0,
    [search, activeFilterCount],
  );

  // ── Pagination / sort setters ─────────────────────────────────────────────

  const setPage = useCallback(
    (p: number) => setParam({ page: p }, { preservePage: true }),
    [setParam],
  );

  const setPageSize = useCallback(
    (size: number) =>
      setParam({ pageSize: size, page: 1 }, { preservePage: true }),
    [setParam],
  );

  const setSorting = useCallback(
    (s: SortField[]) => setParam({ sorting: s }),
    [setParam],
  );

  return {
    // pagination
    page,
    pageSize,
    setPage,
    setPageSize,
    // sort
    sorting,
    setSorting,
    // filters
    filters: { search, status } satisfies StudentFilterValues,
    filterQuery,
    hasActiveFilters,
    activeFilterCount,
    setFilter,
    resetFilters,
  };
};
