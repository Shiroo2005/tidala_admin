import type { TeacherDetail } from "@/shared/types/common.type";
import { useReviewSummary } from "@/features/teacher-detail/hooks/useReviewSummary";
import {
  Box,
  Button,
  Chip,
  LinearProgress,
  Typography,
} from "@mui/material";
import { IoStar } from "react-icons/io5";
import { MdArrowForward, MdWarning } from "react-icons/md";

interface Props {
  teacherDetail: TeacherDetail;
  onViewAllReviews: () => void;
}

export const TeacherReviewsSummary = ({
  teacherDetail,
  onViewAllReviews,
}: Props) => {
  const { summary } = useReviewSummary(teacherDetail.userId || "");

  const totalReviews =
    summary?.totalReviews ?? teacherDetail.reviewSummary?.totalReviews ?? 0;
  const averageRating =
    totalReviews > 0
      ? (summary?.averageRating ??
        teacherDetail.reviewSummary?.averageRating ??
        5.0)
      : 0;

  const stars = summary?.stars || teacherDetail.reviewSummary?.stars || [];
  // Sort stars descending (5 → 1)
  const sortedStars = [...stars].sort((a, b) => b.star - a.star);

  const oneStarCount = stars.find((s) => s.star === 1)?.count ?? 0;

  const getPercent = (count: number) =>
    totalReviews === 0 ? 0 : Math.round((count / totalReviews) * 100);

  return (
    <Box
      sx={{
        bgcolor: "white",
        borderRadius: 3,
        border: "1px solid",
        borderColor: "grey.200",
        p: 3,
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          Đánh giá
        </Typography>
        {oneStarCount > 0 && (
          <Chip
            icon={<MdWarning size={14} />}
            label={`${oneStarCount} đánh giá tiêu cực`}
            size="small"
            sx={{
              fontWeight: 600,
              fontSize: 11,
              bgcolor: "#fef2f2",
              color: "#dc2626",
              border: "1px solid #fecaca",
              borderRadius: 1.5,
              "& .MuiChip-icon": { color: "#dc2626" },
            }}
          />
        )}
      </Box>

      {totalReviews > 0 ? (
        <Box
          display="flex"
          gap={4}
          alignItems="center"
          flexWrap={{ xs: "wrap", sm: "nowrap" }}
        >
          {/* Left: Big Rating */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minWidth: 100,
              flexShrink: 0,
            }}
          >
            <Typography
              variant="h3"
              fontWeight="bold"
              color="text.primary"
              sx={{ lineHeight: 1 }}
            >
              {averageRating.toFixed(1)}
            </Typography>
            <Box display="flex" gap={0.3} my={0.5}>
              {Array.from({ length: 5 }).map((_, i) => (
                <IoStar
                  key={i}
                  size={16}
                  color={i < Math.round(averageRating) ? "#FBBF24" : "#e2e8f0"}
                />
              ))}
            </Box>
            <Typography variant="caption" color="text.secondary">
              {totalReviews} đánh giá
            </Typography>
          </Box>

          {/* Right: Star Distribution */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {sortedStars.map((star) => {
              const percent = getPercent(star.count);
              return (
                <Box
                  key={star.star}
                  display="flex"
                  alignItems="center"
                  gap={1}
                  mb={0.5}
                >
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    color="text.secondary"
                    sx={{ width: 12, textAlign: "center", flexShrink: 0 }}
                  >
                    {star.star}
                  </Typography>
                  <IoStar size={12} color="#FBBF24" />
                  <Box sx={{ flex: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={percent}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: "#f1f5f9",
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 4,
                          bgcolor:
                            star.star >= 4
                              ? "#22c55e"
                              : star.star === 3
                                ? "#eab308"
                                : star.star === 2
                                  ? "#f97316"
                                  : "#ef4444",
                        },
                      }}
                    />
                  </Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ width: 28, textAlign: "right", flexShrink: 0 }}
                  >
                    {star.count}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            textAlign: "center",
            py: 3,
          }}
        >
          <Typography variant="h4" sx={{ mb: 1 }}>
            ⭐
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Chưa có đánh giá nào
          </Typography>
        </Box>
      )}

      {totalReviews > 0 && (
        <Button
          fullWidth
          variant="outlined"
          onClick={onViewAllReviews}
          endIcon={<MdArrowForward />}
          sx={{
            mt: 2.5,
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 2,
            py: 1,
          }}
        >
          Xem tất cả {totalReviews} đánh giá
        </Button>
      )}
    </Box>
  );
};
