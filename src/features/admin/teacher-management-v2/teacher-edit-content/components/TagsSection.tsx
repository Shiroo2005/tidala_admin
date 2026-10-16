import { tagApi } from "@/shared/api/tag.api";
import type { Tag } from "@/shared/types/tag.type";
import { useQuery } from "@tanstack/react-query";
import React, { useState, useMemo, useRef, useEffect } from "react";
import { Check, ChevronsUpDown, Search, X, AlertCircle } from "lucide-react";
import type { TeachingInfoFormState } from "../../types";
import type { FormErrors } from "../hooks/useTeacherEditContent";
import { cn } from "@/shared/utils/cn";

interface Props {
  teachingInfoForm: TeachingInfoFormState;
  setTeacherProfileField: <K extends keyof TeachingInfoFormState>(
    key: K,
    value: TeachingInfoFormState[K],
  ) => void;
  formErrors?: FormErrors;
  registerFieldRef?: (key: string) => (el: HTMLElement | null) => void;
  clearError?: (key: keyof FormErrors) => void;
}

export const TagsSection = React.memo(
  ({
    teachingInfoForm,
    setTeacherProfileField,
    formErrors,
    registerFieldRef,
    clearError,
  }: Props) => {
    const { data: allTags = [], isLoading } = useQuery({
      queryKey: ["tags", "all"],
      queryFn: tagApi.getAllTags,
      staleTime: Infinity,
    });

    const containerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [localTagError, setLocalTagError] = useState<string | undefined>();
    const [touched, setTouched] = useState(false);

    const selectedTags = useMemo(() => {
      const specialty = teachingInfoForm.specialtyTags || [];
      const style = teachingInfoForm.styleTags || [];
      return [...specialty, ...style];
    }, [teachingInfoForm.specialtyTags, teachingInfoForm.styleTags]);

    const handleTagsChange = (newValue: Tag[]) => {
      const newSpecialty = newValue.filter((t) => t.type === "specialty");
      const newStyle = newValue.filter((t) => t.type === "style");

      setTeacherProfileField("specialtyTags", newSpecialty);
      setTeacherProfileField("styleTags", newStyle);

      // Clear parent formErrors for tags
      clearError?.("tags");
      setTouched(true);

      // Local validation
      const totalTags = newSpecialty.length + newStyle.length;
      if (newSpecialty.length === 0 || newStyle.length === 0) {
        setLocalTagError(
          "Vui lòng chọn ít nhất 1 thẻ chuyên môn và 1 thẻ phong cách",
        );
      } else if (totalTags > 3) {
        setLocalTagError("Tổng số thẻ không được vượt quá 3");
      } else {
        setLocalTagError(undefined);
      }
    };

    const handleSelectTag = (tag: Tag) => {
      const isSelected = selectedTags.some((t) => t.id === tag.id);
      let newTags: Tag[];
      if (isSelected) {
        newTags = selectedTags.filter((t) => t.id !== tag.id);
      } else {
        // Enforce maximum 3 tags limit before adding
        if (selectedTags.length >= 3) {
          setLocalTagError("Tổng số thẻ không được vượt quá 3");
          setTouched(true);
          return;
        }
        newTags = [...selectedTags, tag];
      }
      handleTagsChange(newTags);
    };

    const handleRemoveTag = (tag: Tag, e: React.MouseEvent) => {
      e.stopPropagation();
      const newTags = selectedTags.filter((t) => t.id !== tag.id);
      handleTagsChange(newTags);
    };

    // Close dropdown on outside click
    useEffect(() => {
      if (!open) return;

      const handleClickOutside = (event: MouseEvent | TouchEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("touchstart", handleClickOutside);
      };
    }, [open]);

    // Auto-focus search input when opening dropdown
    useEffect(() => {
      if (open) {
        const timer = setTimeout(() => searchInputRef.current?.focus(), 50);
        return () => clearTimeout(timer);
      } else {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSearch("");
      }
    }, [open]);

    // Filter tags by search and split by type
    const filteredSpecialtyTags = useMemo(() => {
      const sTags = allTags.filter((t) => t.type === "specialty");
      if (!search.trim()) return sTags;
      const q = search.toLowerCase();
      return sTags.filter((t) => t.name.toLowerCase().includes(q));
    }, [allTags, search]);

    const filteredStyleTags = useMemo(() => {
      const sTags = allTags.filter((t) => t.type === "style");
      if (!search.trim()) return sTags;
      const q = search.toLowerCase();
      return sTags.filter((t) => t.name.toLowerCase().includes(q));
    }, [allTags, search]);

    // Determine which error to show
    const displayError =
      formErrors?.tags || (touched ? localTagError : undefined);

    return (
      <div
        ref={(el) => {
          if (registerFieldRef) {
            registerFieldRef("tags")(el);
          }
        }}
        className="flex flex-col gap-4"
      >
        <h3 className="text-base font-bold text-app-text flex items-center gap-2 border-b border-app-border pb-3 select-none">
          Thẻ phân loại (Tags)
        </h3>

        <div className="flex flex-col gap-1.5 w-full relative" ref={containerRef}>
          {/* Label area with rules description */}
          <div className="flex items-center justify-between pb-0.5">
            <label className="text-sm font-medium text-app-text flex items-center gap-1.5">
              <span>Chọn thẻ phân loại</span>
              <span className="text-xs text-app-text-muted font-normal select-none">
                (Tối đa 3 thẻ, gồm ít nhất 1 Chuyên môn & 1 Phong cách)
              </span>
            </label>
            {selectedTags.length > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-app-surface text-app-text-muted border border-app-border/40 select-none">
                Đã chọn {selectedTags.length}/3
              </span>
            )}
          </div>

          {/* Selector Trigger Button */}
          <button
            type="button"
            onClick={() => !isLoading && setOpen((prev) => !prev)}
            className={cn(
              "flex w-full items-center justify-between gap-2",
              "min-h-11 rounded-xl px-3 py-2",
              "border bg-white text-sm text-app-text text-left",
              "transition-all duration-200 ease-out shadow-sm",
              open
                ? "border-brand ring-2 ring-brand/20"
                : "border-app-border hover:border-app-border-strong hover:shadow",
              displayError ? "border-app-error ring-2 ring-app-error/15" : "",
              isLoading && "cursor-wait opacity-65 bg-app-surface"
            )}
          >
            <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
              {selectedTags.length > 0 ? (
                selectedTags.map((tag) => {
                  const isSpecialty = tag.type === "specialty";
                  return (
                    <span
                      key={tag.id}
                      className={cn(
                        "inline-flex items-center gap-1 rounded-lg px-2.5 py-0.5 text-xs font-bold border transition-all  select-none animate-in fade-in zoom-in-95 duration-100",
                        isSpecialty
                          ? "bg-[#dcfce7] text-[#16a34a] border-[#bbf7d0]"
                          : "bg-[#cffafe] text-[#0891b2] border-[#a5f3fc]"
                      )}
                    >
                      <span>{tag.name}</span>
                      <span
                        role="button"
                        tabIndex={-1}
                        onClick={(e) => handleRemoveTag(tag, e)}
                        className={cn(
                          "rounded p-px transition-colors cursor-pointer",
                          isSpecialty
                            ? "text-[#16a34a]/70 hover:bg-[#16a34a]/15 hover:text-[#16a34a]"
                            : "text-[#0891b2]/70 hover:bg-[#0891b2]/15 hover:text-[#0891b2]"
                        )}
                      >
                        <X className="size-3" />
                      </span>
                    </span>
                  );
                })
              ) : (
                <span className="text-app-placeholder text-sm select-none">
                  Tìm kiếm và chọn thẻ phù hợp...
                </span>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-1">
              {selectedTags.length > 0 && (
                <span
                  role="button"
                  tabIndex={-1}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTagsChange([]);
                  }}
                  className="rounded-full p-0.5 text-app-text-muted transition-colors hover:bg-app-surface hover:text-app-text"
                >
                  <X className="h-3.5 w-3.5" />
                </span>
              )}
              <ChevronsUpDown
                className={cn(
                  "h-4 w-4 text-app-text-muted transition-transform duration-200",
                  open && "rotate-180",
                )}
              />
            </div>
          </button>

          {/* Dropdown Panel */}
          {open && (
            <div
              className={cn(
                "absolute left-0 right-0 top-full z-50 mt-1.5",
                "rounded-xl border border-app-border/80 bg-white",
                "shadow-lg shadow-black/8 overflow-hidden",
                "animate-in fade-in-0 zoom-in-[0.98] slide-in-from-top-1",
                "duration-150 ease-out",
              )}
            >
              {/* Search input bar */}
              <div className="flex items-center gap-2 border-b border-app-border/40 px-3 py-2">
                <Search className="h-4 w-4 shrink-0 text-app-text-muted" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Nhập tên thẻ để lọc..."
                  className={cn(
                    "h-7 w-full bg-transparent text-sm text-app-text",
                    "placeholder:text-app-placeholder",
                    "outline-none",
                  )}
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="shrink-0 rounded-full p-0.5 text-app-text-muted transition-colors hover:bg-app-surface hover:text-app-text"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Selection Summary */}
              {selectedTags.length > 0 && (
                <div className="flex items-center justify-between border-b border-app-border/30 px-3.5 py-2 bg-app-surface/20 select-none">
                  <span className="text-xs text-app-text-muted">
                    Đã chọn {selectedTags.length} thẻ
                  </span>
                  <button
                    type="button"
                    onClick={() => handleTagsChange([])}
                    className="text-xs text-brand font-semibold transition-colors hover:text-brand-hover"
                  >
                    Bỏ chọn tất cả
                  </button>
                </div>
              )}

              {/* Scrollable list */}
              <div className="max-h-64 overflow-y-auto overscroll-contain p-2 flex flex-col gap-3">
                {isLoading ? (
                  <div className="flex items-center justify-center py-6 text-sm text-app-text-muted">
                    Đang tải danh sách thẻ...
                  </div>
                ) : filteredSpecialtyTags.length === 0 && filteredStyleTags.length === 0 ? (
                  <div className="flex items-center justify-center py-6 text-sm text-app-text-muted">
                    Không tìm thấy thẻ nào phù hợp.
                  </div>
                ) : (
                  <>
                    {/* Specialty Group */}
                    {filteredSpecialtyTags.length > 0 && (
                      <div>
                        <div className="px-2.5 py-1 text-xs font-bold text-[#16a34a] bg-[#dcfce7]/60 border border-[#bbf7d0]/30 rounded-lg tracking-wide mb-1.5 flex items-center gap-1.5 select-none">
                          <span>CHUYÊN MÔN</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          {filteredSpecialtyTags.map((tag) => {
                            const isSelected = selectedTags.some((t) => t.id === tag.id);
                            return (
                              <button
                                key={tag.id}
                                type="button"
                                onClick={() => handleSelectTag(tag)}
                                className={cn(
                                  "flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm",
                                  "transition-all duration-100 cursor-pointer border border-transparent",
                                  isSelected
                                    ? "bg-[#dcfce7]/60 border-[#bbf7d0]/40 text-[#16a34a] font-semibold"
                                    : "text-app-text hover:bg-app-surface"
                                )}
                              >
                                <span>{tag.name}</span>
                                {isSelected && (
                                  <Check className="h-4 w-4 shrink-0 text-[#16a34a] animate-in zoom-in-75 duration-100" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Style Group */}
                    {filteredStyleTags.length > 0 && (
                      <div>
                        <div className="px-2.5 py-1 text-xs font-bold text-[#0891b2] bg-[#cffafe]/60 border border-[#a5f3fc]/30 rounded-lg tracking-wide mb-1.5 flex items-center gap-1.5 select-none">
                          <span>PHONG CÁCH</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          {filteredStyleTags.map((tag) => {
                            const isSelected = selectedTags.some((t) => t.id === tag.id);
                            return (
                              <button
                                key={tag.id}
                                type="button"
                                onClick={() => handleSelectTag(tag)}
                                className={cn(
                                  "flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm",
                                  "transition-all duration-100 cursor-pointer border border-transparent",
                                  isSelected
                                    ? "bg-[#cffafe]/60 border-[#a5f3fc]/40 text-[#0891b2] font-semibold"
                                    : "text-app-text hover:bg-app-surface"
                                )}
                              >
                                <span>{tag.name}</span>
                                {isSelected && (
                                  <Check className="h-4 w-4 shrink-0 text-[#0891b2] animate-in zoom-in-75 duration-100" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Error Feedback */}
        {displayError && (
          <div className="flex items-center gap-1.5 text-xs text-app-error animate-fade-in mt-0.5 pl-0.5">
            <AlertCircle size={14} className="shrink-0" />
            <span>{displayError}</span>
          </div>
        )}
      </div>
    );
  },
);

TagsSection.displayName = "TagsSection";
