import { motion } from "framer-motion";
import { FiAlertTriangle, FiRefreshCw } from "react-icons/fi";

interface DashboardErrorProps {
  refetchAll: () => void;
}

export const DashboardError = ({ refetchAll }: DashboardErrorProps) => {
  return (
    <motion.div
      key="error"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-red-50/50 border border-red-200 rounded-2xl p-8 text-center max-w-xl mx-auto space-y-4"
    >
      <div className="inline-flex p-3 bg-red-100 text-red-600 rounded-full">
        <FiAlertTriangle className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-red-900">
        Không thể tải dữ liệu thống kê
      </h3>
      <p className="text-red-700/80 text-sm">
        Đã xảy ra lỗi khi kết nối với máy chủ. Vui lòng kiểm tra lại đường
        truyền mạng hoặc liên hệ quản trị viên.
      </p>
      <button
        onClick={refetchAll}
        className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-xs transition-all flex items-center gap-2 mx-auto"
      >
        <FiRefreshCw className="w-4 h-4" /> Thử Lại
      </button>
    </motion.div>
  );
};
