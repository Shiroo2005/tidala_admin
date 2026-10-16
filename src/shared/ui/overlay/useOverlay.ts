// overlay/useOverlay.ts

import { createContext, useContext } from "react";
import type { OverlayItem } from "./overlay.types";

interface OverlayContextValue {
  overlays: OverlayItem[];
  show: (overlay: OverlayItem) => void;
  hide: (id: string) => void;
}

export const OverlayContext = createContext<OverlayContextValue | null>(null);

export const useOverlay = () => {
  const ctx = useContext(OverlayContext);
  if (!ctx) {
    throw new Error("useOverlay must be used inside OverlayProvider");
  }
  return ctx;
};
