import { Upload } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Upload as UploadIcon } from "src/assets"; // Custom icon
import RequestAppAction from "src/store/slices/app-actions";
import styles from "./styles.module.scss";

interface FileUploadProps {
  onFileUpload: (file: File | File[]) => void;
  maxSize?: number; // in MB
  type?: "image" | "doc";
  multiple?: boolean; // Allow multiple files
  disabled?: boolean;
  initialValue?: any[];
  clearImage?: any;
}

const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg"];
const ALLOWED_DOC_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]; // docx, pdf

export const UploadFile: React.FC<FileUploadProps> = ({
  onFileUpload,
  maxSize = 5,
  type = "image",
  multiple = false,
  disabled,
  initialValue,
  clearImage,
}) => {
  const { t } = useTranslation();
  const [fileList, setFileList] = useState<any>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string>("");

  // Validate files by type and size
  const validateFile = (file: File): boolean => {
    const allowedTypes =
      type === "doc" ? ALLOWED_DOC_TYPES : ALLOWED_IMAGE_TYPES;
    const fileMaxSize = maxSize * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setError(
        type === "doc"
          ? t("error.onlyPDFAndDOCXAllowed")
          : t("labels.onlyPNGAndJPGAllowed")
      );
      return false;
    }

    if (file.size > fileMaxSize) {
      setError(t("error.maxFileSize").replace("{maxSize}", maxSize.toString()));
      return false;
    }

    setError("");
    return true;
  };

  const dispatch = useDispatch();

  // Handle file changes
  const handleChange = (info: any) => {
    const selectedFiles = info.fileList
      .map((fileObj: any) => fileObj.originFileObj)
      .filter(Boolean); // Filter out undefined

    if (selectedFiles.length === 0) {
      setFileList([]);
      setPreviews([]);
      setError("");
      onFileUpload([]);
      return;
    }

    const validFiles: File[] = selectedFiles.filter((file: File) =>
      validateFile(file)
    );

    if (validFiles.length > 0) {
      const filesToSet = multiple
        ? validFiles
        : [validFiles[validFiles.length - 1]]; // Use the last file if not multiple

      const formData = new FormData();

      if (multiple) {
        filesToSet.forEach((file, index) => {
          formData.append(`files[${index}]`, file);
        });
      } else {
        formData.append("file", filesToSet[0]);
      }

      dispatch(
        RequestAppAction.handleUploadImage({
          data: formData,
          cbSuccess: (res) => {
            setFileList(filesToSet);
            onFileUpload(res?.data);

            // Preview images if image type
            if (type === "image") {
              const previewPromises = validFiles.map((file) => {
                return new Promise<string>((resolve) => {
                  const reader = new FileReader();
                  reader.onload = (e) => resolve(e.target?.result as string);
                  reader.readAsDataURL(file);
                });
              });

              Promise.all(previewPromises).then((images) => {
                setPreviews(images);
              });
            }
          },
        })
      );
    } else {
      setFileList([]);
      setPreviews([]);
    }
  };

  useEffect(() => {
    // Set initial value if provided
    if (
      initialValue &&
      Array.isArray(initialValue) &&
      initialValue?.length > 0
    ) {
      setFileList(initialValue);
      setPreviews(initialValue.map((item: any) => item));
    }
  }, [initialValue]);

  return (
    <div
      className={`${styles.upload_container} flex flex-col w-full gap-4 p-4`}
    >
      <Upload
        disabled={disabled}
        name="image"
        multiple={multiple}
        fileList={fileList}
        onRemove={(val) => {
          if (Array.isArray(fileList) && fileList?.length > 0) {
            const valueArr = fileList?.filter((i: any) => i !== val);
            setFileList(valueArr);
            setPreviews(valueArr);
            if (clearImage) {
              clearImage();
            }
          }
        }}
        beforeUpload={() => false} // Disable automatic upload
        customRequest={() => {}} // Disable Ant Design's default file handling
        onChange={(info) => handleChange(info)} // Update on change
        className="flex flex-col items-center w-full"
        accept={
          type === "doc"
            ? ALLOWED_DOC_TYPES.join(",")
            : ALLOWED_IMAGE_TYPES.join(",")
        }
      >
        <div id="drop-zone" className="p-4 text-center cursor-pointer">
          <div className="flex flex-row items-center justify-center gap-6">
            <UploadIcon />
            <div className="flex flex-col items-start justify-start gap-1">
              <p className="heading-4">
                {t("labels.upload")}{" "}
                {type === "image" ? t("labels.image") : t("labels.file")}
              </p>
              <p className="normal-text">
                {t("labels.dragAndDrop")}{" "}
                {type === "image" ? ".jpg or .png" : ".pdf or .docx"}
              </p>
            </div>
          </div>
        </div>
      </Upload>

      {/* Image Previews */}
      {type === "image" && previews.length > 0 && (
        <div id="image-preview" className="flex justify-center gap-3">
          {previews.map((preview, index) => (
            <img
              key={index}
              src={preview}
              alt="Uploaded"
              className="h-auto rounded w-44"
            />
          ))}
        </div>
      )}

      {error && (
        <div id="error-message" className="mt-2 text-red-500">
          {error}
        </div>
      )}
    </div>
  );
};
