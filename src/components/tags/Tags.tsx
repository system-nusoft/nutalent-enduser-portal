import styles from "./styles.module.scss";

interface props {
  label: string;
  tagType?: string | "success" | "error" | "pending";
  icon?: ReactNode;
  upperCase?: boolean;
}

export const Tag = ({
  label,
  tagType = "default",
  icon,
  upperCase = true,
}: props) => {
  tagType.toLowerCase().replace(/[_\- ]/g, "");

  switch (tagType.toLowerCase()) {
    case "success":
      tagType = "success";
      break;
    case "pending":
      tagType = "pending";
      break;
    case "confirmation pending":
      tagType = "pending";
      break;
    case "paid":
      tagType = "success";
      break;
    case "Confirmation Pending":
      tagType = "pending";
      break;
    case "pending approval":
      tagType = "pending";
      break;
    case "revision requested":
      tagType = "error";
      break;
    case "approved":
      tagType = "success";
      break;
    case "error":
      tagType = "error";
      break;
    case "working":
      tagType = "success";
      break;
    case "available":
      tagType = "success";
      break;
    case "busy":
      tagType = "error";
      break;
    case "booked":
      tagType = "success";
      break;
    case "notstarted":
      tagType = "error";
      break;
    case "cancelled":
      tagType = "error";
      break;
    case "training":
      tagType = "pending";
      break;
    case "ongoing":
      tagType = "pending";
      break;
    case "suggested":
      tagType = "pending";
      break;
    case "vacation":
      tagType = "pending";
      break;
    case "leave":
      tagType = "error";
      break;
    case "closed":
      tagType = "error";
      break;
    case "inactive":
      tagType = "error";
      break;
    case "done":
      tagType = "success";
      break;
    case "active":
      tagType = "success";
      break;
    case "completed":
      tagType = "success";
      break;
    default:
      tagType = "default";
  }

  return (
    <span
      className={`${
        styles[`tag_styles_${tagType}`]
      } overflow-hidden whitespace-nowrap text-ellipsis `}
    >
      {icon && icon}
      {label && typeof label === "string" && upperCase
        ? label?.toUpperCase()
        : label}
    </span>
  );
};
