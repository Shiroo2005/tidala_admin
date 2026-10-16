import type { TeacherDetail } from "@/shared/types/common.type";
import {
  formatSuspensionDateTime,
  getSuspensionDurationDays,
  getSuspensionReason,
  isSuspensionActive,
} from "@/features/admin/teacher-management-v2/utils/suspension";
import { Box, Typography } from "@mui/material";
import { ArrowRight, Ban } from "lucide-react";

interface Props {
  teacherDetail: TeacherDetail;
}

export const TeacherSuspensionBanner = ({ teacherDetail }: Props) => {
  if (teacherDetail.status?.toUpperCase() === "BANNED") return null;

  const suspension = teacherDetail.suspension;
  if (!suspension) return null;

  const isActive = isSuspensionActive(suspension);
  const durationDays = getSuspensionDurationDays(suspension);
  const title = isActive
    ? durationDays
      ? `Bị chặn ${durationDays} ngày`
      : "Bị chặn"
    : "Lệnh chặn đã hết hạn";
  const reason = getSuspensionReason(suspension);

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        alignItems: "flex-start",
        bgcolor: isActive ? "#fff1f2" : "#f8fafc",
        border: "1px solid",
        borderColor: isActive ? "#fecdd3" : "#e2e8f0",
        borderRadius: 2.5,
        px: 2.5,
        py: 2,
      }}
    >
      <Box
        sx={{
          width: 38,
          height: 38,
          borderRadius: "50%",
          bgcolor: isActive ? "#ffe4e6" : "#e2e8f0",
          color: isActive ? "#e11d48" : "#64748b",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Ban size={21} />
      </Box>

      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography
          variant="subtitle2"
          fontWeight={800}
          color={isActive ? "#be123c" : "#475569"}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{ mt: 0.5, color: isActive ? "#9f1239" : "#64748b" }}
        >
          Lý do: {reason}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 0.9,
            mt: 1.25,
          }}
        >
          <DateChip value={formatSuspensionDateTime(suspension.startAt)} />
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: isActive ? "#e11d48" : "#64748b",
            }}
          >
            <ArrowRight size={16} />
          </Box>
          <DateChip value={formatSuspensionDateTime(suspension.endAt)} />
        </Box>
      </Box>
    </Box>
  );
};

const DateChip = ({ value }: { value: string }) => (
  <Box
    sx={{
      display: "inline-flex",
      alignItems: "center",
      borderRadius: 999,
      bgcolor: "rgba(255,255,255,0.72)",
      border: "1px solid rgba(148,163,184,0.35)",
      px: 1.25,
      py: 0.5,
    }}
  >
    <Typography variant="caption" fontWeight={700} color="text.primary">
      {value}
    </Typography>
  </Box>
);
