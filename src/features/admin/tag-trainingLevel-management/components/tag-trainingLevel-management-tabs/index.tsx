import { Hash, Layers } from "lucide-react";

export type TagTrainingLevelManagementTabValue = "tags" | "levels";

interface TagTrainingLevelManagementTabsProps {
  activeTab: TagTrainingLevelManagementTabValue;
  onTabChange: (tab: TagTrainingLevelManagementTabValue) => void;
}

export const TagTrainingLevelManagementTabs = ({
  activeTab,
  onTabChange,
}: TagTrainingLevelManagementTabsProps) => {
  return (
    <div className="inline-flex items-center gap-1 rounded-xl bg-slate-100 p-1 border border-slate-200/60 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.03)]">
      <button
        type="button"
        id="metadata-tab-tags"
        onClick={() => onTabChange("tags")}
        className={`flex items-center gap-2 py-1.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer outline-none ${
          activeTab === "tags"
            ? "bg-white text-brand shadow-sm border border-slate-100"
            : "border-transparent text-app-text-muted hover:text-app-text"
        }`}
      >
        <Hash className="h-4 w-4" />
        Thẻ
      </button>
      <button
        type="button"
        id="metadata-tab-levels"
        onClick={() => onTabChange("levels")}
        className={`flex items-center gap-2 py-1.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer outline-none ${
          activeTab === "levels"
            ? "bg-white text-brand shadow-sm border border-slate-100"
            : "border-transparent text-app-text-muted hover:text-app-text"
        }`}
      >
        <Layers className="h-4 w-4" />
        Hạng đào tạo
      </button>
    </div>
  );
};
