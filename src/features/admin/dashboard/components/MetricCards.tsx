/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import {
  FiUsers,
  FiShield,
  FiMessageSquare,
  FiAlertTriangle,
  FiCheckCircle,
  FiClock,
  FiBookOpen,
  FiMessageCircle,
  FiAlertCircle,
} from "react-icons/fi";
import { formatNumber } from "./CustomTooltips";
import type { PostStats, ReportStats, TeacherStats, UserStats } from "../types";

interface MetricCardsProps {
  users: UserStats;
  teachers: TeacherStats;
  posts: PostStats;
  reports: ReportStats;
  itemVariants: any;
}

export const MetricCards = ({
  users,
  teachers,
  posts,
  reports,
  itemVariants,
}: MetricCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Card 1: Người dùng */}
      <motion.div
        variants={itemVariants}
        whileHover={{ y: -6, transition: { duration: 0.2 } }}
        className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-xl transition-all relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors" />
        <div className="flex justify-between items-start">
          <div>
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
              Tổng số Người dùng
            </span>
            <h3 className="text-3xl font-extrabold text-slate-800 mt-2">
              {formatNumber(users.total)}
            </h3>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
            <FiUsers className="w-6 h-6" />
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1 text-emerald-600 font-medium">
            <FiCheckCircle className="w-3.5 h-3.5" />
            {formatNumber(users.active)} Hoạt động
          </span>
          <span>{formatNumber(users.banned)} Đã chặn</span>
        </div>
      </motion.div>

      {/* Card 2: Giáo viên */}
      <motion.div
        variants={itemVariants}
        whileHover={{ y: -6, transition: { duration: 0.2 } }}
        className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-xl transition-all relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors" />
        <div className="flex justify-between items-start">
          <div>
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
              Tổng số Giáo viên
            </span>
            <h3 className="text-3xl font-extrabold text-slate-800 mt-2">
              {formatNumber(teachers.total)}
            </h3>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
            <FiShield className="w-6 h-6" />
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1 text-emerald-600 font-medium">
            <FiCheckCircle className="w-3.5 h-3.5" />
            {formatNumber(teachers.success)} Hoàn thiện
          </span>
          <span className="flex items-center gap-1 text-amber-600 font-medium">
            <FiClock className="w-3.5 h-3.5" />
            {formatNumber(teachers.draft)} Chưa hoàn thiện
          </span>
        </div>
      </motion.div>

      {/* Card 3: Bài viết diễn đàn */}
      <motion.div
        variants={itemVariants}
        whileHover={{ y: -6, transition: { duration: 0.2 } }}
        className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-xl transition-all relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 rounded-full blur-2xl group-hover:bg-violet-500/10 transition-colors" />
        <div className="flex justify-between items-start">
          <div>
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
              Bài viết diễn đàn
            </span>
            <h3 className="text-3xl font-extrabold text-slate-800 mt-2">
              {formatNumber(posts.total)}
            </h3>
          </div>
          <div className="p-3 bg-violet-50 text-violet-600 rounded-2xl group-hover:bg-violet-600 group-hover:text-white transition-all duration-300">
            <FiMessageSquare className="w-6 h-6" />
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1 text-indigo-600 font-medium">
            <FiBookOpen className="w-3.5 h-3.5" />
            {formatNumber(posts.knowledge)} Lý thuyết
          </span>
          <span className="flex items-center gap-1 text-amber-600 font-medium">
            <FiMessageCircle className="w-3.5 h-3.5" />
            {formatNumber(posts.qAndA)} Q&A
          </span>
        </div>
      </motion.div>

      {/* Card 4: Báo cáo vi phạm */}
      <motion.div
        variants={itemVariants}
        whileHover={{ y: -6, transition: { duration: 0.2 } }}
        className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-xl transition-all relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl group-hover:bg-rose-500/10 transition-colors" />
        <div className="flex justify-between items-start">
          <div>
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
              Báo cáo vi phạm
            </span>
            <h3 className="text-3xl font-extrabold text-slate-800 mt-2">
              {formatNumber(reports.total)}
            </h3>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl group-hover:bg-rose-600 group-hover:text-white transition-all duration-300">
            <FiAlertTriangle className="w-6 h-6" />
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="text-rose-600 font-semibold flex items-center gap-1">
            <FiAlertCircle className="w-3.5 h-3.5" />
            {formatNumber(reports.teacher)} Giáo viên
          </span>
          <span>
            {formatNumber(reports.post + reports.comment + reports.review)} Mục
            khác
          </span>
        </div>
      </motion.div>
    </div>
  );
};
