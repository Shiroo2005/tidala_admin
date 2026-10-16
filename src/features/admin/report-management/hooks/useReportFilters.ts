/**
 * useReportFilters — URL-backed filter + pagination state.
 *
 * All values are stored in URL search params so navigating to a detail page
 * and pressing Back restores the exact previous state.
 */

import { useMemo } from "react";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useGetAdminReports } from "./useGetAdminReports";
import type { ReportReasonId } from "../constants/report-reasons";
import {
  useTableQueryState,
  parseNumber,
  serializeNumber,
  parseString,
  serializeString,
} from "@/shared/hooks/useTableQueryState";

export type ReportStatus = "PENDING" | "REVIEWING" | "RESOLVED" | "REJECTED";
export type StatusFilter =
  | "pending"
  | "reviewing"
  | "resolved"
  | "rejected"
  | "all";
export type ReportType = "teacher" | "post" | "review";

const ITEMS_PER_PAGE = 20;

const REPORT_SCHEMA = {
  page: {
    key: "p",
    default: 1,
    parse: parseNumber,
    serialize: serializeNumber,
  },
  searchQuery: {
    key: "q",
    default: "",
    parse: parseString,
    serialize: serializeString,
  },
  reasonFilter: {
    key: "reason",
    default: "all" as ReportReasonId | "all",
    parse: parseString as (raw: string) => ReportReasonId | "all",
    serialize: serializeString,
  },
  statusFilter: {
    key: "status",
    default: "pending" as StatusFilter,
    parse: parseString as (raw: string) => StatusFilter,
    serialize: serializeString,
  },
} as const;

export const useReportFilters = (reportType: ReportType = "teacher") => {
  const [params, setParam, resetParams] = useTableQueryState(REPORT_SCHEMA);
  const { page, searchQuery, reasonFilter, statusFilter } = params;

  const debouncedSearch = useDebounce(searchQuery, 300);

  const filterQuery = useMemo(() => {
    const conditions = [];

    conditions.push(`targetType:'${reportType.toUpperCase()}'`);

    if (debouncedSearch?.trim()) {
      const term = debouncedSearch.trim().replace(/'/g, "''");
      conditions.push(`(reporterName~~'*${term}*' or reporterEmail~~'*${term}*')`);
    }

    if (reasonFilter !== "all") {
      conditions.push(`reason:'${reasonFilter}'`);
    }

    if (statusFilter !== "all") {
      conditions.push(`status:'${statusFilter.toUpperCase()}'`);
    }

    return conditions.join(" and ");
  }, [reportType, debouncedSearch, reasonFilter, statusFilter]);

  const { data: reportsData, isLoading } = useGetAdminReports({
    filter: filterQuery,
    page,
    size: ITEMS_PER_PAGE,
    sort: ["createdAt,desc"],
  });

  const handleSearchChange = (value: string) => {
    setParam({ searchQuery: value });
  };

  const handleReasonChange = (value: ReportReasonId | "all") => {
    setParam({ reasonFilter: value });
  };

  const handleStatusChange = (value: StatusFilter) => {
    setParam({ statusFilter: value });
  };

  const handlePageChange = (p: number) => {
    setParam({ page: p }, { preservePage: true });
  };

  const handleReset = () => {
    resetParams();
  };

  return {
    searchQuery,
    setSearchQuery: handleSearchChange,
    reasonFilter,
    setReasonFilter: handleReasonChange,
    statusFilter,
    setStatusFilter: handleStatusChange,
    page,
    setPage: handlePageChange,
    onReset: handleReset,
    filteredReports: reportsData?.content || [],
    totalCount: reportsData?.totalElements || 0,
    totalPages: reportsData?.totalPages || 1,
    itemsPerPage: ITEMS_PER_PAGE,
    isLoading,
  };
};
