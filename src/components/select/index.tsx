import { Form, Select, SelectProps } from "antd";
import styles from "./styles.module.scss";

interface props {
  size?: "middle" | "large" | "small";
  defaultValue?: string;
  name: string;
  label?: string;
  options: any;
  placeholder?: string;
  disabled?: boolean;
  onClick?: () => void;
  rules?: [{ required: boolean; message: string }];
  tagRender?: SelectProps["tagRender"];
  removeBottomMargin?: boolean;
}

export const filterOption = (
  input: string,
  option?: { label: string; value: string }
) => (option?.label ?? "").toLowerCase().startsWith(input.toLowerCase());

const SelectDropDown = ({
  size = "middle",
  defaultValue,
  name,
  label,
  options,
  placeholder,
  disabled,
  rules,
  tagRender,
  onClick,
  removeBottomMargin,
}: props) => {
  return (
    <Form.Item
      rules={rules}
      label={
        <span className={styles.margin_bottom_negative}>
          <span className={styles.input_label_style}>{label}</span>
        </span>
      }
      labelCol={{ span: label ? 24 : 0 }}
      className={styles.form_div}
      style={{
        margin: removeBottomMargin ? "0rem 0rem 0.5rem 0rem" : undefined,
      }}
      name={name}
    >
      <Select
        size={size}
        filterOption={filterOption}
        placeholder={placeholder}
        defaultValue={defaultValue}
        onClick={() => {
          if (onClick) onClick();
        }}
        options={options}
        onSelect={(val) => val}
        tagRender={tagRender}
        disabled={disabled}
        className={styles.multiSelect}
      />
    </Form.Item>
  );
};

export default SelectDropDown;
