import { DatePicker, Form } from "antd";
import { Dayjs } from "dayjs";
import styles from "./styles.module.scss";

const { RangePicker } = DatePicker;

interface props {
  label?: string;
  name: string;
  disabled?: boolean;
  onChange?: (val: any) => void;
  rules?: { required: boolean; message: string }[];
  disabledDate?: (current: Dayjs | null) => boolean;
  size?: "middle" | "large" | "small";
}

export const DateRange = ({
  label,
  name,
  rules,
  disabled = false,
  onChange,
  disabledDate,
  size = "small",
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
      <RangePicker
        disabled={disabled}
        size={size}
        onCalendarChange={onChange}
        disabledDate={disabledDate}
        className={`${styles.range_input_container} align-items-center`}
      />
    </Form.Item>
  );
};
