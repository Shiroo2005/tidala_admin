import { getAdminStudents } from "@/features/admin/student-management/studen-list/services/get-admin-students";
import type { AdminStudentDetail } from "@/features/admin/student-management/types";
import {
  getNextRequestedPage,
  toInfinitePage,
} from "@/features/teacher-result/hooks/pagination";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback } from "react";

const PAGE_SIZE = 2;

interface UseStudentsLoadMoreReturn {
  /** Currently displayed students */
  students: AdminStudentDetail[];
  /** True during the initial page 1 fetch */
  isInitialLoading: boolean;
  /** True while fetching the next page after "Xem thêm" */
  isPrefetching: boolean;
  /** True if there are more pages to load */
  hasMore: boolean;
  /** Appends next page data */
  loadMore: () => void;
  /** Total number of students from API */
  totalElements: number;
}

/**
 * Load-more pagination hook using React Query's useInfiniteQuery.
 *
 * Replaces the manual prefetch logic with TanStack Query's built-in
 * infinite pagination, while keeping the same public API for consumers.
 */
export const useStudentsLoadMore = (
  filter?: string,
): UseStudentsLoadMoreReturn => {
  const query = useInfiniteQuery({
    queryKey: ["admin", "students", "infinite", filter],

    initialPageParam: 0,

    queryFn: async ({ pageParam }) => {
      const response = await getAdminStudents({
        filter: filter || undefined,
        page: pageParam, // API is 0-indexed
        size: PAGE_SIZE,
      });

      return toInfinitePage(response, pageParam);
    },

    getNextPageParam: getNextRequestedPage,
  });

  const students = query.data?.pages.flatMap((page) => page.content) ?? [];
  const totalElements = query.data?.pages?.[0]?.totalElements ?? 0;

  const loadMore = useCallback(() => {
    if (!query.hasNextPage || query.isFetchingNextPage) return;
    query.fetchNextPage({ cancelRefetch: false });
  }, [query]);

  return {
    students,
    isInitialLoading: query.isLoading,
    isPrefetching: query.isFetchingNextPage,
    hasMore: !!query.hasNextPage,
    loadMore,
    totalElements,
  };
};
