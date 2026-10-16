import { AdminLayout as AdminDesktopLayout } from "@/shared/components/layout/AdminLayout";
import { useIsMobile } from "@/shared/hooks/useIsMobile";
import { Outlet } from "react-router-dom";
import { AdminMobileLayout } from "./mobile";

/**
 * Responsive layout wrapper for Admin routes.
 * Renders the mobile layout on small screens and the existing desktop layout on larger screens.
 */
export const AdminResponsiveLayout = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <AdminMobileLayout>
        <Outlet />
      </AdminMobileLayout>
    );
  }

  // Desktop: render existing AdminLayout (which already has its own <Outlet />)
  return <AdminDesktopLayout />;
};
