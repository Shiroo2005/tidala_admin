import * as React from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { MdHome } from "react-icons/md";
import { APP_PATHS } from "@/shared/constants/appPaths";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/components/ui/breadcrumb";

// Cấu hình map các URL slug → nhãn tiếng Việt (khớp với appPaths.ts)
const ROUTE_LABELS: Record<string, string> = {
  // Segments bị bỏ qua (trả về undefined → skip)
  "quan-tri": "",
  "tong-quan": "", // Dashboard đã đại diện bởi icon Home

  // Quản lý thành viên
  "giao-vien": "Quản lý Giáo viên",
  "hoc-vien": "Quản lý Học sinh",
  "nguoi-dung": "Quản lý Người dùng",

  // Sub-routes giáo viên
  "moi": "Mời Giáo viên mới",
  "chinh-sua": "Chỉnh sửa",

  // Nội dung & danh mục
  "bai-viet": "Quản lý Bài đăng",
  "cap-dao-tao": "Thẻ & Hạng đào tạo",
  "bao-cao": "Xử lý Báo cáo",

  // Hệ thống
  "cai-dat": "Cài đặt",
  "danh-gia": "Đánh giá",
  "ca-nhan": "Trang cá nhân",
};

export interface BreadcrumbItemData {
  label: string;
  path?: string;
  icon?: React.ReactNode;
}

interface AdminBreadcrumbsProps {
  /**
   * Truyền mảng items nếu muốn custom breadcrumb.
   * Nếu không truyền, component sẽ tự động build từ url hiện tại.
   */
  items?: BreadcrumbItemData[];
  /**
   * Hiển thị icon Home ở đầu (mặc định là true)
   */
  showHomeIcon?: boolean;
}

export const AdminBreadcrumbs = ({
  items,
  showHomeIcon = true,
}: AdminBreadcrumbsProps) => {
  const location = useLocation();

  // Hàm tự động tạo breadcrumb từ pathname hiện tại
  const buildAutoItems = (): BreadcrumbItemData[] => {
    const pathnames = location.pathname.split("/").filter(Boolean);
    const result: BreadcrumbItemData[] = [];
    let currentPath = "";

    // Regex nhận diện ID: MongoDB ObjectId (24 hex) hoặc UUID
    const ID_REGEX = /^[0-9a-f]{24}$|^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    pathnames.forEach((name, index) => {
      currentPath += `/${name}`;

      // Bỏ qua "quan-tri" (segment gốc admin) và "tong-quan" (đại diện bởi icon Home)
      const labelValue = ROUTE_LABELS[name];
      if (labelValue === "") return;

      let label: string;

      if (labelValue) {
        // Có label được cấu hình sẵn
        label = labelValue;
      } else if (ID_REGEX.test(name)) {
        // Là ID động → dùng nhãn "Chi tiết" theo segment cha
        const parentSegment = pathnames[index - 1];
        const parentLabel = ROUTE_LABELS[parentSegment];
        if (parentLabel) {
          label = `Chi tiết ${parentLabel.replace(/^Quản lý /, "")}`;
        } else {
          label = "Chi tiết";
        }
      } else {
        // Fallback cho các slug không được map (không nên xảy ra)
        label = name.charAt(0).toUpperCase() + name.slice(1);
      }

      result.push({
        label,
        // Nếu là item cuối cùng thì không cho click
        path: index === pathnames.length - 1 ? undefined : currentPath,
      });
    });

    return result;
  };

  const breadcrumbItems = items || buildAutoItems();

  // Nếu không có item nào và cũng không được hiện icon Home thì render null
  if (breadcrumbItems.length === 0 && !showHomeIcon) return null;

  const isDashboard =
    location.pathname === APP_PATHS.ADMIN_DASHBOARD ||
    location.pathname === APP_PATHS.ADMIN ||
    location.pathname === `${APP_PATHS.ADMIN}/`;

  const hasItems = breadcrumbItems.length > 0;

  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        {showHomeIcon && (
          <>
            <BreadcrumbItem>
              {isDashboard ? (
                <span className="flex items-center text-app-text-muted/80">
                  <MdHome className="h-4.5 w-4.5" />
                </span>
              ) : (
                <BreadcrumbLink asChild>
                  <RouterLink
                    to={APP_PATHS.ADMIN_DASHBOARD}
                    className="flex items-center text-app-text-muted/80 hover:text-brand transition-colors"
                  >
                    <MdHome className="h-4.5 w-4.5" />
                  </RouterLink>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {hasItems && <BreadcrumbSeparator />}
          </>
        )}

        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;

          return (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {isLast || !item.path ? (
                  <BreadcrumbPage className="flex items-center gap-1 font-semibold text-app-text">
                    {item.icon && (
                      <span className="flex shrink-0">{item.icon}</span>
                    )}
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <RouterLink
                      to={item.path}
                      className="flex items-center gap-1 text-app-text-muted hover:text-brand transition-colors font-medium"
                    >
                      {item.icon && (
                        <span className="flex shrink-0">{item.icon}</span>
                      )}
                      {item.label}
                    </RouterLink>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
