import { useMemo, useState } from "react";
import { MOCK_REPORTS, type MockReport } from "../mocks/mock-reports";
import { ReportItem, ReportItemSkeleton } from "./ReportItem";

const INITIAL_COUNT = 4;
const LOAD_MORE_COUNT = 4;

type StatusFilter = "pending" | "resolved" | "all";

const STATUS_FILTERS: { key: StatusFilter; label: string }[] = [
  { key: "pending", label: "Chưa xử lý" },
  { key: "resolved", label: "Đã xử lý" },
  { key: "all", label: "Tất cả" },
];

type MobileReportListProps = {
  searchQuery?: string;
};

export const MobileReportList = ({ searchQuery }: MobileReportListProps) => {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("pending");

  // Filter reports by status + search query
  const filteredReports = useMemo(() => {
    let results: MockReport[] = MOCK_REPORTS;

    // Status filter
    if (statusFilter === "pending") {
      results = results.filter((r) => r.status === "pending");
    } else if (statusFilter === "resolved") {
      results = results.filter(
        (r) => r.status === "resolved" || r.status === "dismissed",
      );
    }

    // Search filter
    if (searchQuery?.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter((r) => {
        const targetName =
          r.type === "teacher"
            ? r.reportedTeacher.fullName
            : r.reportedPost.owner.fullName;
        return (
          targetName.toLowerCase().includes(q) ||
          r.reporter.fullName.toLowerCase().includes(q)
        );
      });
    }

    return results;
  }, [searchQuery, statusFilter]);

  const visibleReports = filteredReports.slice(0, visibleCount);
  const hasMore = visibleCount < filteredReports.length;

  // Reset visible count when filter changes
  const handleFilterChange = (filter: StatusFilter) => {
    setStatusFilter(filter);
    setVisibleCount(INITIAL_COUNT);
  };

  // Simulate initial loading (remove when using real API)
  const [isLoading] = useState(false);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 px-4 pb-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <ReportItemSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 px-4 pb-4">
      {/* Status filter chips */}
      <div className="flex items-center gap-2">
        {STATUS_FILTERS.map((filter) => {
          const isActive = statusFilter === filter.key;
          return (
            <button
              key={filter.key}
              onClick={() => handleFilterChange(filter.key)}
              className={`
                px-3.5 py-1.5 text-xs font-medium rounded-full border transition-all duration-200
                ${
                  isActive
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                }
              `}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      {/* Empty state */}
      {filteredReports.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <span className="text-2xl">📋</span>
          </div>
          <p className="text-sm font-medium text-slate-600">
            Không có báo cáo nào
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Chưa có báo cáo phù hợp với bộ lọc
          </p>
        </div>
      ) : (
        <>
          {/* Result count */}
          <div className="flex items-center justify-between px-1">
            <span className="text-xs text-slate-400">
              Hiển thị {visibleReports.length} / {filteredReports.length} báo
              cáo
            </span>
          </div>

          {/* Report cards */}
          {visibleReports.map((report) => (
            <ReportItem
              key={report.id}
              report={report}
              onWarnTeacher={(r) => {
                // TODO: Implement warn teacher action
                const name =
                  r.type === "teacher"
                    ? r.reportedTeacher.fullName
                    : r.reportedPost.owner.fullName;
                console.log("Warn teacher:", name);
              }}
              onBlockTeacher={(r) => {
                // TODO: Implement block teacher action
                const name =
                  r.type === "teacher"
                    ? r.reportedTeacher.fullName
                    : r.reportedPost.owner.fullName;
                console.log("Block teacher:", name);
              }}
              onDismiss={(r) => {
                // TODO: Implement dismiss report action
                console.log("Dismiss report:", r.id);
              }}
            />
          ))}

          {/* Load more */}
          {hasMore && (
            <div className="flex justify-center py-4">
              <button
                onClick={() =>
                  setVisibleCount((prev) => prev + LOAD_MORE_COUNT)
                }
                className="flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium rounded-xl border transition-all duration-200 bg-white text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300 active:bg-blue-100 shadow-sm"
              >
                Xem thêm
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
