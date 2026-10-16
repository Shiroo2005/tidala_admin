import type { TeacherDetail } from "@/shared/types/common.type";
import { Box, Button, Chip, Divider, Typography } from "@mui/material";
import {
  MdCall,
  MdEmail,
  MdLocationOn,
  MdPeople,
  MdSchool,
  MdWork,
} from "react-icons/md";
import { SiZalo } from "react-icons/si";
import { formatExperience, formatStudentsTrained } from "./utils";

interface Props {
  teacherDetail: TeacherDetail;
}

export const TeacherContactCard = ({ teacherDetail }: Props) => {
  const phone = teacherDetail.contactPhoneNumber;
  const zalo = teacherDetail.zalo;
  const email = teacherDetail.contactEmail;

  // Build a Google Maps link from driving centers or province
  const mapQuery = teacherDetail.drivingCenters?.[0]
    ? teacherDetail.drivingCenters[0].address
    : teacherDetail.province?.name || "";

  return (
    <Box
      sx={{
        position: "sticky",
        top: 80,
      }}
    >
      <Box
        sx={{
          bgcolor: "white",
          borderRadius: 3,
          border: "1px solid",
          borderColor: "grey.200",
          overflow: "hidden",
        }}
      >
        {/* Contact Buttons */}
        <Box
          sx={{ p: 2.5, display: "flex", flexDirection: "column", gap: 1.5 }}
        >
          <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 0.5 }}>
            Liên hệ nhanh
          </Typography>

          <Button
            variant="contained"
            fullWidth
            size="large"
            startIcon={<MdCall size={20} />}
            href={phone ? `tel:${phone}` : undefined}
            disabled={!phone}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              py: 1.3,
              fontSize: 14,
            }}
          >
            {phone || "Chưa có SĐT"}
          </Button>

          <Button
            variant="contained"
            fullWidth
            size="large"
            startIcon={<SiZalo size={20} />}
            {...(zalo && {
              href: `https://zalo.me/${zalo}`,
              target: "_blank",
            })}
            disabled={!zalo}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              py: 1.3,
              fontSize: 14,
              bgcolor: "#0068FF",
              "&:hover": { bgcolor: "#0055d4" },
            }}
          >
            Nhắn Zalo
          </Button>

          <Button
            variant="outlined"
            fullWidth
            size="large"
            startIcon={<MdEmail size={20} />}
            href={email ? `mailto:${email}` : undefined}
            disabled={!email}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              py: 1.3,
              fontSize: 14,
            }}
          >
            {email || "Chưa có email"}
          </Button>

          <Button
            variant="outlined"
            fullWidth
            size="large"
            startIcon={<MdLocationOn size={20} />}
            {...(mapQuery && {
              href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`,
              target: "_blank",
            })}
            disabled={!mapQuery}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              py: 1.3,
              fontSize: 14,
            }}
          >
            Mở Google Maps
          </Button>
        </Box>

        <Divider />

        {/* Quick Info */}
        <Box sx={{ p: 2.5, display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 0.5 }}>
            Thông tin nhanh
          </Typography>

          <InfoRow
            icon={<MdWork size={18} />}
            label="Kinh nghiệm"
            value={formatExperience(teacherDetail.experienceYears)}
          />
          <InfoRow
            icon={<MdSchool size={18} />}
            label="Học viên đã dạy"
            value={formatStudentsTrained(teacherDetail.studentsTrained)}
          />
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box display="flex" alignItems="center" gap={1}>
              <MdPeople size={18} className="text-slate-400" />
              <Typography variant="body2" color="text.secondary">
                Đang nhận học viên
              </Typography>
            </Box>
            <Chip
              label={teacherDetail.hasCurrentStudents ? "Có" : "Không"}
              size="small"
              color={teacherDetail.hasCurrentStudents ? "success" : "default"}
              sx={{ fontWeight: 600, borderRadius: 1.5 }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <Box display="flex" alignItems="center" justifyContent="space-between">
    <Box display="flex" alignItems="center" gap={1}>
      <Box sx={{ color: "text.disabled" }}>{icon}</Box>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Box>
    <Typography variant="body2" fontWeight={600} color="text.primary">
      {value}
    </Typography>
  </Box>
);
