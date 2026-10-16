import type { TeacherDetail } from "@/shared/types/common.type";
import { Box, Typography } from "@mui/material";
import {
  MdOutlineCalendarMonth,
  MdOutlineRemoveRedEye,
  MdOutlineStar,
  MdFavorite,
} from "react-icons/md";

interface Props {
  teacherDetail: TeacherDetail;
  onViewAllReviews: () => void;
}

export const TeacherStats = ({ teacherDetail, onViewAllReviews }: Props) => {
  const totalViews = (teacherDetail as unknown as { totalViews?: number }).totalViews;
  const totalLikes = teacherDetail.totalLikes;
  const hasReviews = Boolean(teacherDetail.reviewSummary && teacherDetail.reviewSummary.totalReviews > 0);

  const stats = [
    {
      label: "Lượt xem",
      value: totalViews ? totalViews.toLocaleString("vi-VN") : "Chưa có",
      icon: <MdOutlineRemoveRedEye size={20} />,
      color: "#eff6ff",
      borderColor: "#bfdbfe",
      iconColor: "#3b82f6",
    },
    {
      label: "Lượt thích",
      value: totalLikes ? totalLikes.toLocaleString("vi-VN") : "Chưa có",
      icon: <MdFavorite size={20} />,
      color: "#fef2f2",
      borderColor: "#fecaca",
      iconColor: "#ef4444",
    },
    {
      label: "Đánh giá",
      value: hasReviews ? (
        <Box display="flex" alignItems="baseline" gap={0.5}>
          <Typography
            variant="body1"
            fontWeight="bold"
            color="text.primary"
            sx={{ lineHeight: 1.3 }}
          >
            {`${teacherDetail.reviewSummary!.averageRating.toFixed(1)} ⭐`}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontSize: 11, fontWeight: "normal" }}
          >
            ({teacherDetail.reviewSummary!.totalReviews} đánh giá)
          </Typography>
        </Box>
      ) : (
        <Typography
          variant="body1"
          fontWeight="bold"
          color="text.primary"
          sx={{ lineHeight: 1.3 }}
        >
          Chưa có
        </Typography>
      ),
      icon: <MdOutlineStar size={20} />,
      color: "#fefce8",
      borderColor: "#fef08a",
      iconColor: "#eab308",
      clickable: hasReviews,
      onClick: hasReviews ? onViewAllReviews : undefined,
    },
    {
      label: "Ngày tham gia",
      value: teacherDetail.createdAt
        ? new Date(teacherDetail.createdAt).toLocaleDateString("vi-VN")
        : "Chưa có",
      icon: <MdOutlineCalendarMonth size={20} />,
      color: "#faf5ff",
      borderColor: "#e9d5ff",
      iconColor: "#a855f7",
    },
  ];

  return (
    <Box
      display="grid"
      gridTemplateColumns={{
        xs: "repeat(2, 1fr)",
        sm: "repeat(4, 1fr)",
      }}
      gap={2}
    >
      {stats.map((stat) => (
        <Box
          key={stat.label}
          onClick={stat.onClick}
          sx={{
            bgcolor: stat.color,
            border: "1px solid",
            borderColor: stat.borderColor,
            borderRadius: 2.5,
            p: 2,
            display: "flex",
            alignItems: "flex-start",
            gap: 1.5,
            transition: "transform 0.15s, box-shadow 0.15s",
            cursor: stat.clickable ? "pointer" : "default",
            "&:hover": stat.clickable
              ? {
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                }
              : {},
          }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              bgcolor: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: stat.iconColor,
              flexShrink: 0,
            }}
          >
            {stat.icon}
          </Box>
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              fontWeight={600}
              textTransform="uppercase"
              letterSpacing={0.5}
              sx={{ fontSize: 11 }}
            >
              {stat.label}
            </Typography>
            {typeof stat.value === "string" ? (
              <Typography
                variant="body1"
                fontWeight="bold"
                color="text.primary"
                sx={{ lineHeight: 1.3 }}
              >
                {stat.value}
              </Typography>
            ) : (
              stat.value
            )}
          </Box>
        </Box>
      ))}
    </Box>
  );
};
