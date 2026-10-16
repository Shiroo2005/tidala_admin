export const BREAKPOINTS = {
  mobile: 768,
  desktop: 1024,
} as const;

export type BreakpointName = keyof typeof BREAKPOINTS;
