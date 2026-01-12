import { DatePicker as DP, Form } from "antd";
import { Dayjs } from "dayjs";
import styles from "./styles.module.scss";

interface props {
  label?: string;
  name: string;
  disabled?: boolean;
  onChange?: (val: any) => void;
  rules?: { required: boolean; message: string }[];
  disabledDate?: (current: Dayjs | null) => boolean;
  size?: "small" | "large" | "middle";
  defaultValue?: Dayjs;
  value?: Dayjs;
}

export const DatePicker = ({
  label,
  name,
  rules,
  disabled = false,
  onChange,
  disabledDate,
  size = "large",
  defaultValue,
  value,
}: props) => {
  return (
    <Form.Item
      className="form-div"
      name={name}
      label={
        <span>
          <span className={`${styles.label}`}>{label}</span>
        </span>
      }
      labelCol={{ span: label ? 24 : 0 }}
      rules={rules}
    >
      <DP
        disabled={disabled}
        defaultValue={defaultValue}
        onCalendarChange={onChange}
        size={size}
        value={value}
        disabledDate={disabledDate}
        className={`${styles.range_input_container} align-items-center`}
      />
    </Form.Item>
  );
};
