import { paginate } from "@/demo/store";
import type { components } from "@/generated/api";
import type { ReportDetailData, ReportTarget, ResolveReportRequest } from "@/features/admin/report-management/types/report.type";
import { realRequest } from "../realApi";
import { fetchAll, media, unsupported, type Params, type Route } from "./shared";
import { allAdminUsers } from "./students";
import { allTeachers } from "./teachers";

type Report = components["schemas"]["ReportResponse"];
type ReportDetail = components["schemas"]["ReportDetailResponse"];
type ReportAction = components["schemas"]["ReportActionResponse"];
type ApplyAction = components["schemas"]["ApplyReportActionCommand"];
type History = ReportDetailData["history"][number];
type ReviewDetail = components["schemas"]["ReviewDetailResponse"];
type AdminUser = { fullName?: string; email?: string | null; phoneNumber?: string | null };

// The backend has five reason codes; the screens have their own per-type lists. Closest match per type.
const REASON: Record<string, Record<string, string>> = {
  TEACHER: { SPAM: "other", INAPPROPRIATE_CONTENT: "inappropriate", HARASSMENT: "inappropriate", FRAUD: "scam", OTHER: "other" },
  REVIEW: { SPAM: "spam", INAPPROPRIATE_CONTENT: "offensive", HARASSMENT: "offensive", FRAUD: "misinformation", OTHER: "other" },
};

// The screens call a dismissed report REJECTED; the backend has no REVIEWING state.
const toUiStatus = (status?: string) => (status === "DISMISSED" ? "REJECTED" : status ?? "PENDING");

// The screens' action names, translated to what POST /reports/{id}/actions accepts. The ban length is capped at a year.
const MAX_BAN_DAYS = 365;

const toApplyAction = ({ action, status, reason, metadata }: ResolveReportRequest): Promise<ApplyAction> | ApplyAction => {
  if (status === "REJECTED") return { action: "DISMISS", reason };
  switch (action) {
    case "WARNING_SENT":
      return { action: "WARN", reason };
    case "CONTENT_HIDDEN":
    case "CONTENT_DELETED":
      return { action: "REMOVE", reason };
    case "USER_SUSPENDED":
      return { action: "BAN", reason, banDays: Number(metadata?.duration_days) };
    case "USER_BANNED":
      return unsupported(`khóa tài khoản vĩnh viễn (tối đa ${MAX_BAN_DAYS} ngày)`);
    default:
      return unsupported("hành động này từ báo cáo");
  }
};

// The history entries the screens show, from the backend's action log.
const toHistory = (reportId: string, action: ReportAction, index: number, users: Map<string, { fullName?: string; email?: string | null; avatarUrl?: string | null }>): History => {
  const actor = action.actorId ? users.get(action.actorId) : undefined;
  const dismissed = action.action === "DISMISS";
  return {
    id: `${reportId}-action-${index}`,
    handler: action.actorId
      ? { id: action.actorId, fullName: actor?.fullName ?? "Quản trị viên", email: actor?.email ?? "", avatarUrl: actor?.avatarUrl ? media(actor.avatarUrl) : null }
      : null,
    action: ({ REMOVE: "CONTENT_HIDDEN", WARN: "WARNING_SENT", BAN: "USER_SUSPENDED", DISMISS: undefined } as const)[action.action!],
    status: dismissed ? "REJECTED" : "RESOLVED",
    reason: action.reason ?? null,
    metadata: action.banDays ? { duration_days: action.banDays } : null,
    createdAt: action.createdAt ?? "",
  };
};

const shortId = (id?: string) => (id ? id.slice(0, 8) : "");

async function loadTarget(report: Report, teachers: Map<string, { fullName?: string; avatarUrl: string }>, users: Map<string, AdminUser>): Promise<ReportTarget | null> {
  const id = report.targetId!;
  if (report.targetType === "TEACHER") {
    const teacher = teachers.get(id);
    return { type: "TEACHER", id, fullName: teacher?.fullName ?? `Giáo viên ${shortId(id)}`, avatarUrl: teacher?.avatarUrl || null };
  }
  const detail = await realRequest<ReviewDetail>({ method: "get", url: `/api/v1/reviews/${id}` }).catch(() => null);
  const review = detail?.review;
  if (!review) return { type: "REVIEW", id, content: "(Đánh giá đã bị xóa)", rating: 0 };
  const student = users.get(review.studentUserId!);
  const teacherName = detail.teacherFullName ?? teachers.get(review.teacherUserId!)?.fullName ?? "";
  return {
    type: "REVIEW",
    id,
    content: review.comment ?? "",
    rating: review.rating ?? 0,
    author: {
      id: review.studentUserId!,
      fullName: review.studentFullName ?? student?.fullName ?? "",
      avatarUrl: media(review.studentAvatarUrl),
      email: student?.email ?? undefined,
      phoneNumber: student?.phoneNumber ?? undefined,
    },
    teacher: { id: review.teacherUserId!, fullName: teacherName, avatarUrl: media(detail.teacherAvatarUrl) },
    authorName: review.studentFullName ?? student?.fullName,
    teacherName,
  };
}

// The report payload carries the reporter's id and email; the name and avatar are
// resolved from the admin user list (the reference API has no get-user-by-id).
async function uiReports(reports: Report[], actions: ReportAction[] = []): Promise<ReportDetailData[]> {
  const teachers = new Map((await allTeachers().catch(() => [])).map((t) => [t.userId!, t]));
  const users = new Map((await allAdminUsers().catch(() => [])).map((u) => [u.id!, u]));
  return Promise.all(
    reports.map(async (report) => {
      const status = toUiStatus(report.status);
      const reporter = report.reporterId ? users.get(report.reporterId) : undefined;
      return {
        id: report.id!,
        reporterUserId: report.reporterId ?? "",
        reporterName: reporter?.fullName ?? `Người dùng ${shortId(report.reporterId)}`,
        reporterEmail: report.reporterEmail ?? reporter?.email ?? "",
        reporterAvatarUrl: media(reporter?.avatarUrl),
        targetType: report.targetType!,
        targetId: report.targetId,
        target: await loadTarget(report, teachers, users),
        reason: REASON[report.targetType!]?.[report.reason!] ?? "other",
        description: report.detail ?? null,
        status,
        resolvedAt: report.resolvedAt ?? null,
        createdAt: report.createdAt ?? "",
        updatedAt: report.resolvedAt ?? report.createdAt ?? "",
        history: actions.map((action, index) => toHistory(report.id!, action, index, users)),
      };
    }),
  );
}

const filterValue = (filter: string, key: string) => new RegExp(`${key}:'([^']*)'`).exec(filter)?.[1];

export const reportRoutes: Route[] = [
  {
    // Reporter search and reason filtering happen locally, after the type/status filters the backend supports.
    pattern: /^\/admin\/reports$/,
    handle: async ({ params }) => {
      const filter = String(params.filter ?? "");
      const targetType = filterValue(filter, "targetType");
      const status = filterValue(filter, "status");
      // Only teacher and review reports exist, and nothing is ever "reviewing".
      if ((targetType && !["TEACHER", "REVIEW"].includes(targetType)) || status === "REVIEWING") return paginate([], params);
      const query: Params = {};
      if (targetType) query.targetType = targetType;
      if (status) query.status = status === "REJECTED" ? "DISMISSED" : status;
      return paginate(await uiReports(await fetchAll<Report>("/api/v1/reports", query)), params);
    },
  },
  {
    pattern: /^\/admin\/users\/([^/]+)\/received$/,
    handle: async ({ id, params }) => {
      const reports = (await fetchAll<Report>("/api/v1/reports")).filter((report) => report.targetId === id);
      return paginate(await uiReports(reports), params);
    },
  },
  {
    pattern: /^\/admin\/reports\/([^/]+)\/resolve$/,
    handle: async ({ id, body }) => {
      const data = await toApplyAction(body as ResolveReportRequest);
      const { report, actions } = await realRequest<ReportDetail>({ method: "post", url: `/api/v1/reports/${id}/actions`, data });
      return (await uiReports([report!], actions))[0];
    },
  },
  {
    pattern: /^\/admin\/reports\/([^/]+)$/,
    handle: async ({ id }) => {
      const { report, actions } = await realRequest<ReportDetail>({ method: "get", url: `/api/v1/reports/${id}` });
      return (await uiReports([report!], actions))[0];
    },
  },
];
