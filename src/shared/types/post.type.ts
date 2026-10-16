import type { User } from "@/features/account/types/type";
import type { RoleType } from "@/features/auth/types";

export const POST_TYPES = {
  KNOWLEDGE: "KNOWLEDGE",
  Q_AND_A: "Q_AND_A",
  EXPERIENCE: "EXPERIENCE",
  NEWS: "NEWS",
} as const;
export type PostType = (typeof POST_TYPES)[keyof typeof POST_TYPES];

export const POST_TYPE_OPTIONS = [
  { value: POST_TYPES.KNOWLEDGE, label: "Kiến thức" },
  { value: POST_TYPES.Q_AND_A, label: "Hỏi đáp" },
  { value: POST_TYPES.NEWS, label: "Tin tức" },
  { value: POST_TYPES.EXPERIENCE, label: "Kinh nghiệm" },
] as const;

export const getPostTypeLabel = (type: unknown) => {
  switch (String(type)) {
    case POST_TYPES.Q_AND_A:
      return "Hỏi đáp";
    case POST_TYPES.NEWS:
    case "TIN_TUC":
      return "Tin tức";
    case POST_TYPES.EXPERIENCE:
    case "SHARE_EXPERIENCE":
    case "STUDENT_EXPERIENCE":
      return "Kinh nghiệm";
    default:
      return "Kiến thức";
  }
};

export const getPostTypeBadgeClass = (type: unknown) => {
  switch (String(type)) {
    case POST_TYPES.Q_AND_A:
      return "bg-sky-50 text-sky-700 border-sky-200";
    case POST_TYPES.NEWS:
    case "TIN_TUC":
      return "bg-rose-50 text-rose-700 border-rose-200";
    case POST_TYPES.EXPERIENCE:
    case "SHARE_EXPERIENCE":
    case "STUDENT_EXPERIENCE":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    default:
      return "bg-violet-50 text-violet-700 border-violet-200";
  }
};

export interface Post {
  id: string;
  owner: User;
  contentSummary?: string;
  // userId: string;
  // userFullName: string;
  // userAvatarUrl: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  mediaUrls?: string[];
  content: string;
  type: PostType;
  likeCount: number;
  commentCount: number;
  saveCount: number;
  viewCount?: number;
  shareCount?: number;
  liked?: boolean;
  saved?: boolean;
  pinnedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PostComment {
  id: string;
  postId: string;
  content: string;
  author: {
    id: string;
    fullName: string;
    avatarUrl: string;
    role?: RoleType;
  };
  replies?: PostComment[];
  parentId: string | null;
  replyCount: number;
  likeCount: number;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
}
