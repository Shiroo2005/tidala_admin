import { Dialog } from "@mui/material";
import { FiAlertTriangle, FiX } from "react-icons/fi";

interface LoadingReportDetailDialogProps {
  open: boolean;
  isError: boolean;
  onClose: () => void;
  onRetry: () => void;
}

export const LoadingReportDetailDialog = ({
  open,
  isError,
  onClose,
  onRetry,
}: LoadingReportDetailDialogProps) => (
  <Dialog
    open={open}
    onClose={onClose}
    maxWidth="sm"
    fullWidth
    PaperProps={{
      sx: {
        borderRadius: "18px",
        overflow: "hidden",
      },
    }}
  >
    <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
      <div className="min-w-0">
        <h2 className="text-base font-extrabold text-slate-950">
          Chi tiết báo cáo
        </h2>
        <p className="mt-1 text-xs font-medium text-slate-500">
          Đang lấy dữ liệu mới nhất từ hệ thống
        </p>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="ml-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-700"
        aria-label="Đóng"
      >
        <FiX size={18} />
      </button>
    </div>

    <div className="bg-slate-50 px-5 py-10 sm:px-6">
      {isError ? (
        <div className="mx-auto flex max-w-sm flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
            <FiAlertTriangle size={22} />
          </div>
          <p className="mt-4 text-sm font-bold text-slate-900">
            Không thể tải chi tiết báo cáo
          </p>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            Vui lòng thử tải lại để lấy thông tin mới nhất.
          </p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100"
          >
            Tải lại
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="h-24 animate-pulse rounded-xl bg-white" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="h-24 animate-pulse rounded-xl bg-white" />
            <div className="h-24 animate-pulse rounded-xl bg-white" />
          </div>
        </div>
      )}
    </div>
  </Dialog>
);
