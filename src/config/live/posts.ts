import { paginate } from "@/demo/store";
import type { components } from "@/generated/api";
import type { Post, PostType } from "@/shared/types/post.type";
import { realRequest } from "../realApi";
import { fetchAll, media, unsupported, type Route } from "./shared";

type PostSummary = components["schemas"]["PostSummaryResponse"] & { pinnedAt?: string | null };
type PostDetail = components["schemas"]["PostDetailResponse"];

const POST_TYPE: Record<string, PostType> = {
  KNOWLEDGE: "KNOWLEDGE",
  QA: "Q_AND_A",
  LEARNING_EXPERIENCE: "EXPERIENCE",
  NEWS: "NEWS",
};

const uiPost = (post: PostSummary, detail?: PostDetail): Post & { status?: string } => {
  const images = [...(detail?.images ?? [])].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  return {
    id: post.id!,
    owner: {
      id: post.authorUserId,
      fullName: post.authorName,
      avatarUrl: media(post.authorAvatarUrl),
      role: post.authorRole,
    } as Post["owner"],
    title: post.title ?? "",
    description: post.excerpt ?? "",
    contentSummary: post.title ?? post.excerpt ?? "",
    content: detail?.content ?? post.excerpt ?? "",
    thumbnailUrl: media(post.coverImageObjectKey),
    mediaUrls: images.map((image) => media(image.imageObjectKey)),
    type: POST_TYPE[post.category ?? ""] ?? "KNOWLEDGE",
    status: post.status,
    likeCount: post.likeCount ?? 0,
    commentCount: post.commentCount ?? 0,
    saveCount: post.saveCount ?? 0,
    pinnedAt: post.pinnedAt ?? null,
    createdAt: post.publishedAt ?? post.createdAt ?? "",
    updatedAt: post.updatedAt ?? "",
  };
};

// The admin list has no keyword or category filter, so filter, sort and page the full list locally.
const allPosts = async () => (await fetchAll<PostSummary>("/api/v1/admin/posts")).map((post) => uiPost(post));

export const postRoutes: Route[] = [
  {
    pattern: /^\/v1\/posts(\/search)?$/,
    handle: async ({ params }) => paginate(await allPosts(), params),
  },
  {
    pattern: /^\/v1\/posts\/pinned$/,
    handle: async ({ params }) => paginate((await allPosts()).filter((post) => post.pinnedAt), params),
  },
  {
    pattern: /^\/v1\/posts\/([^/]+)\/pin$/,
    handle: () => unsupported("ghim bài viết"),
  },
  {
    pattern: /^\/v1\/posts\/([^/]+)$/,
    handle: async ({ method, id }) => {
      if (method === "delete") return realRequest({ method: "delete", url: `/api/v1/admin/posts/${id}` });
      const detail = await realRequest<PostDetail>({ method: "get", url: `/api/v1/admin/posts/${id}` });
      return uiPost(detail.post as PostSummary, detail);
    },
  },
];
