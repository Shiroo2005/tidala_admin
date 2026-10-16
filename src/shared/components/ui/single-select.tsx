import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import type { SelectOption } from "./searchable-select";

/* ═══════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════ */

export interface SingleSelectProps {
  /** Array of options to select from */
  options: SelectOption[];
  /** Currently selected value */
  value: string;
  /** Callback when value changes */
  onChange: (value: string) => void;
  /** Placeholder text when no value selected */
  placeholder?: string;
  /** Text shown when there are no options */
  emptyText?: string;
  /** Optional label above the select */
  label?: string;
  /** Error message */
  error?: string;
  /** Whether the select is disabled */
  disabled?: boolean;
  /** Whether the selected value can be cleared */
  clearable?: boolean;
  /** Full width mode */
  fullWidth?: boolean;
  /** Additional className for the trigger button */
  className?: string;
  /** Additional className for the outer wrapper */
  containerClassName?: string;
  /** Hidden input name for form submission */
  name?: string;
}

/* ═══════════════════════════════════════════════════
   SINGLE SELECT COMPONENT
   ═══════════════════════════════════════════════════ */

export default function SingleSelect({
  options,
  value,
  onChange,
  placeholder = "Chọn...",
  emptyText = "Không có tùy chọn nào.",
  label,
  error,
  disabled = false,
  clearable = false,
  fullWidth = false,
  className,
  containerClassName,
  name,
}: SingleSelectProps) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = React.useState(-1);

  // Find the selected option for display
  const selectedOption = React.useMemo(
    () => options.find((opt) => opt.value === value) ?? null,
    [options, value],
  );

  // Close on outside click
  React.useEffect(() => {
    if (!open) return;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node | null;
      if (!target) return;
      if (!containerRef.current?.contains(target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [open]);

  // Reset state when dropdown closes
  React.useEffect(() => {
    if (!open) {
      setActiveIndex(-1);
    }
  }, [open]);

  // Scroll active item into view
  React.useEffect(() => {
    if (activeIndex < 0 || !listRef.current) return;
    const activeItem = listRef.current.querySelector(
      `[data-index="${activeIndex}"]`,
    );
    activeItem?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const handleToggle = () => {
    if (disabled) return;
    setOpen((prev) => !prev);
  };

  const handleSelect = (optionValue: string) => {
    if (optionValue === value) {
      // Clicking the already-selected option closes the dropdown
      setOpen(false);
      return;
    }
    onChange(optionValue);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const enabledOptions = options.filter((opt) => !opt.disabled);

    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();
        if (!open) {
          setOpen(true);
          return;
        }
        setActiveIndex((prev) => {
          const next = prev + 1;
          return next >= enabledOptions.length ? 0 : next;
        });
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        if (!open) {
          setOpen(true);
          return;
        }
        setActiveIndex((prev) => {
          const next = prev - 1;
          return next < 0 ? enabledOptions.length - 1 : next;
        });
        break;
      }
      case "Enter": {
        e.preventDefault();
        if (!open) {
          setOpen(true);
          return;
        }
        if (activeIndex >= 0 && activeIndex < enabledOptions.length) {
          handleSelect(enabledOptions[activeIndex].value);
        }
        break;
      }
      case "Escape": {
        if (open) {
          e.preventDefault();
          setOpen(false);
        }
        break;
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex flex-col gap-1.5",
        fullWidth ? "w-full" : "inline-flex w-64",
        containerClassName,
      )}
    >
      {/* Label */}
      {label && (
        <label className="text-sm font-medium text-app-text">{label}</label>
      )}

      {/* Hidden input for form submission */}
      {name && <input type="hidden" name={name} value={value} />}

      {/* Trigger container */}
      <div className="relative">
        {/* Trigger button */}
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          disabled={disabled}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          className={cn(
            // Layout
            "flex w-full items-center justify-between gap-2",
            "h-10 rounded-xl px-3",
            // Colors & border
            "border bg-white text-sm text-app-text",
            "transition-all duration-200 ease-out",
            // States
            !disabled && !error && !open && "border-app-border hover:border-app-border-strong",
            !disabled && !error && open && "border-brand ring-2 ring-brand/20",
            error && "border-app-error ring-2 ring-app-error/15",
            disabled && "cursor-not-allowed border-app-border bg-app-surface opacity-60",
            !disabled && "cursor-pointer",
            className,
          )}
        >
          <span
            className={cn(
              "truncate text-left",
              !selectedOption && "text-app-placeholder",
            )}
          >
            {selectedOption?.label ?? placeholder}
          </span>

          <div className="flex shrink-0 items-center gap-1">
            {/* Clear button */}
            {clearable && selectedOption && !disabled && (
              <span
                role="button"
                tabIndex={-1}
                onClick={handleClear}
                className="rounded-full p-0.5 text-app-text-muted transition-colors hover:bg-app-surface hover:text-app-text"
              >
                <X className="h-3.5 w-3.5" />
              </span>
            )}

            {/* Chevron */}
            <ChevronsUpDown
              className={cn(
                "h-4 w-4 text-app-text-muted transition-transform duration-200",
                open && "rotate-180",
              )}
            />
          </div>
        </button>

        {/* Dropdown */}
        {open && (
          <div
            className={cn(
              // Position
              "absolute left-0 right-0 top-full z-50 mt-1.5",
              // Visual
              "rounded-xl border border-app-border/80 bg-white",
              "shadow-lg shadow-black/8",
              // Animation
              "animate-in fade-in-0 zoom-in-[0.98] slide-in-from-top-1",
              "duration-150 ease-out",
            )}
          >
            {/* Options list */}
            <div
              ref={listRef}
              role="listbox"
              className="max-h-56 overflow-y-auto overscroll-contain p-1"
            >
              {options.length === 0 ? (
                <div className="flex items-center justify-center py-6 text-sm text-app-text-muted">
                  {emptyText}
                </div>
              ) : (
                options.map((opt, idx) => {
                  const isSelected = opt.value === value;
                  const isActive = idx === activeIndex;

                  return (
                    <button
                      key={opt.value}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      disabled={opt.disabled}
                      data-index={idx}
                      onMouseEnter={() => setActiveIndex(idx)}
                      onMouseLeave={() => setActiveIndex(-1)}
                      onClick={() => handleSelect(opt.value)}
                      className={cn(
                        // Layout
                        "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm",
                        // Transitions
                        "transition-colors duration-100",
                        // Disabled
                        opt.disabled
                          ? "cursor-not-allowed text-app-text-disabled opacity-50"
                          : "cursor-pointer text-app-text",
                        // Active (hover / keyboard)
                        !opt.disabled && isActive && !isSelected && "bg-app-surface",
                        // Selected
                        !opt.disabled &&
                          isSelected &&
                          "bg-brand/8 text-brand font-medium",
                      )}
                    >
                      {/* Check icon for selected */}
                      <span
                        className={cn(
                          "flex h-4 w-4 shrink-0 items-center justify-center",
                          !isSelected && "invisible",
                        )}
                      >
                        <Check className="h-3.5 w-3.5" />
                      </span>

                      <span className="truncate">{opt.label}</span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && <span className="text-xs text-app-error">{error}</span>}
    </div>
  );
}

export { SingleSelect };
