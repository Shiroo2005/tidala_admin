import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Search, X, Loader2 } from "lucide-react";

import { cn } from "@/shared/utils/cn";

/* ═══════════════════════════════════════════════════
   VARIANTS
   ═══════════════════════════════════════════════════ */

const appInputVariants = cva(
  // Base styles shared across all variants
  [
    "flex w-full items-center gap-2",
    "rounded-xl border bg-white text-sm text-app-text",
    "transition-all duration-200 ease-out",
    "has-[:disabled]:cursor-not-allowed has-[:disabled]:border-app-border has-[:disabled]:bg-app-surface has-[:disabled]:opacity-60",
  ],
  {
    variants: {
      /** Visual variant */
      variant: {
        default: [
          "border-app-border",
          "hover:border-app-border-strong",
          "has-[:focus]:border-brand has-[:focus]:ring-2 has-[:focus]:ring-brand/20",
        ],
        filled: [
          "border-transparent bg-app-surface",
          "hover:bg-app-surface-strong",
          "has-[:focus]:border-brand has-[:focus]:bg-white has-[:focus]:ring-2 has-[:focus]:ring-brand/20",
        ],
        ghost: [
          "border-transparent bg-transparent",
          "hover:bg-app-surface",
          "has-[:focus]:bg-white has-[:focus]:border-brand has-[:focus]:ring-2 has-[:focus]:ring-brand/20",
        ],
      },
      /** Size */
      inputSize: {
        sm: "h-8 px-2.5 text-xs",
        md: "h-10 px-3 text-sm",
        lg: "h-12 px-4 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "md",
    },
  },
);

/* ═══════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════ */

export interface AppInputProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof appInputVariants> {
  /** Label text above the input */
  label?: string;
  /** Hint/description text below the input */
  hint?: string;
  /** Error message (shows below, overrides hint when present) */
  error?: string;
  /** Icon element on the left side */
  startIcon?: React.ReactNode;
  /** Icon element on the right side */
  endIcon?: React.ReactNode;
  /** Show a clear (×) button when input has value */
  clearable?: boolean;
  /** Callback when the clear button is clicked */
  onClear?: () => void;
  /** Show a loading spinner on the right */
  loading?: boolean;
  /** Additional className for the outer wrapper (label + input + error) */
  containerClassName?: string;
  /** Additional className for the input wrapper (the bordered box) */
  wrapperClassName?: string;
  /** Whether input is required – adds a red asterisk to label */
  required?: boolean;
}

/* ═══════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════ */

const AppInput = React.forwardRef<HTMLInputElement, AppInputProps>(
  (
    {
      // Custom props
      label,
      hint,
      error,
      startIcon,
      endIcon,
      clearable = false,
      onClear,
      loading = false,
      containerClassName,
      wrapperClassName,
      required = false,
      // Variant props
      variant,
      inputSize,
      // Native input props
      className,
      value,
      disabled,
      id,
      ...inputProps
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const hasValue =
      value !== undefined && value !== null && String(value).length > 0;
    const showClear = clearable && hasValue && !disabled && !loading;
    const hasError = !!error;

    return (
      <div className={cn("flex flex-col gap-1.5", containerClassName)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-app-text"
          >
            {label}
            {required && (
              <span className="ml-0.5 text-app-error" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        {/* Input wrapper */}
        <div
          className={cn(
            appInputVariants({ variant, inputSize }),
            hasError &&
              "border-app-error ring-2 ring-app-error/15 hover:border-app-error has-focus:border-app-error has-focus:ring-app-error/20",
            wrapperClassName,
          )}
        >
          {/* Start icon */}
          {startIcon && (
            <span className="flex shrink-0 items-center text-app-text-muted [&>svg]:size-4">
              {startIcon}
            </span>
          )}

          {/* Native input */}
          <input
            ref={ref}
            id={inputId}
            value={value}
            disabled={disabled}
            aria-invalid={hasError || undefined}
            aria-describedby={
              hasError
                ? `${inputId}-error`
                : hint
                  ? `${inputId}-hint`
                  : undefined
            }
            className={cn(
              "h-full w-full min-w-0 bg-transparent outline-none",
              "placeholder:text-app-placeholder",
              "disabled:cursor-not-allowed",
              // Suppress the browser's built-in clear button on
              // type="search" inputs — we already render our own via the
              // `clearable` prop, and both showing up stacks two X icons.
              "[&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden",
              className,
            )}
            {...inputProps}
          />

          {/* Right-side actions */}
          {(showClear || loading || endIcon) && (
            <div className="flex shrink-0 items-center gap-1">
              {/* Clear button */}
              {showClear && (
                <button
                  type="button"
                  tabIndex={-1}
                  aria-label="Xóa nội dung"
                  onClick={onClear}
                  className={cn(
                    "rounded-full p-0.5",
                    "text-app-text-muted transition-colors duration-150",
                    "hover:bg-app-surface-strong hover:text-app-text",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30",
                  )}
                >
                  <X className="size-3.5" />
                </button>
              )}

              {/* Loading spinner */}
              {loading && (
                <Loader2 className="size-4 animate-spin text-app-text-muted" />
              )}

              {/* End icon */}
              {endIcon && !loading && (
                <span className="flex items-center text-app-text-muted [&>svg]:size-4">
                  {endIcon}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Error or hint */}
        {hasError ? (
          <p
            id={`${inputId}-error`}
            role="alert"
            className="text-xs text-app-error"
          >
            {error}
          </p>
        ) : hint ? (
          <p id={`${inputId}-hint`} className="text-xs text-app-text-muted">
            {hint}
          </p>
        ) : null}
      </div>
    );
  },
);

AppInput.displayName = "AppInput";

/* ═══════════════════════════════════════════════════
   SEARCH INPUT (Preset)
   ═══════════════════════════════════════════════════ */

export interface SearchInputProps extends Omit<
  AppInputProps,
  "startIcon" | "clearable" | "onClear" | "label" | "error" | "hint"
> {
  /** Callback triggered on each value change (convenience wrapper) */
  onSearch?: (query: string) => void;
}

/**
 * Pre-configured search variant of AppInput.
 * - Includes a search icon on the left
 * - Auto-clearable
 * - Uses the `filled` variant by default for a subtle look
 */
const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      placeholder = "Tìm kiếm...",
      variant = "filled",
      inputSize = "md",
      onSearch,
      onChange,
      value: controlledValue,
      ...rest
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = React.useState("");
    const isControlled = controlledValue !== undefined;
    const currentValue = isControlled ? controlledValue : internalValue;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.(e);
      onSearch?.(newValue);
    };

    const handleClear = () => {
      if (!isControlled) {
        setInternalValue("");
      }
      onSearch?.("");
      // Trigger a synthetic change event for controlled consumers
      const nativeEvent = new Event("input", { bubbles: true });
      const syntheticEvent = {
        target: { value: "" },
        currentTarget: { value: "" },
        nativeEvent,
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      onChange?.(syntheticEvent);
    };

    return (
      <AppInput
        ref={ref}
        type="search"
        enterKeyHint="search"
        placeholder={placeholder}
        variant={variant}
        inputSize={inputSize}
        value={currentValue}
        onChange={handleChange}
        clearable
        onClear={handleClear}
        startIcon={<Search />}
        {...rest}
      />
    );
  },
);

SearchInput.displayName = "SearchInput";

/* ═══════════════════════════════════════════════════
   EXPORTS
   ═══════════════════════════════════════════════════ */

export { AppInput, SearchInput };
