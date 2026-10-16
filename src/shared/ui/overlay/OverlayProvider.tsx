import { useCallback, useMemo, useState } from "react";
import { OverlayContext } from "./useOverlay";
import type { OverlayItem } from "./overlay.types";
import { OverlayRenderer } from "./OverlayRenderer";

export const OverlayProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [overlays, setOverlays] = useState<OverlayItem[]>([]);

  const show = useCallback((overlay: OverlayItem) => {
    setOverlays((prev) => {
      // Limit concurrent visible toasts to max 3. If adding a new toast when
      // there are already 3 toasts, remove the oldest toast and append the new one.
      if (overlay.type === "toast") {
        const toastCount = prev.filter((o) => o.type === "toast").length;
        if (toastCount >= 3) {
          const firstToastIndex = prev.findIndex((o) => o.type === "toast");
          if (firstToastIndex >= 0) {
            const next = [...prev];
            next.splice(firstToastIndex, 1);
            return [...next, overlay];
          }
        }
      }
      return [...prev, overlay];
    });
  }, []);

  const hide = useCallback((id: string) => {
    setTimeout(() => {
      setOverlays((prev) => prev.filter((o) => o.id !== id));
    }, 0);
  }, []);

  const contextValue = useMemo(
    () => ({ overlays, show, hide }),
    [hide, overlays, show],
  );

  return (
    <OverlayContext.Provider value={contextValue}>
      {children}
      <OverlayRenderer overlays={overlays} />
    </OverlayContext.Provider>
  );
};
