import { getAdminTeachers } from "@/features/admin/teacher-management-v2/teacher-table/services/get-admin-teachers";
import type { AdminTeacherDetail } from "@/features/admin/teacher-management-v2/types";
import {
  getNextRequestedPage,
  toInfinitePage,
} from "@/features/teacher-result/hooks/pagination";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback } from "react";

const PAGE_SIZE = 4;

interface UseTeachersLoadMoreReturn {
  /** Currently displayed teachers */
  teachers: AdminTeacherDetail[];
  /** True during the initial page 1 fetch */
  isInitialLoading: boolean;
  /** True while fetching the next page after "Xem thêm" */
  isPrefetching: boolean;
  /** True if there are more pages to load */
  hasMore: boolean;
  /** Appends next page data */
  loadMore: () => void;
  /** Total number of teachers from API */
  totalElements: number;
}

/**
 * Load-more pagination hook using React Query's useInfiniteQuery for teachers.
 */
export const useTeachersLoadMore = (
  filter?: string,
): UseTeachersLoadMoreReturn => {
  const query = useInfiniteQuery({
    queryKey: ["admin", "teachers", "infinite", filter],

    initialPageParam: 0,

    queryFn: async ({ pageParam }) => {
      const response = await getAdminTeachers({
        filter: filter || undefined,
        page: pageParam, // API is 0-indexed
        size: PAGE_SIZE,
      });

      return toInfinitePage(response, pageParam);
    },

    getNextPageParam: getNextRequestedPage,
  });

  const teachers = query.data?.pages.flatMap((page) => page.content) ?? [];
  const totalElements = query.data?.pages?.[0]?.totalElements ?? 0;

  const loadMore = useCallback(() => {
    if (!query.hasNextPage || query.isFetchingNextPage) return;
    query.fetchNextPage({ cancelRefetch: false });
  }, [query]);

  return {
    teachers,
    isInitialLoading: query.isLoading,
    isPrefetching: query.isFetchingNextPage,
    hasMore: !!query.hasNextPage,
    loadMore,
    totalElements,
  };
};
