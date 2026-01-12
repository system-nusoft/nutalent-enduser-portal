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
  value?: any;
  onClick?: () => void;
  rules?: [{ required: boolean; message: string }];
  tagRender?: SelectProps["tagRender"];
  removeBottomMargin?: boolean;
  labelRender?: ((props: any) => ReactNode) | undefined;
  onChange?:
    | ((
        value: any,
        option:
          | {
              label: string;
              value: string;
            }
          | {
              label: string;
              value: string;
            }[]
      ) => void)
    | undefined;
}

export const filterOption = (
  input: string,
  option?: { label: string; value: string }
) => (option?.label ?? "").toLowerCase().startsWith(input.toLowerCase());

const SimpleDropDown = ({
  size = "middle",
  name,
  label,
  options,
  placeholder,
  rules,
  onChange,
  value,
  removeBottomMargin,
  labelRender,
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
        value={value}
        labelRender={labelRender}
        showSearch
        size={size}
        placeholder={placeholder}
        filterOption={filterOption}
        onChange={onChange}
        className="w-full"
        options={options}
      />
    </Form.Item>
  );
};

export default SimpleDropDown;
