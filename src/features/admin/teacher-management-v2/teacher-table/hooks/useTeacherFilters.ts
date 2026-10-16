/**
 * useTeacherFilters — URL-backed filter state for the Teacher table.
 *
 * All filter / sort / pagination values are stored in URL search params so
 * navigating to a detail page and pressing Back restores the exact state.
 */

import { useCallback, useMemo } from "react";
import { useDebounce } from "@/shared/hooks/useDebounce";
import {
  useTableQueryState,
  parseNumber,
  serializeNumber,
  parseString,
  serializeString,
  parseStringArray,
  serializeStringArray,
  parseSortFields,
  serializeSortFields,
  type TableQuerySchema,
} from "@/shared/hooks/useTableQueryState";
import type { SortField } from "@/shared/components/admin-table";

/* ═══════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════ */

export interface TeacherFilterValues {
  search: string;
  trainingLevelIds: string[];
  provinceId: string;
  districtIds: string[];
  experience: string;
  hasCurrentStudents: string;
  statuses: string[];
}

/* ═══════════════════════════════════════════════════
   SCHEMA
   ═══════════════════════════════════════════════════ */

const DEFAULT_SORT: SortField[] = [{ id: "createdAt", desc: true }];

const TEACHER_TABLE_SCHEMA = {
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
  trainingLevelIds: {
    key: "tl",
    default: [] as string[],
    parse: parseStringArray,
    serialize: serializeStringArray,
  },
  provinceId: {
    key: "prov",
    default: "ALL",
    parse: parseString,
    serialize: serializeString,
  },
  districtIds: {
    key: "dist",
    default: [] as string[],
    parse: parseStringArray,
    serialize: serializeStringArray,
  },
  experience: {
    key: "exp",
    default: "",
    parse: parseString,
    serialize: serializeString,
  },
  hasCurrentStudents: {
    key: "hcs",
    default: "",
    parse: parseString,
    serialize: serializeString,
  },
  statuses: {
    key: "st",
    default: [] as string[],
    parse: parseStringArray,
    serialize: serializeStringArray,
  },
} satisfies TableQuerySchema<
  {
    page: number;
    pageSize: number;
    sorting: SortField[];
    search: string;
    trainingLevelIds: string[];
    provinceId: string;
    districtIds: string[];
    experience: string;
    hasCurrentStudents: string;
    statuses: string[];
  }
>;

/* ═══════════════════════════════════════════════════
   HOOK
   ═══════════════════════════════════════════════════ */

export const useTeacherFilters = () => {
  const [params, setParam, resetParams] = useTableQueryState(TEACHER_TABLE_SCHEMA);

  const {
    page,
    pageSize,
    sorting,
    search,
    trainingLevelIds,
    provinceId,
    districtIds,
    experience,
    hasCurrentStudents,
    statuses,
  } = params;

  // Debounce search for API calls
  const debouncedSearch = useDebounce(search, 500);

  // ── Setters ──────────────────────────────────────────────────────────────

  const setFilter = useCallback(
    <K extends keyof TeacherFilterValues>(
      key: K,
      value: TeacherFilterValues[K],
    ) => {
      if (key === "provinceId") {
        // Clear districts when province changes
        setParam({
          [key]: value,
          districtIds: [],
        } as Partial<typeof params>);
      } else {
        setParam({ [key]: value } as Partial<typeof params>);
      }
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
        `(user.fullName~~'*${term}*' or user.email~~'*${term}*' or user.phoneNumber~~'*${term}*')`,
      );
    }

    if (experience) {
      conditions.push(`experienceYears:'${experience}'`);
    }

    if (hasCurrentStudents) {
      conditions.push(`hasCurrentStudents:${hasCurrentStudents}`);
    }

    return conditions.length > 0 ? conditions.join(" and ") : undefined;
  }, [debouncedSearch, experience, hasCurrentStudents]);

  // ── Active filter count (for badge) ─────────────────────────────────────

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (trainingLevelIds.length > 0) count++;
    if (provinceId !== "ALL") count++;
    if (districtIds.length > 0) count++;
    if (experience) count++;
    if (hasCurrentStudents) count++;
    if (statuses.length > 0) count++;
    return count;
  }, [
    trainingLevelIds,
    provinceId,
    districtIds,
    experience,
    hasCurrentStudents,
    statuses,
  ]);

  const hasActiveFilters = useMemo(
    () => !!search || activeFilterCount > 0,
    [search, activeFilterCount],
  );

  // ── Convenience page / sort setters ─────────────────────────────────────

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
    // filters (raw)
    filters: {
      search,
      trainingLevelIds,
      provinceId,
      districtIds,
      experience,
      hasCurrentStudents,
      statuses,
    } satisfies TeacherFilterValues,
    // derived
    filterQuery,
    trainingLevelIds,
    provinceId,
    districtIds,
    statuses,
    hasActiveFilters,
    activeFilterCount,
    // actions
    setFilter,
    resetFilters,
  };
};
