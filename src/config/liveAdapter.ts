import type { AxiosAdapter, InternalAxiosRequestConfig } from "axios";
import { demoAdapter } from "@/demo/adapter";
import { authService } from "@/services/auth/auth.service";
import { realRequest } from "./realApi";
import { postRoutes } from "./live/posts";
import { reportRoutes } from "./live/reports";
import { DEMO, fetchAll, pageParams, type Params, type Route } from "./live/shared";
import { teacherRoutes } from "./live/teachers";

// Routes with a counterpart in the reference API go to the real backend and are
// translated to/from the older shapes the screens expect. Everything else stays on the demo adapter.

interface Tag {
  type: string;
  [key: string]: unknown;
}

interface Province {
  id: string;
  name: string;
}

const uiTag = (tag: Tag): Tag => ({ ...tag, type: tag.type.toLowerCase() });
type TagInput = { name: string; type: string };
const tagCommand = (tag: TagInput) => ({ name: tag.name, type: tag.type.toUpperCase() });

const PERIOD_DAYS: Record<string, number> = { TODAY: 1, WEEK: 7, MONTH: 30 };

// Keeps rows created within the dashboard period; "ALL" (or anything unknown) keeps everything.
const inPeriod = <T extends { createdAt?: string }>(rows: T[], period: unknown): T[] => {
  const days = PERIOD_DAYS[String(period)];
  if (!days) return rows;
  const since = Date.now() - days * 86400000;
  return rows.filter((row) => Date.parse(row.createdAt ?? "") >= since);
};

const count = <T>(rows: T[], test: (row: T) => boolean) => rows.filter(test).length;

const routes: Route[] = [
  ...postRoutes,
  ...reportRoutes,
  ...teacherRoutes,

  {
    pattern: /^\/v1\/account$/,
    handle: async () => (await authService.me()) ?? Promise.reject({ response: { status: 401 } }),
  },

  // Dashboard figures are derived from list endpoints; the reference API has no statistics endpoints.
  {
    // No user-listing endpoint exists, so these cannot be computed. Zeros, not demo numbers.
    pattern: /^\/admin\/stats\/users$/,
    handle: async () => ({ total: 0, active: 0, inactive: 0, banned: 0 }),
  },
  {
    // Only published profiles are listed publicly: drafts are unknown and the period cannot be applied.
    pattern: /^\/admin\/stats\/teachers$/,
    handle: async () => {
      const page = await realRequest<{ totalElements: number }>({
        method: "get",
        url: "/api/v1/teacher-profiles",
        params: { page: 0, size: 1 },
      });
      return { total: page.totalElements, success: page.totalElements, draft: 0 };
    },
  },
  {
    // The backend only reports teachers and reviews, so the post and comment counts are always 0.
    pattern: /^\/admin\/stats\/reports$/,
    handle: async ({ params }) => {
      const reports = inPeriod(await fetchAll<{ targetType: string; createdAt?: string }>("/api/v1/reports"), params.period);
      return {
        total: reports.length,
        teacher: count(reports, (r) => r.targetType === "TEACHER"),
        review: count(reports, (r) => r.targetType === "REVIEW"),
        post: 0,
        comment: 0,
      };
    },
  },
  {
    pattern: /^\/admin\/stats\/posts$/,
    handle: async ({ params }) => {
      const posts = inPeriod(await fetchAll<{ category: string; createdAt?: string }>("/api/v1/admin/posts"), params.period);
      return {
        total: posts.length,
        knowledge: count(posts, (p) => p.category === "KNOWLEDGE"),
        qAndA: count(posts, (p) => p.category === "QA"),
      };
    },
  },

  {
    pattern: /^\/v1\/tags$/,
    handle: async ({ params }) => {
      const type = typeof params.type === "string" ? params.type.toUpperCase() : undefined;
      return (await fetchAll<Tag>("/api/v1/tags", type ? { type } : {})).map(uiTag);
    },
  },
  {
    pattern: /^\/v1\/tags\/bulk$/,
    handle: async ({ body }) => {
      // The reference API has no bulk tag endpoint; create one by one so the first failure stops the batch.
      const created: Tag[] = [];
      for (const tag of body as TagInput[]) {
        created.push(uiTag(await realRequest<Tag>({ method: "post", url: "/api/v1/tags", data: tagCommand(tag) })));
      }
      return created;
    },
  },
  {
    pattern: /^\/v1\/tags\/([^/]+)$/,
    handle: async ({ method, id, body }) =>
      method === "delete"
        ? realRequest({ method: "delete", url: `/api/v1/tags/${id}` })
        : uiTag(await realRequest<Tag>({ method: "put", url: `/api/v1/tags/${id}`, data: tagCommand(body as TagInput) })),
  },

  {
    pattern: /^\/v1\/training-levels$/,
    handle: ({ params }) => realRequest({ method: "get", url: "/api/v1/training-levels", params: pageParams(params) }),
  },
  {
    pattern: /^\/v1\/training-levels\/bulk$/,
    handle: ({ body }) =>
      realRequest({ method: "post", url: "/api/v1/training-levels/bulk", data: { trainingLevels: body } }),
  },
  {
    pattern: /^\/v1\/training-levels\/([^/]+)$/,
    handle: ({ method, id, body }) => {
      if (method === "delete") return realRequest({ method: "delete", url: `/api/v1/training-levels/${id}` });
      const { name, description } = body as { name: string; description: string };
      return realRequest({ method: "put", url: `/api/v1/training-levels/${id}`, data: { name, description } });
    },
  },

  {
    pattern: /^\/v1\/provinces$/,
    handle: ({ params }) => realRequest({ method: "get", url: "/api/v1/provinces", params: pageParams(params) }),
  },
  { pattern: /^\/v2\/provinces$/, handle: () => fetchAll<Province>("/api/v1/provinces") },
  {
    // The screens look a province up by id; the reference API only exposes slugs and a separate districts list.
    pattern: /^\/v1\/provinces\/([^/]+)$/,
    handle: async ({ id }) => {
      const province = (await fetchAll<Province>("/api/v1/provinces")).find((p) => p.id === id);
      if (!province) return Promise.reject({ response: { status: 404, data: { message: "Không tìm thấy dữ liệu" } } });
      return { ...province, districts: await fetchAll("/api/v1/districts", { provinceId: id }) };
    },
  },
];

const parseBody = (data: unknown) => (typeof data === "string" ? JSON.parse(data) : data) ?? {};

export const liveAdapter: AxiosAdapter = async (config: InternalAxiosRequestConfig) => {
  const url = new URL(config.url || "/", "http://local");
  const method = (config.method || "get").toLowerCase();
  for (const { pattern, handle } of routes) {
    const match = pattern.exec(url.pathname);
    if (!match) continue;
    const params: Params = { ...Object.fromEntries(url.searchParams), ...config.params };
    const data = await handle({ method, id: match[1], params, body: parseBody(config.data) });
    if (data === DEMO) break;
    return { data, status: 200, statusText: "OK", headers: {}, config };
  }
  return demoAdapter(config);
};
