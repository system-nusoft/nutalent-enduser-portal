import { CloseCircleFilled } from "@ant-design/icons";
import { Modal } from "antd";
import { forwardRef, useImperativeHandle, useState } from "react";
interface props {
  ref?: any;
  children: ReactNode;
  onClose?: () => void;
  width?: number;
}

export const DialogBox = forwardRef(
  ({ children, onClose, width }: props, ref: any) => {
    const [open, setOpen] = useState(false);

    const openModal = () => {
      setOpen(true);
    };

    const closeModal = () => {
      setOpen(false);
      onClose && onClose();
    };

    useImperativeHandle(ref, () => ({ openModal, closeModal }));
    return (
      <Modal
        destroyOnClose
        onClose={onClose}
        closeIcon={<CloseCircleFilled onClick={() => closeModal()} />}
        footer={false}
        open={open}
        width={width ?? undefined}
      >
        {children}
      </Modal>
    );
  }
);
