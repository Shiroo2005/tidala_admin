import { paginate } from "@/demo/store";
import type { components } from "@/generated/api";
import type { ReportDetailData, ReportTarget, ResolveReportRequest } from "@/features/admin/report-management/types/report.type";
import { realRequest } from "../realApi";
import { fetchAll, media, unsupported, type Params, type Route } from "./shared";
import { allTeachers } from "./teachers";

type Report = components["schemas"]["ReportResponse"];
type Review = components["schemas"]["ReviewSummary"];

// The backend has five reason codes; the screens have their own per-type lists. Closest match per type.
const REASON: Record<string, Record<string, string>> = {
  TEACHER: { SPAM: "other", INAPPROPRIATE_CONTENT: "inappropriate", HARASSMENT: "inappropriate", FRAUD: "scam", OTHER: "other" },
  REVIEW: { SPAM: "spam", INAPPROPRIATE_CONTENT: "offensive", HARASSMENT: "offensive", FRAUD: "misinformation", OTHER: "other" },
};

// The screens call a dismissed report REJECTED; the backend has no REVIEWING state.
const toUiStatus = (status?: string) => (status === "DISMISSED" ? "REJECTED" : status ?? "PENDING");

// Resolving only records an outcome and a note. Actions that should also change an account or content
// would be recorded without happening, so they are refused until the backend supports them.
const ACTIONS_WITHOUT_SIDE_EFFECTS = new Set([undefined, "CONTENT_RESTORED"]);

const shortId = (id?: string) => (id ? id.slice(0, 8) : "");

async function loadTarget(report: Report, teachers: Map<string, { fullName?: string; avatarUrl: string }>): Promise<ReportTarget | null> {
  const id = report.targetId!;
  if (report.targetType === "TEACHER") {
    const teacher = teachers.get(id);
    return { type: "TEACHER", id, fullName: teacher?.fullName ?? `Giáo viên ${shortId(id)}`, avatarUrl: teacher?.avatarUrl || null };
  }
  const review = await realRequest<Review>({ method: "get", url: `/api/v1/reviews/${id}` }).catch(() => null);
  if (!review) return { type: "REVIEW", id, content: "(Đánh giá đã bị xóa)", rating: 0 };
  const teacherName = teachers.get(review.teacherUserId!)?.fullName ?? "";
  return {
    type: "REVIEW",
    id,
    content: review.comment ?? "",
    rating: review.rating ?? 0,
    author: { id: review.studentUserId!, fullName: review.studentFullName ?? "", avatarUrl: media(review.studentAvatarUrl) },
    teacher: { id: review.teacherUserId!, fullName: teacherName },
    authorName: review.studentFullName,
    teacherName,
  };
}

// The backend returns only the reporter's id, so there is no reporter name, email or avatar to show.
async function uiReports(reports: Report[]): Promise<ReportDetailData[]> {
  const teachers = new Map((await allTeachers().catch(() => [])).map((t) => [t.userId!, t]));
  return Promise.all(
    reports.map(async (report) => {
      const status = toUiStatus(report.status);
      return {
        id: report.id!,
        reporterUserId: report.reporterId ?? "",
        reporterName: `Người dùng ${shortId(report.reporterId)}`,
        reporterEmail: "",
        reporterAvatarUrl: "",
        targetType: report.targetType!,
        targetId: report.targetId,
        target: await loadTarget(report, teachers),
        reason: REASON[report.targetType!]?.[report.reason!] ?? "other",
        description: report.detail ?? null,
        status,
        resolvedAt: report.resolvedAt ?? null,
        createdAt: report.createdAt ?? "",
        updatedAt: report.resolvedAt ?? report.createdAt ?? "",
        history: report.resolvedAt
          ? [{
              id: `${report.id}-resolution`,
              handler: report.resolvedBy ? { id: report.resolvedBy, fullName: "Quản trị viên", email: "", avatarUrl: null } : null,
              status: status as ReportDetailData["history"][number]["status"],
              reason: report.resolutionNote ?? null,
              metadata: null,
              createdAt: report.resolvedAt,
            }]
          : [],
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
      const { action, status, reason } = body as ResolveReportRequest;
      if (!ACTIONS_WITHOUT_SIDE_EFFECTS.has(action)) return unsupported("cảnh báo, ẩn nội dung hoặc khóa tài khoản từ báo cáo");
      if (status !== "RESOLVED" && status !== "REJECTED") return unsupported(`chuyển báo cáo sang trạng thái ${status}`);
      const report = await realRequest<Report>({
        method: "put",
        url: `/api/v1/reports/${id}/resolve`,
        data: { outcome: status === "REJECTED" ? "DISMISSED" : "RESOLVED", note: reason },
      });
      return (await uiReports([report]))[0];
    },
  },
  {
    pattern: /^\/admin\/reports\/([^/]+)$/,
    handle: async ({ id }) => (await uiReports([await realRequest<Report>({ method: "get", url: `/api/v1/reports/${id}` })]))[0],
  },
];
