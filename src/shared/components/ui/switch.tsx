import * as React from "react";
import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { cn } from "@/shared/utils/cn";

export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
  label?: string;
  containerClassName?: string;
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, label, containerClassName, id, ...props }, ref) => {
    const generatedId = React.useId();
    const switchId = id || generatedId;

    const switchElement = (
      <SwitchPrimitive.Root
        ref={ref}
        id={switchId}
        className={cn(
          "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none",
          "focus-visible:ring-2 focus-visible:ring-brand/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "bg-slate-200 data-checked:bg-brand dark:bg-slate-800",
          className,
        )}
        {...props}
      >
        <SwitchPrimitive.Thumb
          className={cn(
            "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-md ring-0 transition-transform duration-200 ease-in-out",
            "translate-x-0 data-checked:translate-x-5",
          )}
        />
      </SwitchPrimitive.Root>
    );

    if (!label) return switchElement;

    return (
      <div
        className={cn(
          "flex items-center gap-3 select-none text-sm font-medium text-app-text",
          containerClassName,
        )}
      >
        {switchElement}
        <label
          htmlFor={switchId}
          className="cursor-pointer"
        >
          {label}
        </label>
      </div>
    );
  },
);

Switch.displayName = "Switch";

export { Switch };
