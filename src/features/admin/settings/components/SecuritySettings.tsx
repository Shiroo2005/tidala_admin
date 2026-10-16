import { useState } from "react";
import { FiSave, FiLock, FiShield, FiKey } from "react-icons/fi";

export const SecuritySettings = () => {
  const [sessionTimeout, setSessionTimeout] = useState("60");
  const [minPasswordLength, setMinPasswordLength] = useState("8");
  const [mfaRequired, setMfaRequired] = useState(false);
  const [restrictIps, setRestrictIps] = useState(false);
  const [ipList, setIpList] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setIsSaving(false);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Password & Authentication Policy */}
      <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <FiLock size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Chính sách bảo mật mật khẩu</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Thiết lập độ phức tạp của mật khẩu và quy trình đăng nhập
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Min Length */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
            <label className="text-sm font-semibold text-slate-700">
              Độ dài mật khẩu tối thiểu
            </label>
            <div className="md:col-span-2">
              <select
                value={minPasswordLength}
                onChange={(e) => setMinPasswordLength(e.target.value)}
                className="w-full max-w-[200px] px-4 py-2.5 text-sm bg-slate-50 border border-slate-200/80 rounded-xl focus:ring-2 focus:ring-brand/15 focus:border-brand/40 focus:bg-white transition-all duration-200 outline-none text-slate-900 cursor-pointer"
              >
                <option value="6">6 ký tự</option>
                <option value="8">8 ký tự (Khuyên dùng)</option>
                <option value="10">10 ký tự</option>
                <option value="12">12 ký tự</option>
              </select>
            </div>
          </div>

          {/* Session Expire */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
            <label className="text-sm font-semibold text-slate-700">
              Thời gian hết hạn phiên
            </label>
            <div className="md:col-span-2">
              <select
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(e.target.value)}
                className="w-full max-w-[200px] px-4 py-2.5 text-sm bg-slate-50 border border-slate-200/80 rounded-xl focus:ring-2 focus:ring-brand/15 focus:border-brand/40 focus:bg-white transition-all duration-200 outline-none text-slate-900 cursor-pointer"
              >
                <option value="15">15 phút</option>
                <option value="30">30 phút</option>
                <option value="60">1 giờ</option>
                <option value="1440">1 ngày</option>
              </select>
            </div>
          </div>

          <div className="h-px bg-slate-100 my-2" />

          {/* MFA Toggle */}
          <div className="flex items-center justify-between py-1 px-1">
            <div>
              <span className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                <FiKey size={14} className="text-slate-400" />
                Yêu cầu xác thực 2 lớp (MFA)
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Tất cả tài khoản quản trị viên và Manager bắt buộc cài đặt OTP khi đăng nhập
              </p>
            </div>
            <button
              role="switch"
              aria-checked={mfaRequired}
              onClick={() => setMfaRequired(!mfaRequired)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 ${
                mfaRequired ? "bg-brand" : "bg-slate-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ${
                  mfaRequired ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Network Security */}
      <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <FiShield size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Bảo mật mạng & IP</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Giới hạn dải IP có quyền truy cập vào trang điều khiển Admin
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between py-1 px-1">
            <div>
              <span className="text-sm font-semibold text-slate-700">
                Kích hoạt giới hạn địa chỉ IP
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Chỉ cho phép các địa chỉ IP được liệt kê truy cập vào trang Admin
              </p>
            </div>
            <button
              role="switch"
              aria-checked={restrictIps}
              onClick={() => setRestrictIps(!restrictIps)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 ${
                restrictIps ? "bg-brand" : "bg-slate-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ${
                  restrictIps ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {restrictIps && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start animate-in fade-in slide-in-from-top-2 duration-300 mt-2">
              <label className="text-sm font-semibold text-slate-700 pt-2">
                Danh sách IP trắng (Whitelist)
              </label>
              <div className="md:col-span-2">
                <textarea
                  value={ipList}
                  onChange={(e) => setIpList(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200/80 rounded-xl focus:ring-2 focus:ring-brand/15 focus:border-brand/40 focus:bg-white transition-all duration-200 outline-none text-slate-900 resize-none font-mono"
                  placeholder="Mỗi IP một dòng, VD: 192.168.1.100"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-3">
        {showSaved && (
          <span className="text-sm text-emerald-600 font-medium animate-in fade-in duration-300">
            ✓ Đã lưu cài đặt bảo mật
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
          {isSaving ? "Đang lưu..." : "Lưu bảo mật"}
        </button>
      </div>
    </div>
  );
};
