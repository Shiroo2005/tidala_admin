import { useOverlay } from "../useOverlay";
import type { DialogOverlay } from "../overlay.types";

export const useDialog = () => {
  const { show, hide } = useOverlay();

  const showDialog = (dialog: Omit<DialogOverlay, "id" | "type">) => {
    const id = `dialog-${Date.now()}`;
    show({
      id,
      type: "dialog",
      ...dialog,
    });

    const hideDialog = () => {
      hide(id);
    };

    return hideDialog;
  };

  return { showDialog };
};
