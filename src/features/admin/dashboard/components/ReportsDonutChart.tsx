/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { formatNumber } from "./CustomTooltips";
import type { ReportStats } from "../types";

interface ReportsDonutChartProps {
  reports: ReportStats;
  itemVariants: any;
}

export const ReportsDonutChart = ({
  reports,
  itemVariants,
}: ReportsDonutChartProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Data processing for Chart 2: Donut Chart (Reports Breakdown)
  const reportsData = [
    { name: "Giáo viên bị tố cáo", value: reports.teacher, color: "#f43f5e" },
    { name: "Bài viết vi phạm", value: reports.post, color: "#f59e0b" },
    { name: "Bình luận độc hại", value: reports.comment, color: "#8b5cf6" },
    { name: "Đánh giá xấu/ảo", value: reports.review, color: "#10b981" },
  ].filter((item) => item.value >= 0);

  const totalReportsCount = reportsData.reduce(
    (acc, item) => acc + item.value,
    0,
  );

  const activeItem = activeIndex !== null ? reportsData[activeIndex] : null;
  const activePercent =
    activeItem && totalReportsCount > 0
      ? ((activeItem.value / totalReportsCount) * 100).toFixed(1)
      : "0";

  const activeSlicesCount = reportsData.filter((d) => d.value > 0).length;

  return (
    <motion.div
      variants={itemVariants}
      className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[420px]"
    >
      <div>
        <h3 className="text-lg font-bold text-slate-800">
          Phân tích Nguồn Báo Cáo
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Xác định tiêu điểm phát sinh bất ổn trên hệ thống
        </p>
      </div>

      <div className="flex-1 flex flex-col justify-center mt-4 min-h-0">
        <div className="h-[200px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={reportsData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={activeSlicesCount <= 1 ? 0 : 3}
                dataKey="value"
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                cursor="pointer"
              >
                {reportsData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    style={{
                      filter:
                        activeIndex === index
                          ? "drop-shadow(0px 4px 10px rgba(0,0,0,0.15))"
                          : "none",
                      opacity:
                        activeIndex === null || activeIndex === index ? 1 : 0.6,
                      transition: "opacity 0.2s, filter 0.2s",
                    }}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Central Text displaying Total Reports or Hovered Details */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
            {activeItem ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col items-center"
              >
                <span
                  className="text-3xl font-extrabold"
                  style={{ color: activeItem.color }}
                >
                  {formatNumber(activeItem.value)}
                </span>
                <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider max-w-[100px] leading-tight wrap-break-words">
                  {activeItem.name}
                </span>
                <span className="text-slate-400 text-3xs font-medium mt-0.5">
                  {activePercent}%
                </span>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center">
                <span className="text-3xl font-extrabold text-slate-800">
                  {formatNumber(totalReportsCount)}
                </span>
                <span className="text-slate-400 text-2xs uppercase font-bold tracking-wider">
                  Báo cáo
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Elegant Custom Interactive Legend */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-6 text-xs">
          {reportsData.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-1.5 cursor-pointer transition-opacity duration-200"
              style={{
                opacity: activeIndex === null || activeIndex === idx ? 1 : 0.5,
              }}
              onMouseEnter={() => setActiveIndex(idx)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-slate-500 truncate" title={item.name}>
                {item.name} ({formatNumber(item.value)})
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
