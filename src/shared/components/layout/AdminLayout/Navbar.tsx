import { imageUrls } from "@/shared/constants/imageUrls";
import { useAuth } from "@/features/auth/providers/useAuth";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { APP_PATHS } from "@/shared/constants/appPaths";
import { getStorageUrl } from "@/shared/utils/url";
import {
  FiBell,
  FiChevronDown,
  FiLogOut,
  FiMenu,
  FiSearch,
  // FiSettings,
  FiX,
  FiGrid,
  FiShield,
  FiUsers,
  FiDatabase,
  FiMessageSquare,
  FiHome,
} from "react-icons/fi";

type Props = {
  onToggleSidebar: () => void;
};

interface SearchFeature {
  name: string;
  keywords: string[];
  path: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  description: string;
  category: string;
}

const SEARCH_FEATURES: SearchFeature[] = [
  {
    name: "Tổng quan Dashboard",
    keywords: ["tong quan", "dashboard", "thong ke", "bieu do", "overview", "metric"],
    path: APP_PATHS.ADMIN_DASHBOARD,
    icon: FiGrid,
    description: "Xem báo cáo thống kê, biểu đồ hoạt động hệ thống",
    category: "Hệ thống",
  },
  {
    name: "Quản lý Giáo viên",
    keywords: ["giao vien", "teacher", "danh sach", "loc", "phe duyet", "danh gia"],
    path: APP_PATHS.ADMIN_TEACHERS,
    icon: FiShield,
    description: "Quản lý hồ sơ, duyệt và mời giáo viên mới",
    category: "Thành viên",
  },
  {
    name: "Mời Giáo viên mới",
    keywords: ["invite", "moi giao vien", "tao giao vien", "them moi"],
    path: APP_PATHS.ADMIN_TEACHER_INVITE,
    icon: FiShield,
    description: "Tạo tài khoản và gửi lời mời cho giáo viên mới",
    category: "Thành viên",
  },
  {
    name: "Quản lý Học sinh",
    keywords: ["hoc sinh", "student", "danh sach", "khoa tai khoan"],
    path: APP_PATHS.ADMIN_STUDENTS,
    icon: FiUsers,
    description: "Quản lý thông tin, trạng thái học sinh",
    category: "Thành viên",
  },
  {
    name: "Thẻ & Hạng đào tạo",
    keywords: ["the", "hang dao tao", "tag", "training level", "metadata"],
    path: APP_PATHS.ADMIN_METADATA,
    icon: FiDatabase,
    description: "Cấu hình danh mục thẻ và các hạng đào tạo lái xe",
    category: "Danh mục",
  },
  {
    name: "Quản lý Bài đăng",
    keywords: ["bai dang", "post", "dien dan", "forum", "kiem duyet"],
    path: APP_PATHS.ADMIN_POSTS,
    icon: FiMessageSquare,
    description: "Quản lý bài viết chia sẻ, hỏi đáp của người dùng",
    category: "Nội dung",
  },
  // {
  //   name: "Cài đặt hệ thống",
  //   keywords: ["cai dat", "settings", "cau hinh", "chung", "bao tri"],
  //   path: "/admin/settings",
  //   icon: FiSettings,
  //   description: "Thiết lập thông tin chung, múi giờ, chế độ bảo trì",
  //   category: "Cấu hình",
  // },
  // {
  //   name: "Vai trò & Phân quyền",
  //   keywords: ["vai tro", "role", "phan quyen", "permission", "admin"],
  //   path: "/admin/settings",
  //   icon: FiShield,
  //   description: "Thiết lập quyền hạn cho Manager, Moderator, Admin",
  //   category: "Cấu hình",
  // },
];

const removeAccents = (str: string) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};

export default function Navbar({ onToggleSidebar }: Props) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const appUser = user?.appUser;

  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchFeature[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Search filter logic
  useEffect(() => {
    if (!searchQuery.trim()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSearchResults([]);
      return;
    }

    const queryClean = removeAccents(searchQuery);
    const filtered = SEARCH_FEATURES.filter((feature) => {
      const nameClean = removeAccents(feature.name);
      const descClean = removeAccents(feature.description);
      const categoryClean = removeAccents(feature.category);
      
      const matchName = nameClean.includes(queryClean);
      const matchDesc = descClean.includes(queryClean);
      const matchCategory = categoryClean.includes(queryClean);
      const matchKeywords = feature.keywords.some((kw) =>
        removeAccents(kw).includes(queryClean)
      );

      return matchName || matchDesc || matchCategory || matchKeywords;
    });

    setSearchResults(filtered);
    setSelectedIndex(0);
  }, [searchQuery]);

  const handleSelectFeature = (feature: SearchFeature) => {
    navigate(feature.path);
    setSearchQuery("");
    setSearchFocused(false);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (searchResults.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % searchResults.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + searchResults.length) % searchResults.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSelectFeature(searchResults[selectedIndex]);
    } else if (e.key === "Escape") {
      setSearchFocused(false);
    }
  };

  const toggleAccountDropdown = () => {
    setAccountDropdownOpen((prev) => !prev);
  };

  const closeAccountDropdown = () => {
    setAccountDropdownOpen(false);
  };

  // const navigateToSettings = () => {
  //   navigate("/admin/settings");
  //   closeAccountDropdown();
  // };

  const handleLogout = async () => {
    try {
      await logout();
      closeAccountDropdown();
      navigate(APP_PATHS.LOGIN);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeAccountDropdown();
      }
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeAccountDropdown();
        setSearchFocused(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Automatically scroll active search item into view when navigating with keyboard
  useEffect(() => {
    if (searchResults.length === 0) return;
    const selectedEl = document.getElementById(`search-item-${selectedIndex}`);
    if (selectedEl) {
      selectedEl.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex, searchResults]);

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200/60 transition-all duration-300">
      <div className="px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* LEFT SECTION */}
          <div className="flex items-center gap-3 flex-1">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-800 transition-all duration-200 active:scale-95"
              aria-label="Toggle menu"
            >
              <FiMenu size={22} />
            </button>

            {/* Search Desktop with Command/Feature Results Dropdown */}
            <div ref={searchContainerRef} className="hidden md:block max-w-md w-full relative z-50">
              <div className="relative group">
                <div
                  className={`absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none transition-colors duration-200 ${
                    searchFocused ? "text-brand" : "text-slate-400"
                  }`}
                >
                  <FiSearch size={17} />
                </div>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onKeyDown={handleSearchKeyDown}
                  type="text"
                  placeholder="Tìm kiếm tính năng, quản lý..."
                  className="block w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200/80 text-slate-900 rounded-xl focus:ring-2 focus:ring-brand/15 focus:border-brand/40 focus:bg-white focus:shadow-sm transition-all duration-200 outline-none placeholder:text-slate-400"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    <FiX size={15} />
                  </button>
                )}
              </div>

              {/* Floating search dropdown */}
              {searchFocused && searchQuery.trim() !== "" && (
                <div className="absolute left-0 mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-2 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200 max-h-[360px] overflow-y-auto custom-scrollbar">
                  <div className="px-3 py-1.5 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Kết quả tìm kiếm ({searchResults.length})
                    </span>
                    <span className="text-[9px] font-medium text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md">
                      ↑↓ Di chuyển • Enter Chọn
                    </span>
                  </div>

                  {searchResults.length > 0 ? (
                    <div className="p-1 space-y-0.5">
                      {searchResults.map((feature, idx) => {
                        const Icon = feature.icon;
                        const isSelected = selectedIndex === idx;
                        return (
                          <button
                            key={feature.name + feature.path}
                            id={`search-item-${idx}`}
                            onClick={() => handleSelectFeature(feature)}
                            onMouseEnter={() => setSelectedIndex(idx)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150 group cursor-pointer ${
                              isSelected
                                ? "bg-brand/[0.06] text-brand"
                                : "hover:bg-slate-50 text-slate-700"
                            }`}
                          >
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-150 ${
                                isSelected
                                  ? "bg-brand/10 text-brand"
                                  : "bg-slate-100 text-slate-400 group-hover:bg-slate-200/80 group-hover:text-slate-600"
                              }`}
                            >
                              <Icon size={15} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between">
                                <span className={`text-xs font-semibold ${isSelected ? "text-brand" : "text-slate-800"}`}>
                                  {feature.name}
                                </span>
                                <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md uppercase">
                                  {feature.category}
                                </span>
                              </div>
                              <p className={`text-[10px] truncate mt-0.5 ${isSelected ? "text-brand/70" : "text-slate-400"}`}>
                                {feature.description}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-8 px-4 text-center">
                      <FiSearch size={22} className="mx-auto text-slate-300 mb-2" />
                      <p className="text-xs font-semibold text-slate-500">
                        Không tìm thấy tính năng nào
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Hãy thử gõ từ khóa khác như "giao vien", "cai dat", "bai dang"...
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            {/* Go to Homepage Button */}
            <Link
              to={APP_PATHS.HOME}
              className="flex items-center gap-1.5 p-2 px-3 text-slate-500 hover:text-slate-800 hover:bg-slate-100/80 rounded-xl transition-all duration-200 active:scale-95 text-xs font-semibold group"
              title="Quay lại trang chủ người dùng"
            >
              <FiHome size={18} className="text-slate-400 group-hover:text-slate-800 transition-colors" />
              <span className="hidden sm:inline">Về trang chủ</span>
            </Link>

            {/* Notification Bell */}
            <button
              className="relative p-2.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100/80 rounded-xl transition-all duration-200 active:scale-95"
              aria-label="Notifications"
            >
              <FiBell size={19} />
              <span className="absolute top-2 right-2 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500 ring-2 ring-white"></span>
              </span>
            </button>

            <div className="h-7 w-px bg-slate-200/80 mx-0.5 hidden sm:block" />

            {/* Account Panel */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleAccountDropdown}
                className={`flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-xl transition-all duration-200 active:scale-[0.98] ${
                  accountDropdownOpen
                    ? "bg-slate-100 border-slate-200 shadow-sm"
                    : "hover:bg-slate-50 border-transparent hover:border-slate-200/60"
                } border`}
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand/20 to-brand/5 text-brand flex items-center justify-center shrink-0 overflow-hidden ring-1 ring-slate-200/60">
                  <img
                    src={getStorageUrl(appUser?.avatarUrl) || imageUrls.fallback.avatar}
                    alt={appUser?.fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <span className="hidden sm:block text-sm font-semibold text-slate-700 max-w-[120px] truncate">
                    {appUser?.fullName || "Administrator"}
                  </span>
                  <FiChevronDown
                    size={15}
                    className={`hidden sm:block text-slate-400 transition-transform duration-300 ease-out ${accountDropdownOpen ? "rotate-180" : ""}`}
                  />
                </div>
              </button>

              {/* Dropdown Menu */}
              <div
                className={`absolute right-0 mt-2 w-64 bg-white border border-slate-200/80 rounded-xl shadow-lg shadow-slate-200/50 z-50 overflow-hidden transition-all duration-200 origin-top-right ${
                  accountDropdownOpen
                    ? "opacity-100 scale-100 translate-y-0"
                    : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
                }`}
              >
                {/* User Info Header */}
                <div className="px-4 py-3.5 bg-gradient-to-br from-slate-50 to-white border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden ring-2 ring-white shadow-sm shrink-0">
                      <img
                        src={
                          getStorageUrl(appUser?.avatarUrl) || imageUrls.fallback.avatar
                        }
                        alt={appUser?.fullName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="overflow-hidden">
                      <p
                        className="text-sm font-semibold text-slate-800 truncate"
                        title={appUser?.fullName}
                      >
                        {appUser?.fullName || "Admin Account"}
                      </p>
                      <p
                        className="text-xs text-slate-500 truncate"
                        title={appUser?.email}
                      >
                        {appUser?.email || "admin@tidala.vn"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-1.5 px-1.5 flex flex-col gap-0.5">
                  <Link
                    to={APP_PATHS.HOME}
                    onClick={closeAccountDropdown}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-all duration-150 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-slate-200/70 flex items-center justify-center transition-colors duration-150">
                      <FiHome
                        size={15}
                        className="text-slate-500 group-hover:text-slate-700 transition-colors"
                      />
                    </div>
                    <div className="text-left">
                      <span className="font-medium text-slate-700 group-hover:text-slate-900">Về trang chủ</span>
                      <p className="text-[11px] text-slate-400 -mt-0.5">
                        Quay lại trang người dùng
                      </p>
                    </div>
                  </Link>

                  {/* <button
                    onClick={navigateToSettings}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-all duration-150 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-slate-200/70 flex items-center justify-center transition-colors duration-150">
                      <FiSettings
                        size={15}
                        className="text-slate-500 group-hover:text-slate-700 transition-colors"
                      />
                    </div>
                    <div className="text-left">
                      <span className="font-medium">Cài đặt hệ thống</span>
                      <p className="text-[11px] text-slate-400 -mt-0.5">
                        Quản lý cấu hình
                      </p>
                    </div>
                  </button> */}

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-all duration-150 group mt-0.5"
                  >
                    <div className="w-8 h-8 rounded-lg bg-red-50 group-hover:bg-red-100 flex items-center justify-center transition-colors duration-150">
                      <FiLogOut size={15} />
                    </div>
                    <span className="font-medium">Đăng xuất</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Mobile */}
        <div className="md:hidden pb-3">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
              <FiSearch size={17} />
            </div>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
              placeholder="Tìm kiếm..."
              className="block w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200/80 text-slate-900 rounded-xl focus:ring-2 focus:ring-brand/15 focus:border-brand/40 focus:bg-white outline-none transition-all duration-200 placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
