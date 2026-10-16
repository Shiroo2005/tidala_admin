import { AdminBreadcrumbs } from "@/shared/ui/navigation/AdminBreadcrumbs";
import {
  AccountModerationDialog,
  type AccountModerationDialogState,
  type AccountModerationTarget,
} from "@/features/admin/account-moderation/components/AccountModerationDialog";
import {
  useRevokeSanction,
  useSanctionUser,
} from "@/features/admin/account-moderation/hooks/useAccountModeration";
import {
  AccountSanctionType,
  type SanctionUserRequest,
} from "@/features/admin/account-moderation/types";
import {
  Box,
  Button,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Skeleton,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Ban, Share2, ShieldAlert, UnlockKeyhole } from "lucide-react";
import {
  MdArrowBack,
  MdEdit,
  MdMoreVert,
} from "react-icons/md";
import { useToast } from "@/shared/ui/overlay";
import {
  generateTeacherShareText,
  generateTeacherShareUrl,
} from "@/shared/utils/shareUrl";
import { useNavigate, useParams } from "react-router-dom";
import { APP_PATHS } from "@/shared/constants/appPaths";
import { useGetAdminTeacherDetail } from "../hooks/useGetAdminTeacherDetail";
import { isSuspensionActive } from "../../utils/suspension";
import { TeacherBasicInfo } from "./TeacherBasicInfo";
import { TeacherContactCard } from "./TeacherContactCard";
import { TeacherGallery } from "./TeacherGallery";
import { TeacherHeader } from "./TeacherHeader";
import { TeacherLocations } from "./TeacherLocations";
import { TeacherReviewsPanel } from "./TeacherReviewsPanel";
import { TeacherReviewsSummary } from "./TeacherReviewsSummary";
import { TeacherStats } from "./TeacherStats";
import { TeacherSuspensionBanner } from "./TeacherSuspensionBanner";
import { TeacherTags } from "./TeacherTags";
import { TeacherTraining } from "./TeacherTraining";

export const TeacherDetailContent = () => {
  const { teacherId } = useParams<{ teacherId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { mutateAsync: sanctionAccount, isPending: isSanctioning } =
    useSanctionUser();
  const { mutateAsync: revokeAccountSanction, isPending: isRevokingSanction } =
    useRevokeSanction();
  const [showReviewPanel, setShowReviewPanel] = useState(false);
  const [moderationDialog, setModerationDialog] =
    useState<AccountModerationDialogState | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const { teacherDetail, isLoadingTeacherDetail, isErrorFetchTeacherDetail } =
    useGetAdminTeacherDetail(teacherId || "");

  const handleBack = () => {
    navigate(-1);
  };

  const handleSanctionAccount = async (
    target: AccountModerationTarget,
    payload: SanctionUserRequest,
  ) => {
    await sanctionAccount({ userId: target.userId, payload });
    const actionLabel =
      payload.type === AccountSanctionType.WARNING
        ? "Đã gửi cảnh báo"
        : payload.type === AccountSanctionType.BAN
          ? "Đã chặn vĩnh viễn"
          : "Đã chặn người dùng";
    showToast({
      message: `${actionLabel} cho ${target.fullName}`,
      toastType: "success",
      position: "top",
    });
  };

  const handleRevokeSanction = async (
    target: AccountModerationTarget,
    reason: string,
  ) => {
    await revokeAccountSanction({ userId: target.userId, reason });
    showToast({
      message: `Đã gỡ chặn cho ${target.fullName}`,
      toastType: "success",
      position: "top",
    });
  };

  const handleShareTeacher = async () => {
    if (!teacherDetail) return;

    const shareUrl = generateTeacherShareUrl(teacherDetail.userId || teacherId);
    const shareText = generateTeacherShareText(teacherDetail.fullName);

    try {
      if (navigator.share) {
        await navigator.share({
          title: teacherDetail.fullName || "Thông tin giáo viên",
          text: shareText,
          url: shareUrl,
        });

        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      showToast({
        message: "Đã copy link giáo viên",
        toastType: "success",
        position: "top",
      });
    } catch (error) {
      if ((error as Error).name === "AbortError") return;

      try {
        await navigator.clipboard.writeText(shareUrl);
        showToast({
          message: "Đã copy link giáo viên",
          toastType: "success",
          position: "top",
        });
      } catch {
        showToast({
          message: "Không thể chia sẻ giáo viên",
          toastType: "error",
          position: "top",
        });
      }
    }
  };

  if (!teacherId) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={300}
      >
        <Typography color="text.secondary" variant="body1">
          Không tìm thấy giáo viên.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Breadcrumb section */}
      <Box sx={{ mb: -1 }}>
        <AdminBreadcrumbs />
      </Box>

      {/* Header with back button & Actions */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <button
            onClick={handleBack}
            className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200 outline-none cursor-pointer"
            aria-label="Quay lại"
          >
            <MdArrowBack size={22} />
          </button>
          <Box>
            <Typography variant="h5" fontWeight="bold" color="text.primary">
              Chi tiết giáo viên
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Xem thông tin chi tiết và hồ sơ giáo viên
            </Typography>
          </Box>
        </Box>

        {/* Action Buttons */}
        {teacherDetail && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Button
              variant="contained"
              size="small"
              startIcon={<MdEdit size={16} />}
              onClick={() =>
                navigate(APP_PATHS.ADMIN_TEACHER_EDIT_WITH_ID(teacherId))
              }
              sx={{
                bgcolor: "white",
                color: "text.primary",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: 2,
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                "&:hover": {
                  bgcolor: "grey.50",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
                },
              }}
            >
              Chỉnh sửa
            </Button>
            <IconButton
              size="small"
              onClick={(e) => setAnchorEl(e.currentTarget)}
              sx={{
                bgcolor: "white",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                borderRadius: 2,
                "&:hover": { bgcolor: "grey.50" },
              }}
            >
              <MdMoreVert size={20} />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={() => setAnchorEl(null)}
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
                  setAnchorEl(null);
                  void handleShareTeacher();
                }}
              >
                <ListItemIcon>
                  <Share2 className="h-4 w-4 text-blue-600" />
                </ListItemIcon>
                <ListItemText>Chia sẻ hồ sơ</ListItemText>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setAnchorEl(null);
                  setModerationDialog({
                    mode: "sanction",
                    sanctionType: AccountSanctionType.WARNING,
                    target: {
                      userId: teacherDetail.userId || teacherId,
                      fullName: teacherDetail.fullName,
                      email: teacherDetail.contactEmail,
                      phoneNumber:
                        teacherDetail.contactPhoneNumber || teacherDetail.phone,
                      avatarUrl: teacherDetail.avatarUrl,
                    },
                  });
                }}
              >
                <ListItemIcon>
                  <ShieldAlert className="h-4 w-4 text-amber-600" />
                </ListItemIcon>
                <ListItemText>Cảnh báo người dùng</ListItemText>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setAnchorEl(null);
                  setModerationDialog({
                    mode: "sanction",
                    availableSanctionTypes: [
                      AccountSanctionType.SUSPENSION,
                      AccountSanctionType.BAN,
                    ],
                    target: {
                      userId: teacherDetail.userId || teacherId,
                      fullName: teacherDetail.fullName,
                      email: teacherDetail.contactEmail,
                      phoneNumber:
                        teacherDetail.contactPhoneNumber || teacherDetail.phone,
                      avatarUrl: teacherDetail.avatarUrl,
                    },
                  });
                }}
              >
                <ListItemIcon>
                  <Ban className="h-4 w-4 text-rose-600" />
                </ListItemIcon>
                <ListItemText>Chặn người dùng</ListItemText>
              </MenuItem>
              <MenuItem
                disabled={
                  teacherDetail.status !== "BANNED" &&
                  !isSuspensionActive(teacherDetail.suspension)
                }
                onClick={() => {
                  setAnchorEl(null);
                  setModerationDialog({
                    mode: "revoke",
                    target: {
                      userId: teacherDetail.userId || teacherId,
                      fullName: teacherDetail.fullName,
                      email: teacherDetail.contactEmail,
                      phoneNumber:
                        teacherDetail.contactPhoneNumber || teacherDetail.phone,
                      avatarUrl: teacherDetail.avatarUrl,
                    },
                  });
                }}
              >
                <ListItemIcon>
                  <UnlockKeyhole className="h-4 w-4 text-emerald-600" />
                </ListItemIcon>
                <ListItemText>Gỡ chặn</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Box>

      {/* Content */}
      {isLoadingTeacherDetail ? (
        <LoadingSkeleton />
      ) : isErrorFetchTeacherDetail || !teacherDetail ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight={300}
        >
          <Typography color="error" variant="body1">
            Không thể tải thông tin giáo viên.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {/* ===== Header Section (full width) ===== */}
          <TeacherHeader teacherDetail={teacherDetail} />
          <TeacherSuspensionBanner teacherDetail={teacherDetail} />

          {/* ===== Stats Row (full width) ===== */}
          <TeacherStats
            teacherDetail={teacherDetail}
            onViewAllReviews={() => setShowReviewPanel(true)}
          />

          {/* ===== Two Column Layout ===== */}
          <Box
            display="grid"
            gridTemplateColumns={{ xs: "1fr", lg: "1fr 340px" }}
            gap={3}
            alignItems="flex-start"
          >
            {/* Left Column: Main Content */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                minWidth: 0,
              }}
            >
              <TeacherBasicInfo teacherDetail={teacherDetail} />
              <TeacherTraining teacherDetail={teacherDetail} />
              <TeacherLocations teacherDetail={teacherDetail} />
              <TeacherTags teacherDetail={teacherDetail} />
              <TeacherGallery teacherDetail={teacherDetail} />
              <TeacherReviewsSummary
                teacherDetail={teacherDetail}
                onViewAllReviews={() => setShowReviewPanel(true)}
              />
            </Box>

            {/* Right Column: Sticky Action Panel */}
            <Box
              sx={{
                display: { xs: "none", lg: "block" },
              }}
            >
              <TeacherContactCard teacherDetail={teacherDetail} />
            </Box>
          </Box>

          {/* Mobile: Contact Card below content */}
          <Box sx={{ display: { xs: "block", lg: "none" } }}>
            <TeacherContactCard teacherDetail={teacherDetail} />
          </Box>
        </Box>
      )}

      {/* Review Slide Panel */}
      {teacherDetail && (
        <>
          {/* Overlay backdrop */}
          {showReviewPanel && (
            <Box
              onClick={() => setShowReviewPanel(false)}
              sx={{
                position: "fixed",
                inset: 0,
                bgcolor: "rgba(0,0,0,0.3)",
                zIndex: 1199,
                transition: "opacity 0.3s",
              }}
            />
          )}
          <TeacherReviewsPanel
            teacherId={teacherDetail.userId}
            open={showReviewPanel}
            onClose={() => setShowReviewPanel(false)}
          />
          <AccountModerationDialog
            state={moderationDialog}
            isSubmitting={isSanctioning || isRevokingSanction}
            onClose={() => setModerationDialog(null)}
            onSanction={handleSanctionAccount}
            onRevoke={handleRevokeSanction}
          />
        </>
      )}
    </Box>
  );
};

/** Loading skeleton matching the layout structure */
const LoadingSkeleton = () => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
    {/* Header skeleton */}
    <Box
      sx={{
        bgcolor: "white",
        borderRadius: 3,
        border: "1px solid",
        borderColor: "grey.200",
        overflow: "hidden",
      }}
    >
      <Skeleton variant="rectangular" height={200} animation="wave" />
      <Box
        sx={{
          px: 3,
          pb: 3,
          mt: -5,
          display: "flex",
          gap: 3,
          alignItems: "flex-end",
        }}
      >
        <Skeleton variant="circular" width={96} height={96} animation="wave" />
        <Box sx={{ flex: 1, pt: 5 }}>
          <Skeleton variant="text" width="40%" height={32} animation="wave" />
          <Skeleton variant="text" width="60%" height={20} animation="wave" />
        </Box>
      </Box>
    </Box>

    {/* Stats skeleton */}
    <Box
      display="grid"
      gridTemplateColumns={{ xs: "repeat(2, 1fr)", sm: "repeat(4, 1fr)" }}
      gap={2}
    >
      {[1, 2, 3, 4].map((i) => (
        <Skeleton
          key={i}
          variant="rounded"
          height={80}
          animation="wave"
          sx={{ borderRadius: 2.5 }}
        />
      ))}
    </Box>

    {/* Content skeleton */}
    <Box
      display="grid"
      gridTemplateColumns={{ xs: "1fr", lg: "1fr 340px" }}
      gap={3}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {[1, 2, 3].map((i) => (
          <Skeleton
            key={i}
            variant="rounded"
            height={160}
            animation="wave"
            sx={{ borderRadius: 3 }}
          />
        ))}
      </Box>
      <Skeleton
        variant="rounded"
        height={400}
        animation="wave"
        sx={{ borderRadius: 3, display: { xs: "none", lg: "block" } }}
      />
    </Box>
  </Box>
);

export default TeacherDetailContent;
