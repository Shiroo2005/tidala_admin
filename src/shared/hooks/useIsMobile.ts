import { useEffect, useState } from "react";
import { BREAKPOINTS } from "@/shared/constants/breakpoints";

export const MOBILE_BREAKPOINT = BREAKPOINTS.mobile;

/**
 * Hook to detect if the current viewport is mobile-sized.
 * Uses `window.matchMedia` for efficient, event-driven detection.
 *
 * @param breakpoint - Max width in px to consider "mobile" (default: 768)
 * @returns `true` if the viewport width is below the breakpoint
 */
export const useIsMobile = (
  breakpoint: number = MOBILE_BREAKPOINT,
): boolean => {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < breakpoint;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    // Set initial value from media query
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobile(mediaQuery.matches);

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [breakpoint]);

  return isMobile;
};
