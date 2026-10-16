import { useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiShield, FiCheck, FiX } from "react-icons/fi";

interface Role {
  id: string;
  name: string;
  code: string;
  description: string;
  userCount: number;
  permissions: string[];
}

const ALL_PERMISSIONS = [
  { id: "users.view", name: "Xem người dùng", group: "Người dùng" },
  { id: "users.manage", name: "Quản lý người dùng", group: "Người dùng" },
  { id: "teachers.view", name: "Xem giáo viên", group: "Giáo viên" },
  { id: "teachers.manage", name: "Quản lý giáo viên", group: "Giáo viên" },
  { id: "posts.view", name: "Xem bài đăng", group: "Bài đăng" },
  { id: "posts.manage", name: "Quản lý bài đăng", group: "Bài đăng" },
  { id: "settings.manage", name: "Quản lý cài đặt", group: "Hệ thống" },
];

const INITIAL_ROLES: Role[] = [
  {
    id: "1",
    name: "Administrator",
    code: "ADMIN",
    description: "Toàn quyền quản trị hệ thống và cấu hình kỹ thuật.",
    userCount: 3,
    permissions: ALL_PERMISSIONS.map((p) => p.id),
  },
  {
    id: "2",
    name: "Manager",
    code: "MANAGER",
    description: "Quản lý tài khoản giáo viên, học sinh và duyệt bài viết.",
    userCount: 5,
    permissions: ["users.view", "users.manage", "teachers.view", "teachers.manage", "posts.view", "posts.manage"],
  },
  {
    id: "3",
    name: "Moderator",
    code: "MODERATOR",
    description: "Kiểm duyệt nội dung bài viết và phản hồi báo cáo vi phạm.",
    userCount: 8,
    permissions: ["users.view", "teachers.view", "posts.view", "posts.manage"],
  },
];

export const RoleManagement = () => {
  const [roles, setRoles] = useState<Role[]>(INITIAL_ROLES);
  const [selectedRole, setSelectedRole] = useState<Role>(INITIAL_ROLES[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const handleTogglePermission = (permissionId: string) => {
    const isAssigned = selectedRole.permissions.includes(permissionId);
    let newPermissions: string[];

    if (isAssigned) {
      newPermissions = selectedRole.permissions.filter((p) => p !== permissionId);
    } else {
      newPermissions = [...selectedRole.permissions, permissionId];
    }

    const updatedRole = { ...selectedRole, permissions: newPermissions };
    setSelectedRole(updatedRole);
    setRoles((prev) => prev.map((r) => (r.id === selectedRole.id ? updatedRole : r)));
  };

  const handleStartEdit = () => {
    setEditName(selectedRole.name);
    setEditDesc(selectedRole.description);
    setIsEditing(true);
  };

  const handleSaveInfo = () => {
    const updatedRole = {
      ...selectedRole,
      name: editName,
      description: editDesc,
    };
    setSelectedRole(updatedRole);
    setRoles((prev) => prev.map((r) => (r.id === selectedRole.id ? updatedRole : r)));
    setIsEditing(false);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Left side: Role list */}
      <div className="xl:col-span-1 space-y-4">
        <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">Danh sách vai trò</h3>
            <button className="p-1.5 rounded-lg bg-brand/10 text-brand hover:bg-brand/20 transition-all duration-200 active:scale-95">
              <FiPlus size={16} />
            </button>
          </div>

          <div className="space-y-1.5">
            {roles.map((role) => {
              const isSelected = selectedRole.id === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => {
                    setSelectedRole(role);
                    setIsEditing(false);
                  }}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl text-left border transition-all duration-200 ${
                    isSelected
                      ? "bg-slate-50 border-slate-300 shadow-xs"
                      : "bg-white border-transparent hover:bg-slate-50/50 hover:border-slate-200"
                  }`}
                >
                  <div className="min-w-0">
                    <span className="block text-sm font-semibold text-slate-800">
                      {role.name}
                    </span>
                    <span className="block text-[11px] text-slate-400 mt-0.5 truncate">
                      {role.description}
                    </span>
                  </div>
                  <span className="shrink-0 ml-2 text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    {role.userCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right side: Permissions detail panel */}
      <div className="xl:col-span-2 space-y-4">
        <div className="bg-white rounded-2xl border border-slate-200/70 shadow-sm overflow-hidden">
          {/* Header Panel */}
          <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-brand/10 text-brand">
                <FiShield size={20} />
              </div>
              {isEditing ? (
                <div className="space-y-2 flex-1">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="block w-full px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-brand/50 font-bold"
                  />
                  <input
                    type="text"
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    className="block w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:border-brand/50 text-slate-500"
                    placeholder="Mô tả vai trò..."
                  />
                </div>
              ) : (
                <div>
                  <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                    {selectedRole.name}
                    <span className="text-[10px] tracking-wide font-bold bg-brand/[0.08] text-brand px-2 py-0.5 rounded-md uppercase">
                      {selectedRole.code}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {selectedRole.description}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 self-end md:self-auto">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSaveInfo}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                  >
                    <FiCheck size={14} />
                    Lưu
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                  >
                    <FiX size={14} />
                    Hủy
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleStartEdit}
                    className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Chỉnh sửa thông tin vai trò"
                  >
                    <FiEdit2 size={15} />
                  </button>
                  {selectedRole.code !== "ADMIN" && (
                    <button
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Xóa vai trò"
                    >
                      <FiTrash2 size={15} />
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Permissions Matrix */}
          <div className="p-6">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              Danh sách chức năng hệ thống
            </h4>

            <div className="space-y-6">
              {/* Group Permissions */}
              {Array.from(new Set(ALL_PERMISSIONS.map((p) => p.group))).map((groupName) => {
                const groupPermissions = ALL_PERMISSIONS.filter((p) => p.group === groupName);
                return (
                  <div key={groupName} className="space-y-2">
                    <h5 className="text-xs font-bold text-slate-700">{groupName}</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {groupPermissions.map((permission) => {
                        const isChecked = selectedRole.permissions.includes(permission.id);
                        const disabled = selectedRole.code === "ADMIN"; // Admin gets all automatically
                        return (
                          <div
                            key={permission.id}
                            onClick={() => !disabled && handleTogglePermission(permission.id)}
                            className={`flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 select-none ${
                              disabled
                                ? "bg-slate-50/50 border-slate-100 cursor-not-allowed opacity-80"
                                : "cursor-pointer bg-white"
                            } ${
                              isChecked
                                ? "border-brand/40 bg-brand/[0.02]"
                                : "border-slate-200/70 hover:border-slate-300"
                            }`}
                          >
                            <div>
                              <span className="block text-sm font-semibold text-slate-700">
                                {permission.name}
                              </span>
                              <span className="block text-[10px] text-slate-400">
                                Mã code: {permission.id}
                              </span>
                            </div>
                            <div
                              className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all duration-200 ${
                                isChecked
                                  ? "bg-brand border-brand text-white"
                                  : "border-slate-300 bg-white"
                              }`}
                            >
                              {isChecked && <FiCheck size={12} />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
