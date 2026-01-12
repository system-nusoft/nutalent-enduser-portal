import { Button as Btn, Tooltip, Typography } from "antd";
import { colors } from "src/utils/colors";
import styles from "./styles.module.scss";
interface ButtonProps {
  btn_class?:
    | "filled_btn_large"
    | "filled_btn"
    | "white_btn"
    | "transparent_btn"
    | "full_width_btn"
    | "card_grey_btn"
    | "full_btn"
    | "white_full_btn"
    | "red_full_btn";
  label?: string | React.ReactNode;
  btn_Type?: "button" | "submit" | "reset" | undefined;
  onClick?: (e: React.MouseEvent) => void;
  icon?: ReactNode;
  disabled?: boolean;
  toolTipTitle?: string;
}

const { Text } = Typography;
const Button = ({
  btn_class = "filled_btn",
  label,
  btn_Type = "button",
  icon,
  onClick,
  disabled = false,
  toolTipTitle,
}: ButtonProps) => {
  return (
    <Tooltip color={colors.tooltip} title={toolTipTitle}>
      <Btn
        onClick={onClick}
        htmlType={btn_Type}
        className={`${styles[btn_class]} d-flex justify-content-center align-items-center`}
        disabled={disabled}
      >
        {icon && icon}
        {label && (
          <Text className={`${styles.btn_text} text-center`}>{label}</Text>
        )}
      </Btn>
    </Tooltip>
  );
};

export default Button;
