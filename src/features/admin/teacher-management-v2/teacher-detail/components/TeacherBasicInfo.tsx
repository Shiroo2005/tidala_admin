import type { TeacherDetail } from "@/shared/types/common.type";
import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";
import { MdExpandLess, MdExpandMore } from "react-icons/md";

interface Props {
  teacherDetail: TeacherDetail;
}

export const TeacherBasicInfo = ({ teacherDetail }: Props) => {
  const [expanded, setExpanded] = useState(false);
  const content =
    teacherDetail.bio || teacherDetail.description || "";

  if (!content) {
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
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
        >
          Giới thiệu
        </Typography>
        <Typography variant="body2" color="text.secondary" fontStyle="italic">
          Chưa có thông tin giới thiệu.
        </Typography>
      </Box>
    );
  }

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
      <Typography
        variant="h6"
        fontWeight="bold"
        sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
      >
        Giới thiệu
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          whiteSpace: "pre-line",
          lineHeight: 1.8,
          ...(!expanded && {
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }),
        }}
      >
        {content}
      </Typography>
      {content.length > 200 && (
        <Button
          size="small"
          onClick={() => setExpanded(!expanded)}
          startIcon={expanded ? <MdExpandLess /> : <MdExpandMore />}
          sx={{
            mt: 1,
            textTransform: "none",
            fontWeight: 600,
            fontSize: 13,
          }}
        >
          {expanded ? "Thu gọn" : "Xem thêm"}
        </Button>
      )}
    </Box>
  );
};
