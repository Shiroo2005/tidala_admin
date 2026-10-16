import { useEffect, useState } from "react";

/**
 * Reusable entrance animation hook — same style as OnboardingPage.
 * Triggers on mount, animates from opacity-0 + translate-y + blur
 * to natural state.
 *
 * Usage:
 *   const { animClass, animStyle } = useStaggerAnim();
 *   <div className={`my-classes ${animClass}`} style={animStyle}>...</div>
 *
 * With delay:
 *   const { animClass, animStyle } = useStaggerAnim(150);
 *   <div className={`my-classes ${animClass}`} style={animStyle}>...</div>
 */
export function useStaggerAnim(delayMs: number = 0) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const baseHidden = "opacity-0 translate-y-8 blur-[1px] scale-[0.98]";
  const baseVisible = "opacity-100 translate-y-0 blur-0 scale-100";
  const transition =
    "transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)]";

  const animClass = `${transition} ${mounted ? baseVisible : baseHidden}`;
  const animStyle: React.CSSProperties | undefined = delayMs
    ? { transitionDelay: `${delayMs}ms` }
    : undefined;

  return { animClass, animStyle };
}
