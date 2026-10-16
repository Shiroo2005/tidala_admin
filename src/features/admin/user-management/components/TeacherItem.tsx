import { imageUrls } from "@/shared/constants/imageUrls";
import { getStatusColor } from "@/features/admin/teacher-management-v2/teacher-detail/components/utils";
import type { AdminTeacherDetail } from "@/features/admin/teacher-management-v2/types";
import { getStorageUrl } from "@/shared/utils/url";
import { FiMail, FiPhone } from "react-icons/fi";

type TeacherItemProps = {
  teacher: AdminTeacherDetail;
  onViewDetail?: (teacher: AdminTeacherDetail) => void;
};

export const TeacherItem = ({ teacher, onViewDetail }: TeacherItemProps) => {
  const avatarSrc = getStorageUrl(teacher.avatarUrl) || imageUrls.fallback.avatar;
  const statusInfo = getStatusColor(teacher.status);

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-14 h-14 rounded-full bg-slate-100 shrink-0 overflow-hidden border-2 border-white shadow-sm">
          <img
            src={avatarSrc}
            alt={teacher.fullName}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-slate-900 truncate">
              {teacher.fullName}
            </h3>
            <span
              className="shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: statusInfo.bg,
                color: statusInfo.color,
                border: `1px solid ${statusInfo.border}`,
              }}
            >
              {statusInfo.label}
            </span>
          </div>

          {/* Email */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <FiMail size={13} className="text-slate-400 shrink-0" />
            <span className="text-xs text-slate-500 truncate">
              {teacher.email}
            </span>
          </div>

          {/* Phone */}
          {teacher.phoneNumber && (
            <div className="flex items-center gap-1.5 mt-1">
              <FiPhone size={13} className="text-slate-400 shrink-0" />
              <span className="text-xs text-slate-500">
                {teacher.phoneNumber}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Action */}
      <div className="mt-3">
        <button
          onClick={() => onViewDetail?.(teacher)}
          className="w-full py-2 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg border border-blue-100 transition-colors hover:bg-blue-100 active:bg-blue-200"
        >
          Xem chi tiết
        </button>
      </div>
    </div>
  );
};

/** Skeleton placeholder shown during initial load */
export const TeacherItemSkeleton = () => (
  <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
    <div className="flex items-start gap-3">
      <div className="w-14 h-14 rounded-full bg-slate-200 shrink-0 animate-pulse" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <div className="h-4 w-28 bg-slate-200 rounded animate-pulse" />
          <div className="h-4 w-14 bg-slate-100 rounded-full animate-pulse" />
        </div>
        <div className="mt-2 h-3 w-40 bg-slate-100 rounded animate-pulse" />
        <div className="mt-1.5 h-3 w-28 bg-slate-100 rounded animate-pulse" />
      </div>
    </div>
    <div className="mt-3">
      <div className="h-8 w-full bg-slate-100 rounded-lg animate-pulse" />
    </div>
  </div>
);
