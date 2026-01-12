import { Input as AntInput, Form, InputNumber, Typography } from "antd";
import TextArea from "antd/es/input/TextArea";
import React from "react";
import styles from "./styles.module.scss";

interface InputProps {
  suffix?: React.ReactNode;
  name: string;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  maxLength?: number;
  size?: "small" | "middle" | "large"; // New size prop
  style?: React.CSSProperties;
  initialValue?: string;
  minimum?: number;
  required?: boolean;
  inputType?: "normal" | "textArea" | "number" | "password";
  rules?: any[];
  onChange?: (val: any) => void;
  onlyNumbers?: boolean;
  prefix?: React.ReactNode;
  value?: string;
  error?: string | false;
  border?: boolean;
  rows?: number;
  onClick?: (e: React.MouseEvent) => void;
  onPressEnter?: React.KeyboardEventHandler<HTMLInputElement> | undefined;
  padding?: boolean;
}

const { Text } = Typography;

const Input = ({
  suffix,
  name,
  placeholder,
  label,
  disabled = false,
  inputType = "normal",
  size = "middle", // Default size is middle
  initialValue,
  style,
  required = false, // Default is false
  rules,
  onChange,
  maxLength,
  prefix,
  value,
  onClick,
  border = true,
  onlyNumbers = false,
  onPressEnter,
  rows = 6,
  padding = true,
}: InputProps) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      onlyNumbers &&
      !/^[0-9]*$/.test(event.key) &&
      !["Backspace", "ArrowLeft", "ArrowRight", "Tab"].includes(event.key)
    ) {
      event.preventDefault();
    }
  };

  // Apply conditional styles based on the size prop
  const inputPaddingStyle =
    size === "large"
      ? { padding: "0.5rem 0.5rem" }
      : size === "middle"
      ? { padding: "0.5rem 0.5rem" }
      : {}; // Default middle size

  const commonInputProps = {
    disabled,
    placeholder,
    autoComplete: "off",
    defaultValue: initialValue,
    maxLength,
    value: value,
    onClick: onClick,
    name: name,
    style: { width: "100%", ...style, ...inputPaddingStyle },
    className: `${border ? styles.input : styles.input_without_border}`,
  };

  return (
    <Form.Item
      initialValue={initialValue}
      className="flex flex-col m-0"
      name={name}
      rules={rules}
      labelCol={{ span: label ? 24 : 0 }}
      label={
        <span>
          {required && <Text>*</Text>}
          <Text className={`${styles.label}`}>{label}</Text>
        </span>
      }
    >
      {inputType === "textArea" ? (
        <TextArea
          {...commonInputProps}
          rows={rows}
          styles={{ textarea: { paddingLeft: padding ? "0.5rem" : 0 } }}
          showCount={size !== "small"}
          onChange={onChange}
        />
      ) : inputType === "number" ? (
        <InputNumber
          onChange={onChange}
          {...commonInputProps}
          onKeyDown={handleKeyDown}
        />
      ) : inputType === "password" ? (
        <AntInput.Password
          {...commonInputProps}
          onChange={onChange}
          type="password"
        />
      ) : (
        <AntInput
          {...commonInputProps}
          suffix={suffix}
          onPressEnter={onPressEnter}
          prefix={prefix ? <span className="pe-2">{prefix}</span> : undefined}
          onChange={onChange}
        />
      )}
    </Form.Item>
  );
};

export default Input;
