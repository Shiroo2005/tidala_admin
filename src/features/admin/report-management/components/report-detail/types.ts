import type { ReactNode } from "react";
import type {
  BanDuration,
  ReportData,
} from "../../types/report.type";

export interface ReportDetailModalProps {
  report: ReportData | null;
  open: boolean;
  onClose: () => void;
  onIgnore: (report: ReportData) => void;
  onWarn: (report: ReportData) => void;
  onBan: (report: ReportData, suggestedDuration?: BanDuration | null) => void;
  onHide: (report: ReportData) => void;
}

export type TargetType = ReportData["targetType"];
export type ActionVariant = "neutral" | "primary" | "warning" | "danger" | "ghost";
export type ReportReturnTab = "teacher" | "review" | "post";
export type DetailTab = "overview" | "reports";

export interface ReportDetailReturnState {
  reportDetailReturn?: {
    report: ReportData;
    tab: ReportReturnTab;
  };
}

export interface DetailTabConfig {
  key: DetailTab;
  label: string;
  icon: ReactNode;
}
