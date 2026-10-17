import { imageUrls } from "@/shared/constants/imageUrls";
import { useToast } from "@/shared/ui/overlay";
import { getStorageUrl } from "@/shared/utils/url";
import type { ReactNode } from "react";
import {
  FiExternalLink,
  FiFileText,
  FiMail,
  FiPhone,
  FiStar,
  FiTrash2,
  FiUser,
} from "react-icons/fi";
import type {
  CommentTarget,
  PostTarget,
  ReportData,
  ReviewTarget,
  TeacherTarget,
} from "../../types/report.type";
import { InfoPill } from "./primitives";
import type { TargetType } from "./types";

const TargetIcon = ({
  type,
  avatar,
  alt,
}: {
  type: TargetType;
  avatar?: string;
  alt: string;
}) => {
  if (avatar) {
    return (
      <img
        src={avatar}
        alt={alt}
        className="h-16 w-16 rounded-full border border-white object-cover shadow-sm ring-2 ring-red-100"
      />
    );
  }

  const icon =
    type === "REVIEW" ? (
      <FiStar size={23} />
    ) : type === "POST" ? (
      <FiFileText size={23} />
    ) : (
      <FiUser size={23} />
    );

  const className =
    type === "REVIEW"
      ? "bg-amber-50 text-amber-600 ring-amber-100"
      : type === "POST"
        ? "bg-blue-50 text-blue-600 ring-blue-100"
        : "bg-slate-100 text-slate-500 ring-slate-100";

  return (
    <div
      className={`flex h-16 w-16 items-center justify-center rounded-2xl border border-white shadow-sm ring-2 ${className}`}
    >
      {icon}
    </div>
  );
};

const MissingTarget = ({ report }: { report: ReportData }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-4">
    <div className="flex items-start gap-3">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
        <FiTrash2 size={20} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-slate-800">
          Đối tượng không còn tồn tại
        </p>
        <p className="mt-1 text-xs leading-relaxed text-slate-500">
          Nội dung hoặc tài khoản này có thể đã bị xóa. Bạn vẫn có thể bỏ qua
          báo cáo để hoàn tất hàng chờ xử lý.
        </p>
        <p className="mt-2 select-all font-mono text-[10px] font-semibold text-slate-400">
          ID: {report.targetId || report.id}
        </p>
      </div>
    </div>
  </div>
);

const copyText = async (text: string) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  document.execCommand("copy");
  document.body.removeChild(textArea);
};

const CopyInfoPill = ({
  icon,
  value,
  label,
}: {
  icon: ReactNode;
  value: string;
  label: string;
}) => {
  const { showToast } = useToast();

  const handleCopy = async () => {
    try {
      await copyText(value);
      showToast({
        message: `Đã sao chép ${label}`,
        position: "top",
        toastType: "success",
        duration: 1800,
      });
    } catch {
      showToast({
        message: `Không thể sao chép ${label}`,
        position: "top",
        toastType: "error",
      });
    }
  };

  return (
    <InfoPill
      icon={icon}
      onClick={handleCopy}
      title={`Sao chép ${label}`}
    >
      {value}
    </InfoPill>
  );
};

const clampRating = (rating?: number) => {
  if (!rating) return 0;
  return Math.min(5, Math.max(0, Math.round(rating)));
};

const TeacherTargetView = ({
  target,
  onViewDetail,
}: {
  target: TeacherTarget;
  onViewDetail: () => void;
}) => {
  const avatar = getStorageUrl(target.avatarUrl) || imageUrls.fallback.avatar;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <TargetIcon type="TEACHER" avatar={avatar} alt={target.fullName} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="min-w-0 truncate text-lg font-extrabold text-slate-950">
              {target.fullName}
            </h3>
            <button
              type="button"
              onClick={onViewDetail}
              className="inline-flex shrink-0 items-center justify-center p-0.5 text-slate-400 transition-colors hover:text-blue-700"
              aria-label="Xem hồ sơ chi tiết giáo viên"
              title="Xem hồ sơ chi tiết giáo viên"
            >
              <FiExternalLink size={16} />
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {target.email && (
              <CopyInfoPill
                icon={<FiMail size={12} />}
                value={target.email}
                label="email"
              />
            )}
            {target.phoneNumber && (
              <CopyInfoPill
                icon={<FiPhone size={12} />}
                value={target.phoneNumber}
                label="số điện thoại"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ReviewTargetView = ({
  target,
  onViewTeacher,
}: {
  target: ReviewTarget;
  onViewTeacher: () => void;
}) => {
  const reviewerName =
    target.author?.fullName || target.authorName || "Người dùng";
  const reviewerAvatar = getStorageUrl(target.author?.avatarUrl) || imageUrls.fallback.avatar;
  const rating = clampRating(target.rating);
  const activeStars = "★".repeat(rating);
  const inactiveStars = "★".repeat(5 - rating);
  const reviewContent = target.content || "Người dùng chưa để lại nội dung.";
  const reviewerEmail = target.author?.email;
  const reviewerPhoneNumber = target.author?.phoneNumber;
  const hasReviewerContact = Boolean(reviewerEmail || reviewerPhoneNumber);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
      <div className="flex items-start gap-3">
        <img
          src={reviewerAvatar}
          alt={reviewerName}
          className="h-11 w-11 shrink-0 rounded-full border border-slate-100 bg-white object-cover shadow-2xs"
          loading="lazy"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-base font-extrabold text-slate-950">
                {reviewerName}
              </h3>
              {hasReviewerContact && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {reviewerEmail && (
                    <CopyInfoPill
                      icon={<FiMail size={12} />}
                      value={reviewerEmail}
                      label="email"
                    />
                  )}
                  {reviewerPhoneNumber && (
                    <CopyInfoPill
                      icon={<FiPhone size={12} />}
                      value={reviewerPhoneNumber}
                      label="số điện thoại"
                    />
                  )}
                </div>
              )}
            </div>
            <span
              className="shrink-0 whitespace-nowrap text-sm font-bold leading-5 tracking-normal"
              aria-label={`${rating}/5 sao`}
              title={`${rating}/5 sao`}
            >
              <span className="text-amber-400">{activeStars}</span>
              <span className="text-slate-200">{inactiveStars}</span>
            </span>
          </div>

          {target.teacherName && (
            <p className="mt-3 truncate text-xs font-semibold text-slate-400">
              Gửi đến giáo viên{" "}
              <span className="font-bold text-slate-600">{target.teacherName}</span>
              {target.teacher?.id && (
                <button
                  type="button"
                  onClick={onViewTeacher}
                  className="ml-1.5 inline-flex translate-y-0.5 items-center justify-center p-0.5 text-slate-400 transition-colors hover:text-blue-700"
                  aria-label="Xem hồ sơ chi tiết giáo viên"
                  title="Xem hồ sơ chi tiết giáo viên"
                >
                  <FiExternalLink size={14} />
                </button>
              )}
            </p>
          )}

          <p className="mt-2 line-clamp-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
            {reviewContent}
          </p>
        </div>
      </div>
    </div>
  );
};

const CommentTargetView = ({
  target,
  onViewDetail,
}: {
  target: CommentTarget;
  onViewDetail: () => void;
}) => (
  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-start gap-2">
            <h3 className="line-clamp-2 min-w-0 text-base font-extrabold leading-snug text-slate-950">
              Bình luận của {target.authorName || "người dùng"}
            </h3>
            {target.postId && (
              <button
                type="button"
                onClick={onViewDetail}
                className="mt-0.5 inline-flex shrink-0 items-center justify-center p-0.5 text-slate-400 transition-colors hover:text-blue-700"
                aria-label="Xem bài viết chứa bình luận"
                title="Xem bài viết chứa bình luận"
              >
                <FiExternalLink size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
        <p className="line-clamp-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-800">
          {target.content || "Không có nội dung bình luận"}
        </p>
      </div>
    </div>
  </div>
);

const getPostPreview = (target: PostTarget) => {
  const sourceText = target.contentSnippet || target.content || "";
  const snippetParts = sourceText
    .split(/\n+/)
    .map((part) => part.trim())
    .filter(Boolean);
  const explicitTitle = target.title?.trim();
  const derivedTitle =
    !explicitTitle && snippetParts.length > 1 ? snippetParts[0] : "";
  const title = explicitTitle || derivedTitle || "Bài viết không có tiêu đề";
  const bodyParts = derivedTitle ? snippetParts.slice(1) : snippetParts;
  const body = bodyParts.join("\n\n") || "Không có nội dung";

  return { title, body };
};

const PostTargetView = ({
  target,
  onViewDetail,
}: {
  target: PostTarget;
  onViewDetail: () => void;
}) => {
  const preview = getPostPreview(target);
  const authorName = target.author?.fullName || target.authorName || "Người dùng";
  const authorAvatar = getStorageUrl(target.author?.avatarUrl) || imageUrls.fallback.avatar;
  const authorEmail = target.author?.email;
  const authorPhoneNumber = target.author?.phoneNumber;
  const hasAuthorContact = Boolean(authorEmail || authorPhoneNumber);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-start gap-2">
              <h3 className="line-clamp-2 min-w-0 text-base font-extrabold leading-snug text-slate-950">
                {preview.title}
              </h3>
              <button
                type="button"
                onClick={onViewDetail}
                className="mt-0.5 inline-flex shrink-0 items-center justify-center p-0.5 text-slate-400 transition-colors hover:text-blue-700"
                aria-label="Xem chi tiết bài viết"
                title="Xem chi tiết bài viết"
              >
                <FiExternalLink size={16} />
              </button>
            </div>

            <div className="mt-3 flex items-start gap-3">
              <img
                src={authorAvatar}
                alt={authorName}
                className="h-11 w-11 shrink-0 rounded-full border border-slate-100 bg-white object-cover shadow-2xs"
                loading="lazy"
              />
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-slate-500">
                  Người đăng{" "}
                  <span className="font-bold text-slate-800">
                    {authorName}
                  </span>
                </p>
                {hasAuthorContact && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {authorEmail && (
                      <CopyInfoPill
                        icon={<FiMail size={12} />}
                        value={authorEmail}
                        label="email"
                      />
                    )}
                    {authorPhoneNumber && (
                      <CopyInfoPill
                        icon={<FiPhone size={12} />}
                        value={authorPhoneNumber}
                        label="số điện thoại"
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
          <p className="line-clamp-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-800">
            {preview.body}
          </p>
        </div>
      </div>
    </div>
  );
};

export const ReportTargetContent = ({ report, onViewTeacherDetail, onViewPostDetail }: {
  report: ReportData;
  onViewTeacherDetail: (target: TeacherTarget) => void;
  onViewPostDetail: (target: PostTarget) => void;
}) => {
  if (!report.target) return <MissingTarget report={report} />;

  if (report.targetType === "TEACHER") {
    const target = report.target as TeacherTarget;
    return (
      <TeacherTargetView
        target={target}
        onViewDetail={() => onViewTeacherDetail(target)}
      />
    );
  }

  if (report.targetType === "REVIEW") {
    const target = report.target as ReviewTarget;
    return (
      <ReviewTargetView
        target={target}
        onViewTeacher={() => {
          if (!target.teacher) return;
          onViewTeacherDetail({
            type: "TEACHER",
            id: target.teacher.id,
            fullName: target.teacher.fullName,
            avatarUrl: target.teacher.avatarUrl ?? null,
          });
        }}
      />
    );
  }

  if (report.targetType === "COMMENT") {
    const target = report.target as CommentTarget;
    return (
      <CommentTargetView
        target={target}
        onViewDetail={() => {
          if (target.postId) onViewPostDetail({ type: "POST", id: target.postId });
        }}
      />
    );
  }

  const target = report.target as PostTarget;
  return (
    <PostTargetView
      target={target}
      onViewDetail={() => onViewPostDetail(target)}
    />
  );
};
