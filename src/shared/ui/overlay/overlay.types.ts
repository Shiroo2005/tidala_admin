export type OverlayType =
  | "dialog"
  | "ios-install-guide"
  | "toast"
  | "confirm-dialog"
  | "option-dialog"
  | "form-dialog";

export interface BaseOverlay {
  id: string;
  type: OverlayType;
}

export interface DialogOverlay extends BaseOverlay {
  type: "dialog";
  title?: string;
  message?: string;
  children?: React.ReactNode;
  // When false, the dialog ignores backdrop click/escape close events.
  closeOnOverlayClick?: boolean;
  onClose?: () => void;
  isOpen?: boolean;
  containerClassName?: string;
}

export interface ConfirmDialogOverlay extends BaseOverlay {
  type: "confirm-dialog";
  title?: string | React.ReactNode;
  titleClassName?: string;
  content?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  showCloseButton?: boolean;
}

export interface OptionDialogOverlay extends BaseOverlay {
  type: "option-dialog";
  title?: string | React.ReactNode;
  titleClassName?: string;
  content?: React.ReactNode;
  option1Text?: string;
  option1OnClick?: () => void;
  option2Text?: string;
  option2OnClick?: () => void;
  showCloseButton?: boolean;
}

export interface FormDialogOverlay extends BaseOverlay {
  type: "form-dialog";
  title?: string | React.ReactNode;
  titleClassName?: string;
  content?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => boolean | void;
  onCancel?: () => void;
  confirmDisabled?: boolean;
  showCloseButton?: boolean;
}

export interface IosInstallGuideOverlay extends BaseOverlay {
  type: "ios-install-guide";
}

export type ToastPosition =
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "left-top"
  | "right-top"
  | "left-bottom"
  | "right-bottom";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastOverlay extends BaseOverlay {
  type: "toast";
  message: string;
  position: ToastPosition;
  toastType?: ToastType;
  duration?: number; // in milliseconds
  stackIndex?: number;
}

export type OverlayItem =
  | DialogOverlay
  | IosInstallGuideOverlay
  | ToastOverlay
  | ConfirmDialogOverlay
  | OptionDialogOverlay
  | FormDialogOverlay;
