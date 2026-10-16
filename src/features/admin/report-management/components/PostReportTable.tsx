import { imageUrls } from "@/shared/constants/imageUrls";
import { getStorageUrl } from "@/shared/utils/url";
import {
  FiAlertTriangle,
  FiEye,
  FiEyeOff,
  FiSlash,
  FiX,
  FiMoreHorizontal,
} from "react-icons/fi";
import { getReportReasonByIdAndType } from "../constants/report-reasons";
import type { ReportData } from "../types/report.type";
import { AdminTable, type ColumnDef } from "@/shared/components/admin-table";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/shared/components/ui/dropdown-menu";
import { APP_PATHS } from "@/shared/constants/appPaths";
/* eslint-disable @typescript-eslint/no-explicit-any */

const SHOW_REPORT_TABLE_ACTION_MENU = false;

interface PostReportTableProps {
  reports: ReportData[];
  page: number;
  totalRows: number;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
  onViewDetail: (report: ReportData) => void;
  onIgnore: (report: ReportData) => void;
  onWarn: (report: ReportData) => void;
  onBan: (report: ReportData) => void;
  onHide: (report: ReportData) => void;
}

const STATUS_MAP = {
  PENDING: {
    label: "Chờ xử lý",
    className: "bg-amber-50 text-amber-600 border-amber-200/50",
  },
  REVIEWING: {
    label: "Đang xem xét",
    className: "bg-blue-50 text-blue-600 border-blue-200/50",
  },
  RESOLVED: {
    label: "Đã xử lý",
    className: "bg-emerald-50 text-emerald-600 border-emerald-200/50",
  },
  REJECTED: {
    label: "Đã bỏ qua",
    className: "bg-slate-50 text-slate-500 border-slate-200/50",
  },
} as const;

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDateOnly = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const PostReportTable = ({
  reports,
  page,
  totalRows,
  isLoading = false,
  onPageChange,
  onViewDetail,
  onIgnore,
  onWarn,
  onBan,
  onHide,
}: PostReportTableProps) => {
  const navigate = useNavigate();
  const columns = useMemo<ColumnDef<ReportData, any>[]>(
    () => [
      {
        id: "target",
        header: "Bài viết bị báo cáo",
        enableSorting: false,
        size: 280,
        cell: ({ row }) => {
          const report = row.original;
          const target = report.target as any; // Cast safely

          if (!target) {
            return (
              <div className="flex w-[260px] max-w-[260px] flex-col gap-0.5">
                <span className="truncate text-sm font-semibold text-slate-400 italic">
                  Bài viết không tồn tại hoặc đã bị xóa
                </span>
                <span className="inline-flex min-w-max self-start whitespace-nowrap text-[10px] font-bold px-1.5 py-px rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                  ID: {report.targetId || "Không có ID"}
                </span>
              </div>
            );
          }

          const contentText = target.contentSnippet || target.content || "Không có nội dung";
          const authorName = target.author?.fullName || target.authorName || "Người dùng";
          const authorAvatar = getStorageUrl(target.author?.avatarUrl) || imageUrls.fallback.avatar;

          return (
            <div className="flex w-[260px] max-w-[260px] items-start gap-3">
              <img
                src={authorAvatar}
                alt={authorName}
                className="h-9 w-9 shrink-0 rounded-full border border-slate-100 bg-white object-cover shadow-2xs"
                loading="lazy"
              />
              <div className="flex min-w-0 w-full flex-col">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(APP_PATHS.ADMIN_POST_DETAIL_WITH_ID(target.id));
                  }}
                  className="line-clamp-2 w-full text-left text-sm font-semibold leading-snug text-slate-800 transition-colors hover:text-blue-600 hover:underline cursor-pointer"
                  title={contentText}
                >
                  {contentText}
                </button>
                <span className="mt-1 block truncate whitespace-nowrap text-xs text-slate-400 font-medium">
                  {target.title ? (
                    target.title
                  ) : authorName ? (
                    <>
                      Bài viết của{" "}
                      <span className="text-indigo-500 font-semibold">
                        {authorName}
                      </span>
                    </>
                  ) : (
                    "Không có tiêu đề"
                  )}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "reporterName",
        header: "Người báo cáo",
        enableSorting: false,
        size: 250,
        cell: ({ row }) => {
          const report = row.original;
          const reporterAvatar =
            getStorageUrl(report.reporterAvatarUrl) || imageUrls.fallback.avatar;
          return (
            <div className="flex min-w-[220px] items-center gap-3">
              <img
                src={reporterAvatar}
                alt={report.reporterName}
                className="h-9 w-9 shrink-0 rounded-full object-cover bg-app-surface border border-slate-100 shadow-2xs"
              />
              <div className="flex flex-col min-w-0">
                <span className="truncate text-sm font-semibold text-slate-800">
                  {report.reporterName}
                </span>
                <span className="truncate text-xs text-slate-400 font-medium">
                  {report.reporterEmail}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "reason",
        header: "Lý do",
        enableSorting: false,
        size: 180,
        cell: ({ row }) => {
          const report = row.original;
          const reasonInfo = getReportReasonByIdAndType(
            report.reason as string,
            report.targetType,
          );
          if (!reasonInfo) return null;
          return (
            <span className="inline-flex min-w-max whitespace-nowrap text-sm font-semibold text-slate-700">
              {reasonInfo.label}
            </span>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        enableSorting: false,
        size: 130,
        cell: ({ getValue }) => {
          const status = getValue() as string;
          const statusInfo =
            STATUS_MAP[status as keyof typeof STATUS_MAP] || STATUS_MAP.PENDING;
          return (
            <span
              className={`inline-flex min-w-max shrink-0 items-center px-2.5 py-0.5 rounded-full text-xs font-bold border whitespace-nowrap ${statusInfo.className}`}
            >
              {statusInfo.label}
            </span>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Ngày tạo",
        enableSorting: false,
        size: 150,
        cell: ({ getValue }) => (
          <>
            <span className="whitespace-nowrap text-sm font-semibold text-slate-400 sm:hidden">
              {formatDateOnly(getValue() as string)}
            </span>
            <span className="hidden whitespace-nowrap text-sm font-semibold text-slate-400 sm:inline">
              {formatDate(getValue() as string)}
            </span>
          </>
        ),
      },
      {
        id: "actions",
        header: "Thao tác",
        enableSorting: false,
        size: 140,
        cell: ({ row }) => {
          const report = row.original;
          return (
            <div
              className="inline-flex items-center gap-1.5"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="flex h-7 shrink-0 whitespace-nowrap items-center justify-center gap-1 rounded-lg bg-blue-50/80 px-2.5 text-xs font-bold text-blue-600 border border-blue-200/40 hover:bg-blue-600 hover:text-white cursor-pointer transition-all duration-200 outline-none shadow-2xs"
                title="Xem chi tiết"
                onClick={() => onViewDetail(report)}
              >
                <FiEye className="h-3.5 w-3.5" />
                <span className="whitespace-nowrap">Chi tiết</span>
              </button>

              {SHOW_REPORT_TABLE_ACTION_MENU && (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <button
                        type="button"
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 cursor-pointer transition-all duration-200 outline-none shadow-2xs shrink-0"
                        title="Thao tác khác"
                      />
                    }
                  >
                    <FiMoreHorizontal className="h-3.5 w-3.5" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onIgnore(report)}>
                      <FiX className="mr-2 h-3.5 w-3.5 text-slate-400" />
                      Bỏ qua
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onWarn(report)}>
                      <FiAlertTriangle className="mr-2 h-3.5 w-3.5 text-amber-500" />
                      Cảnh báo
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onHide(report)}>
                      <FiEyeOff className="mr-2 h-3.5 w-3.5 text-red-500" />
                      Ẩn bài viết
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onBan(report)}
                      className="text-red-600 hover:bg-red-50 focus:bg-red-50"
                    >
                      <FiSlash className="mr-2 h-3.5 w-3.5 text-red-500" />
                      Chặn người đăng bài
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          );
        },
      },
    ],
    [onViewDetail, onIgnore, onWarn, onBan, onHide, navigate],
  );

  const emptyState = (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-app-text-muted">
      <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-2">
        <span className="text-xl">📋</span>
      </div>
      <p className="text-sm font-semibold text-slate-600">
        Không có báo cáo nào
      </p>
      <p className="text-xs text-slate-400">
        Chưa có báo cáo phù hợp với bộ lọc hiện tại
      </p>
    </div>
  );

  return (
    <AdminTable
      columns={columns}
      data={reports}
      totalRows={totalRows}
      currentPage={page}
      pageSize={20}
      isLoading={isLoading}
      getRowId={(row) => row.id}
      emptyState={emptyState}
      onRowClick={(row) => onViewDetail(row)}
      onPageChange={onPageChange}
    />
  );
};
