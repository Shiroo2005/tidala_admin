import type { AccountModerationTarget } from "@/features/admin/account-moderation/components/AccountModerationDialog";
import type { AdminTeacherDetail } from "@/features/admin/teacher-management-v2/types";
import { isSuspensionActive } from "@/features/admin/teacher-management-v2/utils/suspension";
import { APP_PATHS } from "@/shared/constants/appPaths";
import {
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Ban,
  Eye,
  MoreVertical,
  Pencil,
  Share2,
  ShieldAlert,
  UnlockKeyhole,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { getAdminTeacherId } from "../utils";

interface TeacherRowActionsProps {
  teacher: AdminTeacherDetail;
  onShareTeacher: (target: { teacherId: string; fullName: string }) => void;
  onWarnAccount: (target: AccountModerationTarget) => void;
  onBlockAccount: (target: AccountModerationTarget) => void;
  onRevokeSanction: (target: AccountModerationTarget) => void;
}

export const TeacherRowActions = ({
  teacher,
  onShareTeacher,
  onWarnAccount,
  onBlockAccount,
  onRevokeSanction,
}: TeacherRowActionsProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const teacherId = getAdminTeacherId(teacher);
  const hasActiveSanction =
    isSuspensionActive(teacher.suspension) ||
    teacher.status?.toUpperCase() === "BANNED";
  const target: AccountModerationTarget = {
    userId: teacherId,
    fullName: teacher.fullName,
    email: teacher.email,
    phoneNumber: teacher.phoneNumber,
    avatarUrl: teacher.avatarUrl,
  };
  const shareTeacherId = teacher.userId || teacherId;

  const closeMenu = () => setAnchorEl(null);

  return (
    <div
      className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white p-1 shadow-sm"
      onClick={(e) => e.stopPropagation()}
    >
      <Link
        to={
          teacherId
            ? APP_PATHS.ADMIN_TEACHER_DETAIL_WITH_ID(teacherId)
            : APP_PATHS.ADMIN_TEACHERS
        }
        className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50/80 text-blue-600 transition-all duration-200 hover:bg-blue-600 hover:text-white"
        title="Xem chi tiết"
      >
        <Eye className="h-3.5 w-3.5" />
      </Link>
      <Link
        to={
          teacherId
            ? APP_PATHS.ADMIN_TEACHER_EDIT_WITH_ID(teacherId)
            : APP_PATHS.ADMIN_TEACHERS
        }
        className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100/80 text-slate-600 transition-all duration-200 hover:bg-slate-700 hover:text-white"
        title="Chỉnh sửa"
      >
        <Pencil className="h-3.5 w-3.5" />
      </Link>
      <button
        type="button"
        className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100/80 text-slate-600 transition-all duration-200 hover:bg-slate-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        title="Tùy chọn"
        disabled={!teacherId}
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        <MoreVertical className="h-3.5 w-3.5" />
      </button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 2,
              mt: 0.5,
              minWidth: 180,
              boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
            },
          },
        }}
      >
        <MenuItem
          disabled={!shareTeacherId}
          onClick={() => {
            closeMenu();
            onShareTeacher({
              teacherId: shareTeacherId,
              fullName: teacher.fullName,
            });
          }}
        >
          <ListItemIcon>
            <Share2 className="h-4 w-4 text-blue-600" />
          </ListItemIcon>
          <ListItemText>Chia sẻ giáo viên</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            closeMenu();
            onWarnAccount(target);
          }}
        >
          <ListItemIcon>
            <ShieldAlert className="h-4 w-4 text-amber-600" />
          </ListItemIcon>
          <ListItemText>Cảnh báo người dùng</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            closeMenu();
            onBlockAccount(target);
          }}
        >
          <ListItemIcon>
            <Ban className="h-4 w-4 text-rose-600" />
          </ListItemIcon>
          <ListItemText>Chặn người dùng</ListItemText>
        </MenuItem>
        <MenuItem
          disabled={!hasActiveSanction}
          onClick={() => {
            closeMenu();
            onRevokeSanction(target);
          }}
        >
          <ListItemIcon>
            <UnlockKeyhole className="h-4 w-4 text-emerald-600" />
          </ListItemIcon>
          <ListItemText>Gỡ chặn</ListItemText>
        </MenuItem>
      </Menu>
    </div>
  );
};
