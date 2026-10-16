import { paginate } from "@/demo/store";
import type { AdminStudentDetail } from "@/features/admin/student-management/types";
import type { components } from "@/generated/api";
import { realRequest } from "../realApi";
import { apiError, fetchAll, media, unsupported, type Params, type Route } from "./shared";

type AdminUser = components["schemas"]["AdminUserResponse"];

// Students are real accounts in the reference API (api-1 (6).json):
// GET /api/v1/admin/users?role=STUDENT is the only student listing — there is no
// status filter and no get-by-id, so the full list is fetched and the screen's
// search/status/sort/page are applied locally, exactly like the teachers list.
//
// A timed ban does not change the stored account `status` (see the schema), so a
// banned student is recognised by `banned`/`bannedUntil`/`banReason` and mapped
// onto the screen's BANNED status + suspension shape.

const uiStudentRow = (user: AdminUser): AdminStudentDetail => ({
  id: user.id ?? "",
  email: user.email ?? "",
  fullName: user.fullName ?? "",
  phoneNumber: user.phoneNumber ?? "",
  role: user.role ?? "STUDENT",
  avatarUrl: media(user.avatarUrl),
  emailVerified: user.emailVerified ?? false,
  phoneVerified: false,
  // The reference status enum has no DELETED; deleted accounts are not listed.
  deleted: false,
  status: (user.banned ? "BANNED" : (user.status ?? "ACTIVE")) as AdminStudentDetail["status"],
  createdAt: user.createdAt ?? "",
  updatedAt: user.createdAt ?? "",
  createdBy: "",
  updatedBy: "",
  suspension: user.banned
    ? {
        sanctionId: user.id ?? "",
        reason: user.banReason ?? "",
        startAt: "",
        endAt: user.bannedUntil ?? "",
      }
    : null,
});

const STUDENTS_TTL_MS = 30_000;
let studentsEntry: { at: number; value: Promise<AdminStudentDetail[]> } | null = null;

export const allStudents = (): Promise<AdminStudentDetail[]> => {
  if (!studentsEntry || Date.now() - studentsEntry.at > STUDENTS_TTL_MS) {
    const value = fetchAll<AdminUser>("/api/v1/admin/users", { role: "STUDENT" }).then((rows) =>
      rows.map(uiStudentRow),
    );
    studentsEntry = { at: Date.now(), value };
    value.catch(() => (studentsEntry = null));
  }
  return studentsEntry.value;
};

const invalidateStudents = () => {
  studentsEntry = null;
};

export const findStudent = async (id: string): Promise<AdminStudentDetail | undefined> =>
  (await allStudents()).find((student) => student.id === id);

interface SanctionBody {
  type?: string;
  reason?: { message?: string };
  durationDays?: number;
  metadata?: { reason?: string };
}

/**
 * Handles the screen's sanction/unsanction calls for a real student.
 * The screen distinguishes the two by shape, not by URL: a sanction carries a
 * body ({ type, reason: { message }, durationDays }), a revoke carries only a
 * `reason` query param and no body.
 */
export const sanctionStudent = async (id: string, { params, body }: { params: Params; body: unknown }) => {
  const payload = (body ?? {}) as SanctionBody;

  if (!payload.type) {
    const reason = typeof params.reason === "string" ? params.reason.trim() : "";
    if (reason.length < 5) throw apiError(400, "Lý do gỡ chặn phải có ít nhất 5 ký tự.");
    await realRequest({ method: "post", url: `/api/v1/admin/users/${id}/unban`, data: { reason } });
    invalidateStudents();
    return {};
  }

  if (payload.type === "WARNING") {
    return unsupported("gửi cảnh báo — backend chỉ hỗ trợ khóa tài khoản");
  }

  const reason = (payload.reason?.message ?? payload.metadata?.reason ?? "").trim();
  if (reason.length < 5) throw apiError(400, "Lý do khóa tài khoản phải có ít nhất 5 ký tự.");

  // Backend bans are always timed (1–365 days). The screen's permanent BAN maps
  // to the 365-day maximum; a SUSPENSION uses the chosen duration.
  const days =
    payload.type === "BAN" ? 365 : Math.min(365, Math.max(1, Math.trunc(payload.durationDays ?? 1)));
  await realRequest({
    method: "post",
    url: `/api/v1/admin/users/${id}/ban`,
    data: { days, reason },
  });
  invalidateStudents();
  return {};
};

export const studentRoutes: Route[] = [
  {
    pattern: /^\/admin\/students$/,
    handle: async ({ params }) => paginate(await allStudents(), params),
  },
];
