import { useState } from "react";
import { FiSave, FiGlobe, FiMail, FiClock } from "react-icons/fi";

interface GeneralConfig {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  timezone: string;
  language: string;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  requireEmailVerification: boolean;
}

const DEFAULT_CONFIG: GeneralConfig = {
  siteName: "Tidala",
  siteDescription:
    "Nền tảng kết nối học sinh với giáo viên chất lượng",
  contactEmail: "admin@tidala.vn",
  timezone: "Asia/Ho_Chi_Minh",
  language: "vi",
  maintenanceMode: false,
  allowRegistration: true,
  requireEmailVerification: true,
};

export const GeneralSettings = () => {
  const [config, setConfig] = useState<GeneralConfig>(DEFAULT_CONFIG);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  const updateConfig = <K extends keyof GeneralConfig>(
    key: K,
    value: GeneralConfig[K]
  ) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 800));
    setIsSaving(false);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Section: Thông tin hệ thống */}
      <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <FiGlobe size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Thông tin hệ thống
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Cấu hình tên, mô tả và thông tin liên hệ của hệ thống
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Site Name */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
            <label className="text-sm font-semibold text-slate-700 pt-2.5">
              Tên hệ thống
              <span className="text-red-400 ml-0.5">*</span>
            </label>
            <div className="md:col-span-2">
              <input
                type="text"
                value={config.siteName}
                onChange={(e) => updateConfig("siteName", e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200/80 rounded-xl focus:ring-2 focus:ring-brand/15 focus:border-brand/40 focus:bg-white transition-all duration-200 outline-none text-slate-900"
                placeholder="Nhập tên hệ thống"
              />
              <p className="text-[11px] text-slate-400 mt-1.5">
                Tên hiển thị trên tiêu đề trang web và email
              </p>
            </div>
          </div>

          {/* Site Description */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
            <label className="text-sm font-semibold text-slate-700 pt-2.5">
              Mô tả hệ thống
            </label>
            <div className="md:col-span-2">
              <textarea
                value={config.siteDescription}
                onChange={(e) =>
                  updateConfig("siteDescription", e.target.value)
                }
                rows={3}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200/80 rounded-xl focus:ring-2 focus:ring-brand/15 focus:border-brand/40 focus:bg-white transition-all duration-200 outline-none text-slate-900 resize-none"
                placeholder="Mô tả ngắn về hệ thống"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section: Liên hệ & Khu vực */}
      <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <FiMail size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Liên hệ & Khu vực
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Email liên hệ, múi giờ và ngôn ngữ mặc định
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Contact Email */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
            <label className="text-sm font-semibold text-slate-700 pt-2.5">
              Email liên hệ
              <span className="text-red-400 ml-0.5">*</span>
            </label>
            <div className="md:col-span-2">
              <input
                type="email"
                value={config.contactEmail}
                onChange={(e) => updateConfig("contactEmail", e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200/80 rounded-xl focus:ring-2 focus:ring-brand/15 focus:border-brand/40 focus:bg-white transition-all duration-200 outline-none text-slate-900"
                placeholder="admin@tidala.vn"
              />
            </div>
          </div>

          {/* Timezone */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
            <label className="text-sm font-semibold text-slate-700 pt-2.5">
              <span className="flex items-center gap-1.5">
                <FiClock size={14} className="text-slate-400" />
                Múi giờ
              </span>
            </label>
            <div className="md:col-span-2">
              <select
                value={config.timezone}
                onChange={(e) => updateConfig("timezone", e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200/80 rounded-xl focus:ring-2 focus:ring-brand/15 focus:border-brand/40 focus:bg-white transition-all duration-200 outline-none text-slate-900 cursor-pointer"
              >
                <option value="Asia/Ho_Chi_Minh">
                  (UTC+07:00) Hồ Chí Minh
                </option>
                <option value="Asia/Bangkok">(UTC+07:00) Bangkok</option>
                <option value="Asia/Singapore">(UTC+08:00) Singapore</option>
                <option value="Asia/Tokyo">(UTC+09:00) Tokyo</option>
              </select>
            </div>
          </div>

          {/* Language */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
            <label className="text-sm font-semibold text-slate-700 pt-2.5">
              Ngôn ngữ mặc định
            </label>
            <div className="md:col-span-2">
              <select
                value={config.language}
                onChange={(e) => updateConfig("language", e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200/80 rounded-xl focus:ring-2 focus:ring-brand/15 focus:border-brand/40 focus:bg-white transition-all duration-200 outline-none text-slate-900 cursor-pointer"
              >
                <option value="vi">🇻🇳 Tiếng Việt</option>
                <option value="en">🇺🇸 English</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Section: Tùy chọn nâng cao */}
      <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <FiClock size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Tùy chọn nâng cao
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Bảo trì, đăng ký và xác minh email
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Maintenance Mode */}
          <ToggleRow
            label="Chế độ bảo trì"
            description="Tạm thời ngắt truy cập cho người dùng thông thường"
            checked={config.maintenanceMode}
            onChange={(v) => updateConfig("maintenanceMode", v)}
            accentColor="rose"
          />

          {/* Allow Registration */}
          <ToggleRow
            label="Cho phép đăng ký"
            description="Người dùng mới có thể tạo tài khoản"
            checked={config.allowRegistration}
            onChange={(v) => updateConfig("allowRegistration", v)}
            accentColor="blue"
          />

          {/* Require Email Verification */}
          <ToggleRow
            label="Yêu cầu xác minh email"
            description="Người dùng phải xác minh email trước khi sử dụng hệ thống"
            checked={config.requireEmailVerification}
            onChange={(v) => updateConfig("requireEmailVerification", v)}
            accentColor="emerald"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {showSaved && (
          <span className="text-sm text-emerald-600 font-medium animate-in fade-in slide-in-from-right-2 duration-300">
            ✓ Đã lưu thành công
          </span>
        )}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand hover:bg-brand-hover text-white font-semibold text-sm rounded-xl shadow-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <FiSave size={16} />
          )}
          {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </div>
    </div>
  );
};

// ── Reusable Toggle Row Component ──
function ToggleRow({
  label,
  description,
  checked,
  onChange,
  accentColor = "blue",
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  accentColor?: "blue" | "emerald" | "rose";
}) {
  const dotColor = {
    blue: "bg-blue-500",
    emerald: "bg-emerald-500",
    rose: "bg-rose-500",
  }[accentColor];

  return (
    <div className="flex items-center justify-between py-3 px-1 group">
      <div className="flex items-center gap-3">
        <span className={`w-2 h-2 rounded-full ${dotColor} shrink-0`} />
        <div>
          <span className="text-sm font-semibold text-slate-700">{label}</span>
          <p className="text-[11px] text-slate-400">{description}</p>
        </div>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
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
