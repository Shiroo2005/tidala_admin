import { FiFileText, FiList } from "react-icons/fi";
import type { DetailTabConfig } from "./types";
export const DETAIL_TABS: DetailTabConfig[] = [
  {
    key: "overview",
    label: "Tổng quan",
    icon: <FiFileText size={14} />,
  },
  {
    key: "reports",
    label: "Báo cáo người dùng",
    icon: <FiList size={14} />,
  },
];

