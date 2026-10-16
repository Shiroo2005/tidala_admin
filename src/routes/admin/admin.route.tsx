import { AdminProfilePage } from "@/pages/admin/profile";
import { ReportManagement } from "@/features/admin/report-management/components";
import { AdminResponsiveLayout } from "@/features/admin/layouts/AdminResponsiveLayout";
import { MobileUserManagementPage } from "@/features/admin/user-management/MobileUserManagementPage";
import { AdminDashboardPage } from "@/pages/admin/dashboard/page";
import { PostDetailPage } from "@/pages/admin/posts/[id]/detail";
import { PostManagementPage } from "@/pages/admin/posts/page";
import { ReportManagementPage } from "@/pages/admin/reports/page";
import { StudentManagementPage } from "@/pages/admin/students/page";
import TagTrainingLevelManagementPage from "@/pages/admin/tag-trainingLevel/page";
import { TeacherEditPage } from "@/pages/admin/teachers/[id]/edit/page";
import { TeacherDetailPage } from "@/pages/admin/teachers/[id]/page";
import { TeacherInvitePage } from "@/pages/admin/teachers/invite/page";
import { TeacherManagementPage } from "@/pages/admin/teachers/page";
import { APP_PATHS } from "@/shared/constants/appPaths";
import { AdminSettingsPage } from "@/pages/admin/settings/page";

import { AdminRoute } from "./AdminRoute";

export const adminRoute = [
  {
    element: (
      <AdminRoute>
        <AdminResponsiveLayout />
      </AdminRoute>
    ),
    children: [
      { path: APP_PATHS.ADMIN_REVIEWS, element: <ReportManagement initialTab="review" /> },
      { path: APP_PATHS.ADMIN_PROFILE, element: <AdminProfilePage /> },
      {
        path: APP_PATHS.ADMIN_DASHBOARD,
        element: <AdminDashboardPage />,
      },
      {
        // Mobile-only unified user management (students + teachers + pending)
        path: APP_PATHS.ADMIN_USERS,
        element: <MobileUserManagementPage />,
      },
      {
        path: APP_PATHS.ADMIN_TEACHERS,
        element: <TeacherManagementPage />,
      },
      {
        path: APP_PATHS.ADMIN_STUDENTS,
        element: <StudentManagementPage />,
      },
      {
        path: APP_PATHS.ADMIN_METADATA,
        element: <TagTrainingLevelManagementPage />,
      },
      {
        path: APP_PATHS.ADMIN_POSTS,
        element: <PostManagementPage />,
      },
      {
        path: APP_PATHS.ADMIN_POST_DETAIL,
        element: <PostDetailPage />,
      },
      {
        path: APP_PATHS.ADMIN_REPORTS,
        element: <ReportManagementPage />,
      },
      {
        // Invite route MUST come before detail route since
        // /quan-tri/giao-vien/moi would otherwise match :teacherId
        path: APP_PATHS.ADMIN_TEACHER_INVITE,
        element: <TeacherInvitePage />,
      },
      {
        // Edit route MUST come before detail route since :teacherId/edit
        // is more specific than :teacherId
        path: APP_PATHS.ADMIN_TEACHER_EDIT,
        element: <TeacherEditPage />,
      },
      {
        path: APP_PATHS.ADMIN_SETTINGS,
        element: <AdminSettingsPage />,
      },
      {
        path: APP_PATHS.ADMIN_TEACHER_DETAIL,
        element: <TeacherDetailPage />,
      },
    ],
  },
];
