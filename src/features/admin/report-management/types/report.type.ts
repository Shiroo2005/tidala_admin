export interface PersonResponse {
  id: string;
  fullName: string;
  email?: string;
  phoneNumber?: string;
  avatarUrl?: string | null;
}

export interface TeacherTarget {
  type: "TEACHER";
  id: string;
  fullName: string;
  avatarUrl: string | null;
  email?: string;
  phoneNumber?: string;
}

export interface ReviewTarget {
  type: "REVIEW";
  id: string;
  content: string;
  rating: number;
  author?: PersonResponse;
  teacher?: PersonResponse;
  authorName?: string;
  teacherName?: string;
}

export interface PostTarget {
  type: "POST";
  id: string;
  title?: string | null;
  content?: string | null;
  contentSnippet?: string | null;
  author?: PersonResponse;
  authorName?: string | null;
}

export interface CommentTarget {
  type: "COMMENT";
  id: string;
  content: string;
  author?: PersonResponse;
  authorName?: string;
  postId?: string;
}

export type ReportTarget =
  | TeacherTarget
  | ReviewTarget
  | PostTarget
  | CommentTarget;

export type ResolveReportAction =
  | "WARNING_SENT"
  | "CONTENT_HIDDEN"
  | "CONTENT_RESTORED"
  | "CONTENT_DELETED"
  | "COMMENTS_LOCKED"
  | "COMMENTS_UNLOCKED"
  | "USER_SUSPENDED"
  | "USER_UNSUSPENDED"
  | "USER_BANNED"
  | "USER_UNBANNED";

export type ResolveReportStatus =
  | "PENDING"
  | "REVIEWING"
  | "RESOLVED"
  | "REJECTED";

export type BanDuration = "1" | "3" | "7" | "permanent";

export interface ResolveReportRequest {
  action?: ResolveReportAction;
  status: ResolveReportStatus;
  reason?: string;
  metadata?: Record<string, unknown>;
}

export interface ReporterResponse {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string | null;
}

export interface ReportData {
  id: string;
  reporterUserId: string;
  reporterName: string;
  reporterEmail: string;
  reporterAvatarUrl: string;
  targetType: "TEACHER" | "REVIEW" | "POST" | "COMMENT";
  targetId?: string; // Optional since API response has 'target' object
  target: ReportTarget | null;
  reason: string;
  description: string | null;
  status: "PENDING" | "REVIEWING" | "RESOLVED" | "REJECTED" | string;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReportActionHandler {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string | null;
}

export interface ReportActionData {
  id: string;
  handler: ReportActionHandler | null;
  action?: ResolveReportAction;
  status: ResolveReportStatus;
  reason: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface ReportDetailData extends ReportData {
  history: ReportActionData[];
}
