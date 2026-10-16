import { createBrowserRouter, Navigate } from "react-router-dom";
import { adminRoute } from "./admin/admin.route";
import { LoginPage } from "@/pages/auth/LoginPage";
import NotFoundPage from "@/pages/error/NotFoundPage";
import { GuestRoute } from "./route-components/GuestRoute";
import { APP_PATHS } from "@/shared/constants/appPaths";
import { PublicSite } from "./PublicSite";
export const router = createBrowserRouter([
    { path: "/", element: <Navigate to={APP_PATHS.ADMIN_DASHBOARD} replace/> },
    { path: "/quan-tri", element: <Navigate to={APP_PATHS.ADMIN_DASHBOARD} replace/> },
    { path: APP_PATHS.LOGIN, element: <GuestRoute><LoginPage /></GuestRoute> },
    ...adminRoute,
    ...["/trang-chu", "/giao-vien/*", "/cam-nang/*", "/ho-tro/*", "/dang-ky", "/quen-mat-khau"].map(path => ({ path, element: <PublicSite /> })),
    { path: "*", element: <NotFoundPage /> },
]);
