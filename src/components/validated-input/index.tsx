import { useState } from "react";
import { Input as AntInput, Typography, Form, Spin } from "antd";
import { CheckCircleFilled, CloseCircleFilled } from "@ant-design/icons";
import axios from "axios";
import styles from "./styles.module.scss";
import Button from "../button/Button";

const { Text } = Typography;

interface ValidatedInputProps {
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  apiUrl: string;
  successMessage?: string;
  errorMessage?: string;
  name: string;
  initialValue?: string;
  validationField?: string;
}

export const ValidatedInput = ({
  placeholder,
  label,
  disabled = false,
  apiUrl,
  successMessage = "Success",
  errorMessage = "Error occurred",
  name,
  initialValue = "",
  validationField = "value",
}: ValidatedInputProps) => {
  const [inputValue, setInputValue] = useState<string>(initialValue);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const handleApiCall = async () => {
    setLoading(true);

    // TODO: remove
    await setTimeout(() => {
      setIsValid(true);
      setMessage(successMessage);
      setLoading(false);
    }, 1000);

    // TODO: Integrate API later
    try {
      return;
      const response = await axios.post(apiUrl, {
        [validationField]: inputValue,
      });

      if (response.data?.status === "success") {
        setIsValid(true);
        setMessage(successMessage);
      } else {
        setIsValid(false);
        setMessage(errorMessage);
      }
    } catch (error) {
      setIsValid(false);
      setMessage(errorMessage);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleApiCall();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsValid(null); // Reset the state when the input changes
    setMessage("");
  };

  const inputStatusClass = isValid === true
    ? styles.success
    : isValid === false
      ? styles.error
      : styles.normal; // Set to normal if no validation status

  return (
    <Form.Item className="flex flex-col m-0" name={name}>
      {label && (
        <span>
          <Text className={`${styles.label}`}>{label}</Text>
        </span>
      )}
      <div className="flex items-center">
        <AntInput
          placeholder={placeholder}
          value={inputValue}
          disabled={loading || disabled}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          suffix={
            loading ? (
              <Spin />
            ) : (
              <Button onClick={handleApiCall} label="Check" />
            )
          }
          className={`${styles.input} ${inputStatusClass}`} // Combine input and status class
        />
      </div>
      {message && (
        <Text className={`${isValid ? styles.successText : styles.errorText}`}>
          {isValid ? (
            <>
              <CheckCircleFilled /> {message}
            </>
          ) : (
            <>
              <CloseCircleFilled /> {message}
            </>
          )}
        </Text>
      )}
    </Form.Item>
  );
};

export default ValidatedInput;
