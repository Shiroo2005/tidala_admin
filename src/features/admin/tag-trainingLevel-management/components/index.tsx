import { useGetTraininLevelList } from "@/features/search-teacher/hooks/useGetTrainingLevelList";
import { useGetAllTags } from "@/shared/hooks/useGetAllTags";
import type { TrainingLevel } from "@/shared/types/common.type";
import type { Tag } from "@/shared/types/tag.type";
import { AdminBreadcrumbs } from "@/shared/ui/navigation/AdminBreadcrumbs";
import { Button } from "@/shared/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { CreateTagsDialog } from "./create-tags-dialog";
import { CreateTrainingLevelsDialog } from "./create-trainingLevels-dialog";
import { DeleteTagDialog } from "./delete-tag-dialog";
import { DeleteTrainingLevelDialog } from "./delete-traininLevel-dialog";
import { EditTagDialog } from "./edit-tag-dialog";
import { EditTrainingLevelDialog } from "./edit-trainingLevel-dialog";
import { TagList } from "./tag-list";
import {
  TagTrainingLevelManagementTabs,
  type TagTrainingLevelManagementTabValue,
} from "./tag-trainingLevel-management-tabs";
import { TrainingLevelList } from "./trainingLevels-list";

export const TagTrainingLevelManagement = () => {
  const [activeTab, setActiveTab] =
    useState<TagTrainingLevelManagementTabValue>("tags");
  const [createTagsOpen, setCreateTagsOpen] = useState(false);
  const [createLevelsOpen, setCreateLevelsOpen] = useState(false);

  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [editingLevel, setEditingLevel] = useState<TrainingLevel | null>(null);
  const [deletingTag, setDeletingTag] = useState<Tag | null>(null);
  const [deletingLevel, setDeletingLevel] = useState<TrainingLevel | null>(
    null,
  );

  const { tags = [], isLoadingTags } = useGetAllTags();
  const { traningLevels = [], isLoadingTraningLevel } = useGetTraininLevelList();

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Breadcrumb section */}
      <div>
        <AdminBreadcrumbs />
      </div>

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-app-text">Thẻ & Hạng đào tạo</h1>
          <p className="text-sm text-app-text-muted mt-1">
            Quản lý danh sách thẻ và hạng đào tạo trong hệ thống
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end min-w-[140px]">
          {activeTab === "tags" && (
            <Button
              size="lg"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => setCreateTagsOpen(true)}
              className="bg-brand hover:bg-brand-hover text-white font-semibold rounded-xl px-5 h-10 shadow-sm border border-brand/10 transition-all duration-200 active:scale-[0.98]"
            >
              Tạo thẻ
            </Button>
          )}

          {activeTab === "levels" && (
            <Button
              size="lg"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => setCreateLevelsOpen(true)}
              className="bg-brand hover:bg-brand-hover text-white font-semibold rounded-xl px-5 h-10 shadow-sm border border-brand/10 transition-all duration-200 active:scale-[0.98] whitespace-nowrap"
            >
              Tạo hạng đào tạo
            </Button>
          )}
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex justify-start">
        <TagTrainingLevelManagementTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* Tab content */}
      <div className="relative">
        {activeTab === "tags" && (
          <TagList
            tags={tags}
            isLoading={isLoadingTags}
            onEdit={setEditingTag}
            onDelete={setDeletingTag}
          />
        )}

        {activeTab === "levels" && (
          <TrainingLevelList
            levels={traningLevels}
            isLoading={isLoadingTraningLevel}
            onEdit={setEditingLevel}
            onDelete={setDeletingLevel}
          />
        )}
      </div>

      {/* Dialogs */}
      <CreateTagsDialog
        open={createTagsOpen}
        onClose={() => setCreateTagsOpen(false)}
      />
      <CreateTrainingLevelsDialog
        open={createLevelsOpen}
        onClose={() => setCreateLevelsOpen(false)}
      />
      <EditTagDialog
        open={!!editingTag}
        onClose={() => setEditingTag(null)}
        tag={editingTag}
      />
      <DeleteTagDialog
        open={!!deletingTag}
        onClose={() => setDeletingTag(null)}
        tag={deletingTag}
      />
      <EditTrainingLevelDialog
        open={!!editingLevel}
        onClose={() => setEditingLevel(null)}
        level={editingLevel}
      />
      <DeleteTrainingLevelDialog
        open={!!deletingLevel}
        onClose={() => setDeletingLevel(null)}
        level={deletingLevel}
      />
    </div>
  );
};

export default TagTrainingLevelManagement;
