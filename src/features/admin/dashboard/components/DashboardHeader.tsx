import { motion } from "framer-motion";
import { FiCalendar, FiRefreshCw } from "react-icons/fi";

type PeriodType = "TODAY" | "WEEK" | "MONTH" | "ALL";

const PERIOD_LABELS: Record<PeriodType, string> = {
  TODAY: "Hôm nay",
  WEEK: "Tuần này",
  MONTH: "Tháng này",
  ALL: "Tất cả",
};

interface DashboardHeaderProps {
  period: PeriodType;
  setPeriod: (period: PeriodType) => void;
  refetchAll: () => void;
  isLoading: boolean;
}

export const DashboardHeader = ({
  period,
  setPeriod,
  refetchAll,
  isLoading,
}: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-linear-to-r from-slate-900 via-blue-900 to-indigo-950 bg-clip-text text-transparent">
          Bảng Điều Khiển Quản Trị
        </h1>
        <p className="text-slate-500 mt-1 text-sm md:text-base flex items-center gap-1.5">
          <FiCalendar className="text-blue-500 shrink-0" />
          Giám sát toàn bộ hoạt động hệ thống & các chỉ số vận hành chính
        </p>
      </div>

      {/* Global Period Filter */}
      <div className="flex items-center gap-3 self-end sm:self-auto bg-slate-100/80 backdrop-blur-xs p-1.5 rounded-xl border border-slate-200/50">
        <span className="text-xs font-semibold text-slate-400 px-2 uppercase tracking-wider hidden md:inline">
          Chu kỳ:
        </span>
        {(["TODAY", "WEEK", "MONTH", "ALL"] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 relative ${
              period === p
                ? "bg-white text-blue-700 shadow-xs border border-slate-200/40"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
            }`}
          >
            {period === p && (
              <motion.div
                layoutId="activePeriod"
                className="absolute inset-0 bg-white rounded-lg -z-10 shadow-xs border border-slate-200/40"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            {PERIOD_LABELS[p]}
          </button>
        ))}
        <button
          onClick={refetchAll}
          title="Làm mới dữ liệu"
          className="p-2 text-slate-500 hover:text-blue-600 hover:bg-white rounded-lg transition-all ml-1"
        >
          <FiRefreshCw
            className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`}
          />
        </button>
      </div>
    </div>
  );
};
