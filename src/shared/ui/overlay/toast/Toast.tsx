import { useEffect, useState, useRef } from "react";
import { X } from "lucide-react";
import { useOverlay } from "../useOverlay";
import type { ToastOverlay } from "../overlay.types";

export const Toast = ({
  id,
  message,
  position,
  toastType = "info",
  duration = 3000,
  stackIndex = 0,
}: ToastOverlay) => {
  const { hide } = useOverlay();
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [isDragging, setIsDragging] = useState(false);
  const toastRef = useRef<HTMLDivElement>(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const dragFrameRef = useRef<number | null>(null);

  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout> | undefined;
    const enterFrame = requestAnimationFrame(() => {
      setIsVisible(true);
    });

    const timer = setTimeout(() => {
      setIsExiting(true);
      hideTimer = setTimeout(() => hide(id), 300);
    }, duration);

    return () => {
      cancelAnimationFrame(enterFrame);
      clearTimeout(timer);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, [hide, id, duration]);

  useEffect(
    () => () => {
      if (dragFrameRef.current !== null) {
        cancelAnimationFrame(dragFrameRef.current);
      }
    },
    [],
  );

  const applyDragTransform = (x: number, y: number) => {
    dragOffsetRef.current = { x, y };

    if (dragFrameRef.current !== null) return;

    dragFrameRef.current = requestAnimationFrame(() => {
      dragFrameRef.current = null;
      if (!toastRef.current) return;
      const offset = dragOffsetRef.current;
      toastRef.current.style.transform = `translate(${offset.x}px, ${offset.y}px)`;
    });
  };

  const resetDragTransform = () => {
    dragOffsetRef.current = { x: 0, y: 0 };
    if (dragFrameRef.current !== null) {
      cancelAnimationFrame(dragFrameRef.current);
      dragFrameRef.current = null;
    }
    if (toastRef.current) {
      toastRef.current.style.transform = "";
    }
  };

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    e.preventDefault(); // Prevent any default touch behavior
    setTouchEnd(null);
    setIsDragging(true);
    resetDragTransform();
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const onTouchMove = (e: React.TouchEvent) => {
    e.preventDefault(); // Prevent page scrolling when swiping on toast
    if (!touchStart || !isDragging) return;

    const currentX = e.targetTouches[0].clientX;
    const currentY = e.targetTouches[0].clientY;

    const deltaX = currentX - touchStart.x;
    const deltaY = currentY - touchStart.y;

    // Restrict movement based on toast position
    let dragX = deltaX;
    let dragY = deltaY;

    switch (position) {
      case "top":
      case "bottom":
        // Only allow vertical movement for top/bottom toasts
        dragX = 0;
        dragY = deltaY;
        break;
      case "left":
      case "right":
        // Only allow horizontal movement for left/right toasts
        dragX = deltaX;
        dragY = 0;
        break;
      case "left-top":
      case "right-bottom":
        // Corner toasts from left/right: allow horizontal movement
        dragX = deltaX;
        dragY = 0;
        break;
      case "right-top":
      case "left-bottom":
        // Corner toasts from top/bottom: allow vertical movement
        dragX = 0;
        dragY = deltaY;
        break;
      default:
        // Default: allow both directions
        dragX = deltaX;
        dragY = deltaY;
        break;
    }

    applyDragTransform(dragX, dragY);
    setTouchEnd({
      x: currentX,
      y: currentY,
    });
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || !isDragging) {
      setIsDragging(false);
      resetDragTransform();
      return;
    }

    const deltaX = Math.abs(touchStart.x - touchEnd.x);
    const deltaY = Math.abs(touchStart.y - touchEnd.y);

    const isLeftSwipe = touchStart.x - touchEnd.x > minSwipeDistance;
    const isRightSwipe = touchStart.x - touchEnd.x < -minSwipeDistance;
    const isUpSwipe = touchStart.y - touchEnd.y > minSwipeDistance;
    const isDownSwipe = touchStart.y - touchEnd.y < -minSwipeDistance;

    // Check if swipe distance is enough for dismissal
    let shouldDismiss = false;
    if (position === "top" && isUpSwipe && deltaY > minSwipeDistance) {
      shouldDismiss = true;
    } else if (
      position === "left-top" &&
      isLeftSwipe &&
      deltaX > minSwipeDistance
    ) {
      shouldDismiss = true;
    } else if (
      position === "right-top" &&
      isUpSwipe &&
      deltaY > minSwipeDistance
    ) {
      shouldDismiss = true;
    } else if (
      position === "bottom" &&
      isDownSwipe &&
      deltaY > minSwipeDistance
    ) {
      shouldDismiss = true;
    } else if (
      position === "left-bottom" &&
      isDownSwipe &&
      deltaY > minSwipeDistance
    ) {
      shouldDismiss = true;
    } else if (
      position === "right-bottom" &&
      isRightSwipe &&
      deltaX > minSwipeDistance
    ) {
      shouldDismiss = true;
    } else if (
      position === "left" &&
      isLeftSwipe &&
      deltaX > minSwipeDistance
    ) {
      shouldDismiss = true;
    } else if (
      position === "right" &&
      isRightSwipe &&
      deltaX > minSwipeDistance
    ) {
      shouldDismiss = true;
    }

    if (shouldDismiss) {
      handleDismiss();
    } else {
      // Reset position if not dismissed
      resetDragTransform();
    }

    setIsDragging(false);
  };

  const handleDismiss = () => {
    setIsExiting(true);
    resetDragTransform();
    setTimeout(() => hide(id), 300);
  };

  const stackOffset = stackIndex * 76;

  const getPositionStyle = (): React.CSSProperties => {
    switch (position) {
      case "top":
      case "left-top":
      case "right-top":
        return { top: `calc(var(--toast-top-safe-offset) + ${16 + stackOffset}px)` };
      case "bottom":
      case "left-bottom":
      case "right-bottom":
        return { bottom: `${16 + stackOffset}px` };
      default:
        return {};
    }
  };

  const getPositionClasses = () => {
    const baseClasses = "fixed z-[2000] px-6 py-4 rounded-xl shadow-xl border";

    switch (position) {
      case "top":
        return `${baseClasses} left-4 right-4 sm:left-1/2 sm:right-auto sm:transform sm:-translate-x-1/2 sm:max-w-sm w-auto ${
          isVisible && !isExiting
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
        } transition-all duration-300 ease-out`;
      case "left-top":
        return `${baseClasses} left-4 max-w-xs ${
          isVisible && !isExiting
            ? "translate-x-0 opacity-100"
            : "-translate-x-full opacity-0"
        } transition-all duration-300 ease-out`;
      case "right-top":
        return `${baseClasses} right-4 max-w-xs ${
          isVisible && !isExiting
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0"
        } transition-all duration-300 ease-out`;
      case "bottom":
        return `${baseClasses} left-4 right-4 sm:left-1/2 sm:right-auto sm:transform sm:-translate-x-1/2 sm:max-w-sm w-auto ${
          isVisible && !isExiting
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0"
        } transition-all duration-300 ease-out`;
      case "left-bottom":
        return `${baseClasses} left-4 max-w-xs ${
          isVisible && !isExiting
            ? "translate-x-0 opacity-100"
            : "-translate-x-full opacity-0"
        } transition-all duration-300 ease-out`;
      case "right-bottom":
        return `${baseClasses} right-4 max-w-xs ${
          isVisible && !isExiting
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0"
        } transition-all duration-300 ease-out`;
      case "left":
        return `${baseClasses} left-4 top-1/2 transform -translate-y-1/2 max-w-xs ${
          isVisible && !isExiting
            ? "translate-x-0 opacity-100"
            : "-translate-x-full opacity-0"
        } transition-all duration-300 ease-out`;
      case "right":
        return `${baseClasses} right-4 top-1/2 transform -translate-y-1/2 max-w-xs ${
          isVisible && !isExiting
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0"
        } transition-all duration-300 ease-out`;
      default:
        return `${baseClasses} left-4 right-4 sm:left-1/2 sm:right-auto sm:transform sm:-translate-x-1/2 sm:max-w-sm w-auto ${
          isVisible && !isExiting
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0"
        } transition-all duration-300 ease-out`;
    }
  };

  const getTypeClasses = () => {
    switch (toastType) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800";
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "info":
      default:
        return "bg-blue-50 border-blue-200 text-blue-800";
    }
  };

  return (
    <div
      ref={toastRef}
      className={`${getPositionClasses()} ${getTypeClasses()}`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{
        ...getPositionStyle(),
        touchAction: "none", // Prevent default touch behaviors
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium leading-tight flex-1">
          {message}
        </span>
        <button
          onClick={handleDismiss}
          className="flex size-5 shrink-0 items-center justify-center text-gray-400 transition-colors duration-200 hover:text-gray-600"
          aria-label="Đóng thông báo"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

