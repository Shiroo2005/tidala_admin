import type { TeacherDetail } from "@/shared/types/common.type";
import { Box, Chip, Typography } from "@mui/material";

interface Props {
  teacherDetail: TeacherDetail;
}

export const TeacherTags = ({ teacherDetail }: Props) => {
  const tags = teacherDetail.tags || [];
  const specialtyTags = tags.filter((t) => t.type === "specialty");
  const styleTags = tags.filter((t) => t.type === "style");

  if (tags.length === 0) {
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
          Chuyên môn & Phong cách
        </Typography>
        <Typography variant="body2" color="text.secondary" fontStyle="italic">
          Chưa có thẻ nào.
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
        Chuyên môn & Phong cách
      </Typography>

      {specialtyTags.length > 0 && (
        <Box sx={{ mb: styleTags.length > 0 ? 2 : 0 }}>
          <Typography
            variant="caption"
            fontWeight={600}
            color="text.secondary"
            textTransform="uppercase"
            letterSpacing={0.5}
            sx={{ mb: 1, display: "block", fontSize: 11 }}
          >
            Chuyên môn
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {specialtyTags.map((tag) => (
              <Chip
                key={tag.id}
                label={tag.name}
                size="small"
                sx={{
                  borderRadius: "6px",
                  fontWeight: "bold",
                  bgcolor: "#dcfce7",
                  color: "#16a34a",
                  border: "1px solid #bbf7d0",
                }}
              />
            ))}
          </Box>
        </Box>
      )}

      {styleTags.length > 0 && (
        <Box>
          <Typography
            variant="caption"
            fontWeight={600}
            color="text.secondary"
            textTransform="uppercase"
            letterSpacing={0.5}
            sx={{ mb: 1, display: "block", fontSize: 11 }}
          >
            Phong cách dạy
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {styleTags.map((tag) => (
              <Chip
                key={tag.id}
                label={tag.name}
                size="small"
                sx={{
                  borderRadius: "6px",
                  fontWeight: "bold",
                  bgcolor: "#cffafe",
                  color: "#0891b2",
                  border: "1px solid #a5f3fc",
                }}
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};
