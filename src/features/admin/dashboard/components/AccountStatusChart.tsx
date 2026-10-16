/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatNumber } from "./CustomTooltips";
import type { TeacherStats, UserStats } from "../types";

interface AccountStatusChartProps {
  users: UserStats;
  teachers: TeacherStats;
  itemVariants: any;
}

const ChartTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200 shadow-lg text-sm flex items-center gap-2">
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: data.color }}
        />
        <span className="font-medium text-slate-600">{data.name}:</span>
        <span className="font-bold text-slate-900">{formatNumber(data.value)}</span>
      </div>
    );
  }
  return null;
};

export const AccountStatusChart = ({
  users,
  teachers,
  itemVariants,
}: AccountStatusChartProps) => {
  const userData = [
    { name: "Hoạt động", value: users.active, color: "#10b981" },
    { name: "Chưa hoạt động", value: users.inactive, color: "#f59e0b" },
    { name: "Đã chặn", value: users.banned, color: "#f43f5e" },
  ];

  const teacherData = [
    { name: "Hoàn thiện hồ sơ", value: teachers.success, color: "#06b6d4" },
    { name: "Chưa hoàn thiện", value: teachers.draft, color: "#8b5cf6" },
  ];

  return (
    <motion.div
      variants={itemVariants}
      className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[420px]"
    >
      <div>
        <h3 className="text-lg font-bold text-slate-800">
          Trạng thái Tài khoản Người dùng & Giáo viên
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Theo dõi trạng thái tài khoản của người dùng và giáo viên trong hệ thống
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1 w-full mt-6 min-h-0">
        {/* User Chart */}
        <div className="flex flex-col h-[280px]">
          <h4 className="text-sm font-semibold text-slate-600 mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            Tài khoản Người dùng
          </h4>
          <div className="flex-1 w-full relative min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={userData}
                margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                barSize={32}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  content={<ChartTooltip />}
                  cursor={{ fill: "#f8fafc" }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {userData.map((entry, index) => (
                    <Cell key={`cell-user-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Teacher Chart */}
        <div className="flex flex-col h-[280px]">
          <h4 className="text-sm font-semibold text-slate-600 mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Tài khoản Giáo viên
          </h4>
          <div className="flex-1 w-full relative min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={teacherData}
                margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                barSize={32}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f1f5f9"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  content={<ChartTooltip />}
                  cursor={{ fill: "#f8fafc" }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {teacherData.map((entry, index) => (
                    <Cell key={`cell-teacher-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
