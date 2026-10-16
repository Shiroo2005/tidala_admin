import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetDashboardStats } from "../hooks/useGetDashboardStats";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardSkeletons } from "./DashboardSkeletons";
import { DashboardError } from "./DashboardError";
import { MetricCards } from "./MetricCards";
import { AccountStatusChart } from "./AccountStatusChart";
import { ReportsDonutChart } from "./ReportsDonutChart";
import { ContentStructureChart } from "./ContentStructureChart";
// import { OperationPanel } from "./OperationPanel";

export const Dashboard = () => {
  const [period, setPeriod] = useState<"TODAY" | "WEEK" | "MONTH" | "ALL">(
    "ALL",
  );
  const {
    userStatsQuery,
    teacherStatsQuery,
    reportStatsQuery,
    postStatsQuery,
    isLoading,
    isError,
    refetchAll,
  } = useGetDashboardStats(period);

  // Safe data extraction
  const users = userStatsQuery.data || {
    total: 0,
    active: 0,
    inactive: 0,
    banned: 0,
  };
  const teachers = teacherStatsQuery.data || {
    total: 0,
    success: 0,
    draft: 0,
  };
  const reports = reportStatsQuery.data || {
    total: 0,
    teacher: 0,
    post: 0,
    comment: 0,
    review: 0,
  };
  const posts = postStatsQuery.data || { total: 0, knowledge: 0, qAndA: 0 };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header and Filter Control */}
      <DashboardHeader
        period={period}
        setPeriod={setPeriod}
        refetchAll={refetchAll}
        isLoading={isLoading}
      />

      {/* Loading Skeletons, Error Screen & Main Content */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <DashboardSkeletons />
        ) : isError ? (
          <DashboardError refetchAll={refetchAll} />
        ) : (
          <motion.div
            key="dashboard-content"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-8"
          >
            {/* Key Metrics Cards */}
            <MetricCards
              users={users}
              teachers={teachers}
              posts={posts}
              reports={reports}
              itemVariants={itemVariants}
            />

            {/* Row 1: Trạng thái Tài khoản Người dùng & Giáo viên (Full Width) */}
            <div className="w-full">
              <AccountStatusChart
                users={users}
                teachers={teachers}
                itemVariants={itemVariants}
              />
            </div>

            {/* Row 2: Phân tích Nguồn Báo Cáo & Cơ cấu Nội dung Bài viết (Side-by-Side) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chart 2: Phân tích Nguồn Báo Cáo Vi Phạm (Donut) */}
              <ReportsDonutChart
                reports={reports}
                itemVariants={itemVariants}
              />

              {/* Chart 3: Cơ cấu Nội dung Bài viết (Donut Chart) */}
              <ContentStructureChart
                posts={posts}
                itemVariants={itemVariants}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
