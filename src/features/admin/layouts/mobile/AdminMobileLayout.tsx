import ScrollableContent from "@/shared/ui/layout/ScrollableContent";
import { useRef } from "react";
import { AdminMobileBottomNav } from "./AdminMobileBottomNav";
import { AdminMobileHeader } from "./AdminMobileHeader";

type AdminMobileLayoutProps = {
  children: React.ReactNode;
};

export const AdminMobileLayout = ({ children }: AdminMobileLayoutProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-50 overflow-hidden">
      <AdminMobileHeader />

      <ScrollableContent
        ref={scrollRef}
        className="w-full pt-14! pb-20!"
      >
        {children}
      </ScrollableContent>

      <AdminMobileBottomNav />
    </div>
  );
};
