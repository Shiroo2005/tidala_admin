import { useGetTeacherReviews } from "@/features/teacher-detail/hooks/useGetTeacherReviews";
import type { ReviewResponse } from "@/shared/types/common.type";
import { getStorageUrl } from "@/shared/utils/url";
import {
  Avatar,
  Box,
  CircularProgress,
  IconButton,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { IoStar } from "react-icons/io5";
import { MdClose } from "react-icons/md";

interface Props {
  teacherId: string;
  open: boolean;
  onClose: () => void;
}

export const TeacherReviewsPanel = ({ teacherId, open, onClose }: Props) => {
  const [sort, setSort] = useState<string[]>(["-createdAt"]);
  const [size, setSize] = useState(20);

  const { reviewsData, isFetchingReviews } = useGetTeacherReviews(
    open ? teacherId : "",
    0,
    size,
    sort,
  );

  const reviews = reviewsData?.content || [];
  const totalElements = reviewsData?.totalElements ?? 0;

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        width: { xs: "100%", sm: 480 },
        bgcolor: "white",
        borderLeft: "1px solid",
        borderColor: "grey.200",
        boxShadow: open ? "-8px 0 30px rgba(0,0,0,0.1)" : "none",
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        zIndex: 1200,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}>
      {/* Panel Header */}
      <Box
        sx={{
          p: 2.5,
          borderBottom: "1px solid",
          borderColor: "grey.200",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}>
        <Box>
          <Typography variant="subtitle1" fontWeight="bold">
            Tất cả đánh giá
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {totalElements} đánh giá
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            bgcolor: "#f1f5f9",
            "&:hover": { bgcolor: "#e2e8f0" },
          }}>
          <MdClose size={20} />
        </IconButton>
      </Box>

      {/* Sort Controls */}
      <Box
        sx={{
          px: 2.5,
          py: 1.5,
          borderBottom: "1px solid",
          borderColor: "grey.100",
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          flexShrink: 0,
        }}>
        <Typography variant="caption" color="text.secondary" fontWeight={600}>
          Sắp xếp:
        </Typography>
        <Select
          value={sort[0]}
          onChange={(e) => setSort([e.target.value])}
          size="small"
          sx={{
            fontSize: 13,
            borderRadius: 1.5,
            "& .MuiSelect-select": { py: 0.5, px: 1.5 },
          }}>
          <MenuItem value="-createdAt">Mới nhất</MenuItem>
          <MenuItem value="createdAt">Cũ nhất</MenuItem>
          <MenuItem value="-rating">Đánh giá cao</MenuItem>
          <MenuItem value="rating">Đánh giá thấp</MenuItem>
        </Select>
      </Box>

      {/* Review List */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          px: 2.5,
          py: 2,
        }}>
        {isFetchingReviews ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            py={6}>
            <CircularProgress size={28} />
          </Box>
        ) : reviews.length === 0 ? (
          <Box textAlign="center" py={6}>
            <Typography variant="h4" sx={{ mb: 1 }}>
              📝
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Chưa có đánh giá nào
            </Typography>
          </Box>
        ) : (
          <Box display="flex" flexDirection="column" gap={2}>
            {reviews.map((review: ReviewResponse) => (
              <ReviewItem key={review.id} review={review} />
            ))}
            {totalElements > size && (
              <Box textAlign="center" py={1}>
                <Typography
                  variant="body2"
                  color="primary"
                  fontWeight={600}
                  sx={{
                    cursor: "pointer",
                    "&:hover": { textDecoration: "underline" },
                  }}
                  onClick={() => setSize((s) => s + 20)}>
                  Tải thêm đánh giá...
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

const ReviewItem = ({ review }: { review: ReviewResponse }) => (
  <Box
    sx={{
      p: 2,
      bgcolor: "#f8fafc",
      border: "1px solid",
      borderColor: "grey.200",
      borderRadius: 2,
    }}>
    <Box display="flex" gap={1.5} alignItems="flex-start">
      <Avatar
        src={getStorageUrl(review.studentAvatarUrl)}
        alt={review.studentFullName}
        sx={{ width: 36, height: 36, fontSize: 14 }}>
        {review.studentFullName?.[0]}
      </Avatar>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          gap={1}>
          <Typography variant="body2" fontWeight={600} noWrap>
            {review.studentFullName}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ flexShrink: 0 }}>
            {new Date(review.createdAt).toLocaleDateString("vi-VN")}
          </Typography>
        </Box>
        <Box display="flex" gap={0.3} my={0.5}>
          {Array.from({ length: 5 }).map((_, i) => (
            <IoStar
              key={i}
              size={12}
              color={i < review.rating ? "#FBBF24" : "#e2e8f0"}
            />
          ))}
        </Box>
        {review.content && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 0.5,
              lineHeight: 1.6,
              whiteSpace: "pre-line",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}>
            {review.content}
          </Typography>
        )}
      </Box>
    </Box>
  </Box>
);
