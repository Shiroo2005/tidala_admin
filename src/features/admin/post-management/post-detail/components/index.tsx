import { AdminBreadcrumbs } from "@/shared/ui/navigation/AdminBreadcrumbs";
import { Box, Button, Skeleton, Typography } from "@mui/material";
import { useState } from "react";
import { MdArrowBack, MdDelete } from "react-icons/md";
import { Pin, PinOff } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { APP_PATHS } from "@/shared/constants/appPaths";
import { DeletePostDialog } from "../../post-list/components/deletePostDialog";
import { useGetAdminPostDetail } from "../hooks/useGetAdminPostDetail";
import { usePinAdminPost } from "../../post-list/hooks/usePinAdminPost";
import { OwnerCard } from "./ownerCard";
import { PostContent } from "./postContent";
// import { PostStats } from "./postStats";

export const PostDetailContent = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isPinning, setIsPinning] = useState(false);

  const { post, isLoadingPost, isErrorPost } = useGetAdminPostDetail(
    postId || "",
  );
  const { pinMutation, unpinMutation } = usePinAdminPost();

  const isPinned = !!post?.pinnedAt;

  const handlePinToggle = () => {
    if (!post) return;
    setIsPinning(true);
    const mutation = isPinned ? unpinMutation : pinMutation;
    mutation.mutate(post.id, {
      onSuccess: () => {
        // Update the detail cache directly — no refetch
        queryClient.setQueryData(
          ["adminPostDetail", post.id],
          (old: typeof post) =>
            old
              ? { ...old, pinnedAt: isPinned ? null : new Date().toISOString() }
              : old,
        );
      },
      onSettled: () => setIsPinning(false),
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (!postId) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={300}
      >
        <Typography color="text.secondary" variant="body1">
          Không tìm thấy bài đăng.
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
              Chi tiết bài đăng
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Xem nội dung và thông tin chi tiết bài đăng
            </Typography>
          </Box>
        </Box>

        {/* Action Buttons */}
        {post && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {/* Pin / Unpin button */}
            <button
              type="button"
              disabled={isPinning}
              onClick={handlePinToggle}
              title={isPinned ? "Bỏ ghim bài viết" : "Ghim bài viết"}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold border transition-all duration-200 outline-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-sm
                ${
                  isPinned
                    ? "bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-800"
                }
              `}
            >
              {isPinning ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : isPinned ? (
                <PinOff size={15} />
              ) : (
                <Pin size={15} />
              )}
              {isPinned ? "Bỏ ghim" : "Ghim"}
            </button>

            <Button
              variant="contained"
              size="small"
              startIcon={<MdDelete size={16} />}
              onClick={() => setDeleteDialogOpen(true)}
              sx={{
                bgcolor: "white",
                color: "#dc2626",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: 2,
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                "&:hover": {
                  bgcolor: "#fef2f2",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
                },
              }}
            >
              Xóa
            </Button>
          </Box>
        )}
      </Box>

      {/* Content */}
      {isLoadingPost ? (
        <LoadingSkeleton />
      ) : isErrorPost || !post ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight={300}
        >
          <Typography color="error" variant="body1">
            Không thể tải thông tin bài đăng.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
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
              <PostContent post={post} />
            </Box>

            {/* Right Column: Owner Card & Stats (Desktop) */}
            <Box
              sx={{
                display: { xs: "none", lg: "flex" },
                flexDirection: "column",
                gap: 3,
                position: { lg: "sticky" },
                top: { lg: 24 },
              }}
            >
              <OwnerCard owner={post.owner} />
              {/* <PostStats post={post} /> */}
            </Box>
          </Box>

          {/* Mobile: Owner Card & Stats below content */}
          <Box
            sx={{
              display: { xs: "flex", lg: "none" },
              flexDirection: "column",
              gap: 3,
            }}
          >
            <OwnerCard owner={post.owner} />
            {/* <PostStats post={post} /> */}
          </Box>
        </Box>
      )}

      {/* Delete Dialog */}
      <DeletePostDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        post={post || null}
        onSuccessCallback={() => navigate(APP_PATHS.ADMIN_POSTS)}
      />
    </Box>
  );
};

/** Loading skeleton matching the layout structure */
const LoadingSkeleton = () => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
    {/* ===== Two Column Layout ===== */}
    <Box
      display="grid"
      gridTemplateColumns={{ xs: "1fr", lg: "1fr 340px" }}
      gap={3}
    >
      {/* Left Column: Main Content */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Skeleton
          variant="rounded"
          height={300}
          animation="wave"
          sx={{ borderRadius: 3 }}
        />
        <Skeleton
          variant="rounded"
          height={200}
          animation="wave"
          sx={{ borderRadius: 3 }}
        />
      </Box>

      {/* Right Column: Owner Card & Stats (Desktop) */}
      <Box
        sx={{
          display: { xs: "none", lg: "flex" },
          flexDirection: "column",
          gap: 3,
        }}
      >
        <Skeleton
          variant="rounded"
          height={320}
          animation="wave"
          sx={{ borderRadius: 3 }}
        />
        {/* <Skeleton
          variant="rounded"
          height={220}
          animation="wave"
          sx={{ borderRadius: 3 }}
        /> */}
      </Box>
    </Box>

    {/* Mobile: Skeletons below content */}
    <Box
      sx={{
        display: { xs: "flex", lg: "none" },
        flexDirection: "column",
        gap: 3,
      }}
    >
      <Skeleton
        variant="rounded"
        height={320}
        animation="wave"
        sx={{ borderRadius: 3 }}
      />
      {/* <Skeleton
        variant="rounded"
        height={220}
        animation="wave"
        sx={{ borderRadius: 3 }}
      /> */}
    </Box>
  </Box>
);

export default PostDetailContent;
