import { useAuth } from '@/features/auth/providers/useAuth';
import { Link } from 'react-router-dom';
import { FiLogOut, FiSettings } from 'react-icons/fi';
import { APP_PATHS } from '@/shared/constants/appPaths';
export const AdminProfilePage = () => {
    const { user, logout } = useAuth();
    return <div className="space-y-6 p-4">
  <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
   <img src={user?.appUser.avatarUrl || '/demo/avatar.svg'} alt="" className="mb-4 h-16 w-16 rounded-xl"/>
   <h1 className="text-xl font-bold text-app-text">{user?.appUser.fullName}</h1>
   <p className="mt-1 text-sm text-slate-500">{user?.appUser.email}</p>
   <span className="mt-3 inline-block rounded-lg bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">Quản trị viên</span>
  </div>
  <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
   <Link to={APP_PATHS.ADMIN_SETTINGS} className="flex items-center gap-3 border-b border-slate-100 p-4 text-sm font-medium"><FiSettings />Cài đặt & Vai trò</Link>
   <button onClick={() => void logout()} className="flex w-full items-center gap-3 p-4 text-sm font-medium text-red-600"><FiLogOut />Đăng xuất</button>
  </div>
 </div>;
};
