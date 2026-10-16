import { AuthRequiredBottomSheet } from "@/shared/ui/bottomSheet/AuthRequiredBottomSheet";
import { useIsDesktop } from "@/shared/hooks/useIsDesktop";
import { AuthRequiredModal } from "./AuthRequiredModal";

type AuthRequiredOverlayProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
};

export const AuthRequiredOverlay = (props: AuthRequiredOverlayProps) => {
  const isDesktop = useIsDesktop();

  if (isDesktop) {
    return <AuthRequiredModal {...props} />;
  }

  return <AuthRequiredBottomSheet {...props} />;
};
