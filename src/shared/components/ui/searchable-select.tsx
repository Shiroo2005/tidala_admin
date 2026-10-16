import * as React from "react";
import { Check, ChevronsUpDown, Search, X } from "lucide-react";
import { cn } from "@/shared/utils/cn";

/* ═══════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════ */

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SearchableSelectProps {
  /** Array of options to select from */
  options: SelectOption[];
  /** Currently selected value */
  value: string;
  /** Callback when value changes */
  onChange: (value: string) => void;
  /** Placeholder text when no value selected */
  placeholder?: string;
  /** Placeholder text for the search input */
  searchPlaceholder?: string;
  /** Text shown when no options match search */
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
   SEARCHABLE SELECT COMPONENT
   ═══════════════════════════════════════════════════ */

export default function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Chọn...",
  searchPlaceholder = "Tìm kiếm...",
  emptyText = "Không tìm thấy kết quả.",
  label,
  error,
  disabled = false,
  clearable = false,
  fullWidth = false,
  className,
  containerClassName,
  name,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = React.useState(-1);

  // Find the selected option for display
  const selectedOption = React.useMemo(
    () => options.find((opt) => opt.value === value) ?? null,
    [options, value],
  );

  // Filter options based on search query
  const filteredOptions = React.useMemo(() => {
    if (!search.trim()) return options;
    const query = search.toLowerCase().trim();
    return options.filter((opt) => opt.label.toLowerCase().includes(query));
  }, [options, search]);

  // Reset active index when filtered options change
  React.useEffect(() => {
    setActiveIndex(-1);
  }, [filteredOptions.length]);

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

  // Focus search input when dropdown opens
  React.useEffect(() => {
    if (open) {
      // Use a small timeout to ensure DOM is rendered
      const timer = setTimeout(() => inputRef.current?.focus(), 10);
      return () => clearTimeout(timer);
    } else {
      setSearch("");
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
    const enabledOptions = filteredOptions.filter((opt) => !opt.disabled);

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
            {/* Search input */}
            <div className="flex items-center gap-2 border-b border-app-border/40 px-3 py-2">
              <Search className="h-4 w-4 shrink-0 text-app-text-muted" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={searchPlaceholder}
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

            {/* Options list */}
            <div
              ref={listRef}
              role="listbox"
              className="max-h-56 overflow-y-auto overscroll-contain p-1"
            >
              {filteredOptions.length === 0 ? (
                <div className="flex items-center justify-center py-6 text-sm text-app-text-muted">
                  {emptyText}
                </div>
              ) : (
                filteredOptions.map((opt, idx) => {
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

export { SearchableSelect };
