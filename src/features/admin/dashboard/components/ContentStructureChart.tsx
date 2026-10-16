/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { formatNumber } from "./CustomTooltips";
import type { PostStats } from "../types";

interface ContentStructureChartProps {
  posts: PostStats;
  itemVariants: any;
}

export const ContentStructureChart = ({
  posts,
  itemVariants,
}: ContentStructureChartProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Data processing for Chart 3: Pie Chart (Community Post Types)
  const postsData = [
    { name: "Kiến thức lý thuyết", value: posts.knowledge, color: "#8b5cf6" },
    { name: "Hỏi đáp tương tác", value: posts.qAndA, color: "#f59e0b" },
  ];

  const totalPostsCount = posts.knowledge + posts.qAndA;

  const activeItem = activeIndex !== null ? postsData[activeIndex] : null;
  const activePercent =
    activeItem && totalPostsCount > 0
      ? ((activeItem.value / totalPostsCount) * 100).toFixed(1)
      : "0";

  const activeSlicesCount = postsData.filter((d) => d.value > 0).length;

  return (
    <motion.div
      variants={itemVariants}
      className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[420px]"
    >
      <div>
        <h3 className="text-lg font-bold text-slate-800">
          Cơ cấu Nội dung Bài viết
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Xu hướng đóng góp và tương tác nội dung của cộng đồng
        </p>
      </div>

      <div className="flex-1 flex flex-col justify-center mt-2 min-h-0">
        <div className="h-[200px] w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={postsData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={activeSlicesCount <= 1 ? 0 : 2}
                dataKey="value"
                nameKey="name"
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                cursor="pointer"
              >
                {postsData.map((entry, index) => (
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

          {/* Central Text displaying Total Posts or Hovered Details */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
            {activeItem ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col items-center"
              >
                <span
                  className="text-2xl font-extrabold"
                  style={{ color: activeItem.color }}
                >
                  {formatNumber(activeItem.value)}
                </span>
                <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider max-w-[90px] leading-tight wrap-break-words">
                  {activeItem.name}
                </span>
                <span className="text-slate-400 text-3xs font-medium mt-0.5">
                  {activePercent}%
                </span>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center">
                <span className="text-2xl font-extrabold text-slate-800">
                  {formatNumber(totalPostsCount)}
                </span>
                <span className="text-slate-400 text-3xs uppercase font-bold tracking-wider">
                  Bài viết
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center gap-6 mt-4 text-xs">
          {postsData.map((item, idx) => (
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
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-slate-600 font-medium">
                {item.name}: {formatNumber(item.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
