import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Eye, CheckCircle2, ArrowLeft } from "lucide-react";
import { APP_PATHS } from "@/shared/constants/appPaths";
import { AppInput } from "@/shared/components/ui/app-input";
import { Button } from "@/shared/components/ui/button";
import { useToast } from "@/shared/ui/overlay/toast/useToast";
import { AdminBreadcrumbs } from "@/shared/ui/navigation/AdminBreadcrumbs";
import { useInviteTeacher } from "../hooks/useInviteTeacher";
import { useInviteTeacherForm } from "../hooks/useInviteTeacherForm";

type PageState = "form" | "success";

export const InviteTeacherContentV2 = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [pageState, setPageState] = useState<PageState>("form");
  const [createdTeacherId, setCreatedTeacherId] = useState<string | null>(null);

  const {
    formState,
    errors,
    setFieldValue,
    handleBlur,
    validateAll,
    canSubmit,
  } = useInviteTeacherForm();

  const { mutate: inviteTeacher, isPending } = useInviteTeacher();

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      if (!validateAll()) return;

      inviteTeacher(
        {
          email: formState.email.trim(),
          fullName: formState.fullName.trim(),
        },
        {
          onSuccess: (data) => {
            setCreatedTeacherId(data?.userId ?? null);
            setPageState("success");
            showToast({
              message: "Tạo tài khoản giáo viên thành công! 🎉",
              toastType: "success",
              position: "top",
            });
          },
          onError: (error: unknown) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const apiError = error as any;
            console.error("Invite API error:", apiError);

            const data = apiError?.response?.data || apiError;
            let message = data?.message || "Có lỗi xảy ra. Vui lòng thử lại.";

            if (data?.code === "EMAIL_ALREADY_EXISTS") {
              message =
                "Email này đã tồn tại trong hệ thống. Vui lòng sử dụng một địa chỉ email khác.";
            }

            showToast({
              message,
              toastType: "error",
              position: "top",
            });
          },
        },
      );
    },
    [formState, validateAll, inviteTeacher, showToast],
  );

  const handleCancel = useCallback(() => {
    navigate(APP_PATHS.ADMIN_TEACHERS);
  }, [navigate]);

  const handleViewDetail = useCallback(() => {
    if (createdTeacherId) {
      navigate(APP_PATHS.ADMIN_TEACHER_DETAIL_WITH_ID(createdTeacherId));
    }
  }, [navigate, createdTeacherId]);

  const handleBackToList = useCallback(() => {
    navigate(APP_PATHS.ADMIN_TEACHERS);
  }, [navigate]);

  return (
    <div className="p-6">
      {/* Navigation Breadcrumbs */}
      <AdminBreadcrumbs />

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={handleCancel}
          className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200 outline-none cursor-pointer"
          aria-label="Quay lại"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-app-text">Mời giáo viên</h1>
          <p className="text-sm text-app-text-muted mt-0.5">
            Tạo tài khoản giáo viên mới và gửi thư mời qua email để hoàn tất hồ sơ
          </p>
        </div>
      </div>

      {/* Card Wrapper */}
      <div className="flex justify-center">
        <div className="w-full max-w-xl bg-white border border-app-border rounded-2xl p-6 sm:p-8 shadow-sm transition-all duration-300 hover:shadow-md">
          {pageState === "form" ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div>
                <h3 className="text-base font-semibold text-app-text border-b border-app-border pb-3 mb-5">
                  Thông tin cơ bản
                </h3>

                <div className="flex flex-col gap-5">
                  <AppInput
                    label="Họ và tên"
                    required
                    value={formState.fullName}
                    onChange={(e) => setFieldValue("fullName", e.target.value)}
                    onBlur={() => handleBlur("fullName")}
                    placeholder="Nhập họ và tên giáo viên"
                    error={errors.fullName}
                    inputSize="lg"
                  />

                  <AppInput
                    label="Email"
                    required
                    type="email"
                    value={formState.email}
                    onChange={(e) => setFieldValue("email", e.target.value)}
                    onBlur={() => handleBlur("email")}
                    placeholder="Nhập email giáo viên"
                    error={errors.email}
                    inputSize="lg"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-app-border mt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={handleCancel}
                  disabled={isPending}
                  className="rounded-xl font-semibold px-6 border-app-border hover:bg-app-bg-muted"
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  size="lg"
                  isLoading={isPending}
                  disabled={!canSubmit}
                  className="bg-brand hover:bg-brand-hover text-white rounded-xl font-semibold px-8 min-w-[140px]"
                >
                  Tạo giáo viên
                </Button>
              </div>
            </form>
          ) : (
            /* Success State */
            <div className="flex flex-col items-center text-center py-6 px-2 gap-6 animate-in fade-in zoom-in duration-300">
              <div className="relative">
                <div className="absolute inset-0 bg-app-success/10 rounded-full animate-ping scale-75 opacity-75"></div>
                <CheckCircle2 className="h-20 w-20 text-app-success relative z-10" />
              </div>

              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-bold text-app-text">
                  Tạo tài khoản thành công!
                </h2>
                <p className="text-sm text-app-text-muted max-w-sm mx-auto">
                  Tài khoản cho giáo viên <span className="font-semibold text-app-text">{formState.fullName}</span> ({formState.email}) đã được khởi tạo thành công trên hệ thống.
                </p>
              </div>

              <div className="flex flex-col gap-3 w-full max-w-[340px] mt-2">
                <Button
                  variant="default"
                  size="lg"
                  leftIcon={<Mail className="h-4 w-4" />}
                  onClick={() => {
                    showToast({
                      message: "Đã gửi lại email mời thành công! ✉️",
                      toastType: "success",
                      position: "top",
                    });
                  }}
                  className="bg-brand hover:bg-brand-hover text-white font-semibold rounded-xl w-full shadow-sm py-2.5"
                >
                  Gửi email mời ngay
                </Button>

                {createdTeacherId && (
                  <Button
                    variant="outline"
                    size="lg"
                    leftIcon={<Eye className="h-4 w-4" />}
                    onClick={handleViewDetail}
                    className="font-semibold rounded-xl w-full border-app-border text-app-text hover:bg-app-bg-muted py-2.5"
                  >
                    Xem chi tiết hồ sơ
                  </Button>
                )}

                <Button
                  variant="ghost"
                  onClick={handleBackToList}
                  leftIcon={<ArrowLeft className="h-4 w-4" />}
                  className="font-semibold text-app-text-muted hover:text-app-text hover:bg-transparent mt-2"
                >
                  Quay lại danh sách
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InviteTeacherContentV2;
