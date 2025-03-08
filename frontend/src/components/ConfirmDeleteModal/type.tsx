interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

type ModalMessage = {
    message: string;
    video_id: string;
}

export type { ConfirmDeleteModalProps, ModalMessage };
