import type { AccountModerationTarget } from "@/features/admin/account-moderation/components/AccountModerationDialog";
import type { AdminStudentDetail } from "@/features/admin/student-management/types";
import { isSuspensionActive } from "@/features/admin/teacher-management-v2/utils/suspension";
import {
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Ban,
  MoreVertical,
  ShieldAlert,
  UnlockKeyhole,
} from "lucide-react";
import { useState } from "react";

interface StudentRowActionsProps {
  student: AdminStudentDetail;
  onWarnAccount: (target: AccountModerationTarget) => void;
  onBlockAccount: (target: AccountModerationTarget) => void;
  onRevokeSanction: (target: AccountModerationTarget) => void;
}

export const StudentRowActions = ({
  student,
  onWarnAccount,
  onBlockAccount,
  onRevokeSanction,
}: StudentRowActionsProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const hasActiveSanction =
    isSuspensionActive(student.suspension) ||
    student.status?.toUpperCase() === "BANNED";
  const target: AccountModerationTarget = {
    userId: student.id,
    fullName: student.fullName,
    email: student.email,
    phoneNumber: student.phoneNumber,
    avatarUrl: student.avatarUrl,
  };

  const closeMenu = () => setAnchorEl(null);

  return (
    <>
      <button
        type="button"
        className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100/80 text-slate-600 transition-all duration-200 hover:bg-slate-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        title="Tùy chọn"
        disabled={!student.id}
        onClick={(event) => {
          event.stopPropagation();
          setAnchorEl(event.currentTarget);
        }}
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
    </>
  );
};
