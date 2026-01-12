import styles from "./styles.module.scss";

interface props {
  color?: "grey" | "green" | "blue";
  icon?: React.ReactNode;
  text?: string;
}

export const RoundTag = ({ color = "grey", icon, text }: props) => {
  return (
    <div
      className={`flex gap-1 p-2 items-center justify-center ${
        styles[`tag_${color}`]
      }`}
    >
      {icon} {text}
    </div>
  );
};
