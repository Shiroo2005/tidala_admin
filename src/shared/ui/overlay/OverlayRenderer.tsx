import type { OverlayItem } from "./overlay.types";
import { DialogOverlay } from "./dialog/DialogOverlay";
import { IosInstallGuideDialog } from "./dialog/IosInstallGuideDialog";
import { ConfirmDialog } from "./dialog/ConfirmDialog";
import { OptionDialog } from "./dialog/OptionDialog";
import { FormDialog } from "./dialog/FormDialog";
import { Toast } from "./toast/Toast";

export const OverlayRenderer = ({ overlays }: { overlays: OverlayItem[] }) => {
  const toastIndexes = overlays.reduce<Record<string, number>>(
    (indexes, overlay) => {
      if (overlay.type !== "toast") return indexes;
      indexes[overlay.id] = Object.keys(indexes).length;
      return indexes;
    },
    {},
  );

  return (
    <>
      {overlays.map((overlay) => {
        switch (overlay.type) {
          case "dialog":
            return <DialogOverlay key={overlay.id} {...overlay} />;

          case "confirm-dialog":
            return <ConfirmDialog key={overlay.id} {...overlay} />;

          case "option-dialog":
            return <OptionDialog key={overlay.id} {...overlay} />;

          case "form-dialog":
            return <FormDialog key={overlay.id} {...overlay} />;

          case "ios-install-guide":
            return <IosInstallGuideDialog key={overlay.id} id={overlay.id} />;

          case "toast":
            return (
              <Toast
                key={overlay.id}
                {...overlay}
                stackIndex={toastIndexes[overlay.id] ?? 0}
              />
            );

          default:
            return null;
        }
      })}
    </>
  );
};
