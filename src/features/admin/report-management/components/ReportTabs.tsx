export type ReportTabType = "teacher" | "review" | "post";

interface ReportTabsProps {
  activeTab: ReportTabType;
  onTabChange: (tab: ReportTabType) => void;
}

const TABS: { key: ReportTabType; label: string }[] = [
  { key: "teacher", label: "Báo cáo giáo viên" },
  { key: "review", label: "Báo cáo đánh giá" },
  { key: "post", label: "Báo cáo bài viết" },
];

export const ReportTabs = ({ activeTab, onTabChange }: ReportTabsProps) => {
  return (
    <div className="inline-flex items-center bg-slate-100 rounded-xl p-1 gap-0.5">
      {TABS.map((tab) => {
        const isActive = tab.key === activeTab;
        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`
              relative px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-250 ease-out
              ${
                isActive
                  ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/60"
                  : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
              }
            `}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};
