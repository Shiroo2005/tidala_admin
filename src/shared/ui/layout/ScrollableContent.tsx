import { forwardRef } from "react";

type ScrollableContentProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
};

const ScrollableContent = forwardRef<HTMLDivElement, ScrollableContentProps>(
  ({ children, className = "", id }, ref) => {
    return (
      <div
        ref={ref}
        className={`
        flex-1
        pt-16
        pb-24
        overflow-y-auto
        overscroll-contain
        touch-pan-y
        scrollbar-hide
        ${className}
      `}
        id={id}
      >
        {children}
      </div>
    );
  },
);

export default ScrollableContent;
