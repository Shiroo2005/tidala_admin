import { useOverlay } from "../useOverlay";
import type { ToastOverlay } from "../overlay.types";

export const useToast = () => {
  const { show } = useOverlay();

  const showToast = (toast: Omit<ToastOverlay, "id" | "type">) => {
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    show({
      id,
      type: "toast",
      ...toast,
    });
  };

  return { showToast };
};
