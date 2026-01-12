import { notification } from "antd";
import styles from "./styles.module.scss";
interface notificationProps {
  type?: "success" | "error" | "info" | "warning";
  message: string;
}

export const Notification = ({
  type = "success",
  message,
}: notificationProps) => {
  notification.destroy();

  if (type === "success") {
    return notification.success({
      message: message,
      pauseOnHover: true,
      type: type,
      closable: true,
      closeIcon: true,
      duration: 2,
      className: `${styles[`body_styles_${type}`]} rounded-1`,
      placement: "topRight",
      description: null,
    });
  } else if (type === "error") {
    return notification.error({
      message: message,
      pauseOnHover: true,
      type: type,
      closable: true,
      closeIcon: true,
      className: `${styles[`body_styles_${type}`]} rounded-1`,
      duration: 2,
      placement: "topRight",
      description: null,
    });
  } else if (type === "info") {
    return notification.info({
      message: message,
      pauseOnHover: true,
      type: type,
      closable: true,
      closeIcon: true,
      duration: 2,
      placement: "topRight",
      className: `${styles[`body_styles_${type}`]} rounded-1`,
      description: null,
    });
  } else if (type === "warning") {
    return notification.warning({
      message: message,
      pauseOnHover: true,
      type: type,
      closable: true,
      closeIcon: true,
      duration: 2,
      className: `${styles[`body_styles_${type}`]} rounded-1`,
      placement: "topRight",
      description: null,
    });
  }

  return notification.open({
    message: message,
    pauseOnHover: true,
    type: type,
    closable: true,
    closeIcon: true,
    duration: 2,
    placement: "topRight",
    description: null,
  });
};
