import type {
  BanDuration,
  CommentTarget,
  PostTarget,
  ReportData,
  ReviewTarget,
  TeacherTarget,
} from "../types/report.type";

export interface ReportedUserInfo {
  id?: string;
  name?: string | null;
}

export interface ModerationSuggestion {
  step: number;
  action: "warning" | "suspend" | "ban";
  duration?: BanDuration;
  label: string;
  description: string;
}

export const getReportedUserInfo = (
  report?: ReportData | null,
): ReportedUserInfo | null => {
  if (!report?.target) return null;

  if (report.targetType === "TEACHER") {
    const target = report.target as TeacherTarget;

    return {
      id: target.id,
      name: target.fullName,
    };
  }

  if (report.targetType === "REVIEW") {
    const target = report.target as ReviewTarget;

    return {
      id: target.author?.id,
      name: target.authorName || target.author?.fullName,
    };
  }

  if (report.targetType === "COMMENT") {
    const target = report.target as CommentTarget;

    return {
      id: target.author?.id,
      name: target.authorName || target.author?.fullName,
    };
  }

  const target = report.target as PostTarget;

  return {
    id: target.author?.id,
    name: target.authorName || target.author?.fullName,
  };
};

export const sortReportsByLatestActivity = (reports: ReportData[]) => {
  return [...reports].sort((left, right) => {
    const leftTime = new Date(
      left.resolvedAt || left.updatedAt || left.createdAt,
    ).getTime();
    const rightTime = new Date(
      right.resolvedAt || right.updatedAt || right.createdAt,
    ).getTime();

    return rightTime - leftTime;
  });
};

export const getModerationSuggestion = (
  previousReports: ReportData[],
): ModerationSuggestion => {
  const processedCount = previousReports.filter(
    (report) => report.status === "RESOLVED",
  ).length;
  const step = processedCount + 1;

  if (step <= 1) {
    return {
      step,
      action: "warning",
      label: "Cảnh báo",
      description: "Lần đầu có báo cáo đã xử lý, ưu tiên nhắc nhở người dùng.",
    };
  }

  if (step === 2) {
    return {
      step,
      action: "suspend",
      duration: "1",
      label: "Tạm khóa 1 ngày",
      description: "Đã có 1 báo cáo được xử lý trước đó.",
    };
  }

  if (step === 3) {
    return {
      step,
      action: "suspend",
      duration: "3",
      label: "Tạm khóa 3 ngày",
      description: "Đã có 2 báo cáo được xử lý trước đó.",
    };
  }

  if (step === 4) {
    return {
      step,
      action: "suspend",
      duration: "7",
      label: "Tạm khóa 7 ngày",
      description: "Đã có 3 báo cáo được xử lý trước đó.",
    };
  }

  return {
    step,
    action: "ban",
    duration: "permanent",
    label: "Khóa vĩnh viễn",
    description: "Đã có từ 4 báo cáo được xử lý trước đó.",
  };
};
