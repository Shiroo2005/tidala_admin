import { useState } from "react";
import { FiSave, FiBell, FiMail } from "react-icons/fi";

export const NotificationSettings = () => {
  const [channels, setChannels] = useState({
    emailNewUser: true,
    emailNewTeacherProfile: true,
    emailReportReceived: true,
    pushNewPost: false,
    pushReportStatus: true,
    systemLogsAlert: false,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsSaving(false);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  const toggleChannel = (key: keyof typeof channels) => {
    setChannels((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      {/* Email Notifications Card */}
      <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <FiMail size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Thông báo Email</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Cấu hình các loại sự kiện hệ thống sẽ gửi email về hộp thư quản trị
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <ToggleItem
            label="Đăng ký tài khoản mới"
            description="Nhận email thông báo khi có học sinh hoặc giáo viên đăng ký tài khoản"
            checked={channels.emailNewUser}
            onChange={() => toggleChannel("emailNewUser")}
          />
          <ToggleItem
            label="Hồ sơ giáo viên mới gửi duyệt"
            description="Nhận email thông báo khi giáo viên nộp hồ sơ đăng ký giảng dạy"
            checked={channels.emailNewTeacherProfile}
            onChange={() => toggleChannel("emailNewTeacherProfile")}
          />
          <ToggleItem
            label="Báo cáo vi phạm mới"
            description="Nhận thông báo khẩn khi có người dùng báo cáo vi phạm nội dung"
            checked={channels.emailReportReceived}
            onChange={() => toggleChannel("emailReportReceived")}
          />
        </div>
      </div>

      {/* Push & System Notifications Card */}
      <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <FiBell size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Thông báo hệ thống (Push Notification)</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Thiết lập gửi thông báo trực tiếp qua ứng dụng web hoặc ứng dụng di động
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <ToggleItem
            label="Khi có bài đăng mới trên diễn đàn"
            description="Đẩy thông báo tới ứng dụng khi giáo viên hoặc học sinh đăng bài mới"
            checked={channels.pushNewPost}
            onChange={() => toggleChannel("pushNewPost")}
          />
          <ToggleItem
            label="Trạng thái xử lý báo cáo vi phạm"
            description="Thông báo đẩy khi người kiểm duyệt thay đổi trạng thái xử lý báo cáo"
            checked={channels.pushReportStatus}
            onChange={() => toggleChannel("pushReportStatus")}
          />
          <ToggleItem
            label="Log hệ thống quá tải hoặc gặp lỗi lớn"
            description="Nhận tin nhắn cảnh báo bảo mật về sự cố kỹ thuật hoặc log bất thường"
            checked={channels.systemLogsAlert}
            onChange={() => toggleChannel("systemLogsAlert")}
          />
        </div>
      </div>

      {/* Save panel */}
      <div className="flex items-center justify-end gap-3">
        {showSaved && (
          <span className="text-sm text-emerald-600 font-medium animate-in fade-in duration-300">
            ✓ Đã lưu cấu hình thông báo
          </span>
        )}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand hover:bg-brand-hover text-white font-semibold text-sm rounded-xl shadow-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-60"
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <FiSave size={16} />
          )}
          {isSaving ? "Đang lưu..." : "Lưu cấu hình"}
        </button>
      </div>
    </div>
  );
};

function ToggleItem({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-2.5 px-1 border-b border-slate-50 last:border-0">
      <div className="pr-4">
        <span className="text-sm font-semibold text-slate-700">{label}</span>
        <p className="text-[11px] text-slate-400 mt-0.5">{description}</p>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 ${
          checked ? "bg-brand" : "bg-slate-200"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
