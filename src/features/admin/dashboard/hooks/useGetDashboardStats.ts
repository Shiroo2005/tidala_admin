import { useQuery } from "@tanstack/react-query";
import {
  getPostStats,
  getReportStats,
  getTeacherStats,
  getUserStats,
} from "../services/get-stats";

export const useGetDashboardStats = (period: string) => {
  const userStatsQuery = useQuery({
    queryKey: ["admin", "stats", "users", period],
    queryFn: () => getUserStats(period),
  });

  const teacherStatsQuery = useQuery({
    queryKey: ["admin", "stats", "teachers", period],
    queryFn: () => getTeacherStats(period),
  });

  const reportStatsQuery = useQuery({
    queryKey: ["admin", "stats", "reports", period],
    queryFn: () => getReportStats(period),
  });

  const postStatsQuery = useQuery({
    queryKey: ["admin", "stats", "posts", period],
    queryFn: () => getPostStats(period),
  });

  const isLoading =
    userStatsQuery.isLoading ||
    teacherStatsQuery.isLoading ||
    reportStatsQuery.isLoading ||
    postStatsQuery.isLoading;

  const isError =
    userStatsQuery.isError ||
    teacherStatsQuery.isError ||
    reportStatsQuery.isError ||
    postStatsQuery.isError;

  return {
    userStatsQuery,
    teacherStatsQuery,
    reportStatsQuery,
    postStatsQuery,
    isLoading,
    isError,
    refetchAll: () => {
      userStatsQuery.refetch();
      teacherStatsQuery.refetch();
      reportStatsQuery.refetch();
      postStatsQuery.refetch();
    },
  };
};
