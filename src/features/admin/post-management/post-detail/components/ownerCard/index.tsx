import { imageUrls } from "@/shared/constants/imageUrls";
import type { User } from "@/features/account/types/type";
import { getStorageUrl } from "@/shared/utils/url";
import { Avatar, Box, Chip, Typography } from "@mui/material";
import { MdEmail, MdPerson, MdPhone } from "react-icons/md";
import { TeacherExtraInfo } from "../teacherExtraInfo";

interface OwnerCardProps {
  owner: User;
}

const ROLE_CONFIG: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  STUDENT: {
    label: "Học sinh",
    color: "#137fec",
    bg: "rgba(19, 127, 236, 0.08)",
  },
  TEACHER: {
    label: "Giáo viên",
    color: "#137fec",
    bg: "rgba(19, 127, 236, 0.08)",
  },
  ADMIN: {
    label: "Quản trị viên",
    color: "#dc2626",
    bg: "rgba(220, 38, 38, 0.1)",
  },
};

export const OwnerCard = ({ owner }: OwnerCardProps) => {
  const roleConfig = ROLE_CONFIG[owner.role] || ROLE_CONFIG.STUDENT;
  const avatarSrc = owner.avatarUrl
    ? getStorageUrl(owner.avatarUrl)
    : imageUrls.fallback.avatar;

  return (
    <Box
      sx={{
        bgcolor: "white",
        borderRadius: 3,
        border: "1px solid",
        borderColor: "grey.200",
        overflow: "hidden",
      }}
    >
      {/* Avatar + name header */}
      <Box
        sx={{
          p: 3,
          pb: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Avatar
          src={avatarSrc}
          alt={owner.fullName}
          sx={{
            width: 72,
            height: 72,
            mb: 1.5,
            border: "3px solid",
            borderColor: `${roleConfig.color}30`,
            boxShadow: `0 4px 14px ${roleConfig.color}15`,
          }}
        />
        <Typography
          variant="subtitle1"
          fontWeight={700}
          color="text.primary"
          sx={{ mb: 0.5 }}
        >
          {owner.fullName}
        </Typography>
        <Chip
          label={roleConfig.label}
          size="small"
          sx={{
            fontWeight: 700,
            fontSize: "0.68rem",
            letterSpacing: "0.03em",
            bgcolor: roleConfig.bg,
            color: roleConfig.color,
            borderRadius: 2,
            height: 24,
          }}
        />
      </Box>

      {/* Contact info */}
      <Box sx={{ px: 3, pb: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {owner.email && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                p: 1.5,
                bgcolor: "grey.50",
                borderRadius: 2,
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 1.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "white",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                }}
              >
                <MdEmail size={15} className="text-slate-400" />
              </Box>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", fontSize: "0.65rem" }}
                >
                  Email
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={500}
                  sx={{
                    fontSize: "0.8rem",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {owner.email}
                </Typography>
              </Box>
            </Box>
          )}

          {owner.phoneNumber && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                p: 1.5,
                bgcolor: "grey.50",
                borderRadius: 2,
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 1.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "white",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                }}
              >
                <MdPhone size={15} className="text-slate-400" />
              </Box>
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", fontSize: "0.65rem" }}
                >
                  Số điện thoại
                </Typography>
                <Typography variant="body2" fontWeight={500} fontSize="0.8rem">
                  {owner.phoneNumber}
                </Typography>
              </Box>
            </Box>
          )}

          {!owner.email && !owner.phoneNumber && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                p: 2,
                bgcolor: "grey.50",
                borderRadius: 2,
                justifyContent: "center",
              }}
            >
              <MdPerson size={16} className="text-slate-300" />
              <Typography
                variant="body2"
                color="text.disabled"
                fontSize="0.8rem"
              >
                Chưa cập nhật thông tin
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Teacher extra info */}
      {owner.role === "TEACHER" && owner.teacherProfile && (
        <Box sx={{ px: 3, pb: 3 }}>
          <TeacherExtraInfo profile={owner.teacherProfile} />
        </Box>
      )}
    </Box>
  );
};
