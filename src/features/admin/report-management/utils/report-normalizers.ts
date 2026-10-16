import type {
  CommentTarget,
  PostTarget,
  ReportData,
  ReporterResponse,
  ReportTarget,
  ReviewTarget,
} from "../types/report.type";

export type AdminReportApiResponse = Omit<Partial<ReportData>, "target"> & {
  reporter?: ReporterResponse;
  target?: ReportTarget | null;
};

export const normalizeReportTarget = (
  target?: ReportTarget | null,
): ReportTarget | null => {
  if (!target) return null;

  if (target.type === "REVIEW") {
    const reviewTarget = target as ReviewTarget;

    return {
      ...reviewTarget,
      authorName: reviewTarget.authorName || reviewTarget.author?.fullName,
      teacherName: reviewTarget.teacherName || reviewTarget.teacher?.fullName,
    };
  }

  if (target.type === "POST") {
    const postTarget = target as PostTarget;

    return {
      ...postTarget,
      authorName: postTarget.authorName || postTarget.author?.fullName,
    };
  }

  if (target.type === "COMMENT") {
    const commentTarget = target as CommentTarget;

    return {
      ...commentTarget,
      authorName: commentTarget.authorName || commentTarget.author?.fullName,
    };
  }

  return target;
};

export const normalizeAdminReport = (
  report: AdminReportApiResponse,
): ReportData => {
  const reporter = report.reporter;
  const target = normalizeReportTarget(report.target);

  return {
    ...report,
    reporterUserId: report.reporterUserId || reporter?.id || "",
    reporterName: report.reporterName || reporter?.fullName || "",
    reporterEmail: report.reporterEmail || reporter?.email || "",
    reporterAvatarUrl: report.reporterAvatarUrl || reporter?.avatarUrl || "",
    targetId: report.targetId || target?.id,
    target,
    description: report.description || null,
    resolvedAt: report.resolvedAt || null,
  } as ReportData;
};
