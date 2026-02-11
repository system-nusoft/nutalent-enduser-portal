import { Form, Spin } from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Button, Input, UploadFile } from "src/components";
import { PrivatePageTemplate } from "src/components/private-page-template/PrivatePageTemplate";
import { ProfilePasswordFields } from "src/components/profile-password-fields/ProfilePasswordFields";
import {
  getUserData,
  getUserLoading,
} from "src/store/selectors/features/user-selector";
import RequestAppAction from "src/store/slices/app-actions";

interface props {
  title: string;
}

export const Profile = ({ title }: props) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<"password" | "info" | null>(null);
  const user: any = useSelector(getUserData);

  // State for personal info
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  // State for password change
  const [passwordInfo, setPasswordInfo] = useState({
    currentPassword: "",
    newPassword: "",
    reTypePassword: "",
  });

  // Validation errors
  const [personalInfoErrors, setPersonalInfoErrors] = useState({
    name: "",
    email: "",
  });

  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: "",
    newPassword: "",
    reTypePassword: "",
  });

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalInfo({
      ...personalInfo,
      [name]: value,
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordInfo({
      ...passwordInfo,
      [name]: value,
    });
  };

  const dispatch = useDispatch();
  // Profile image handler (only handling file upload, no state needed here)
  const onProfilePicChange = (file: any) => {
    // dispatch(RequestAppAction.)
    // TODO: Add logic for handling profile pic change (e.g., API call)
    if (file) {
      form.setFieldValue("image", file);
    } else {
      form.setFieldValue("image", null);
    }
  };

  // Validate and submit personal info

  const onPersonalInfoChange = () => {
    form
      .validateFields()
      .then(() => {
        onEdit();
      })
      .catch(() => {});
  };

  // Validate and submit password change
  const validatePasswordChange = () => {
    let valid = true;
    let newErrors = { ...passwordErrors };

    if (!passwordInfo.currentPassword) {
      newErrors.currentPassword = t("error.fieldIsRequired").replace(
        "{field}",
        "Current Password",
      );
      valid = false;
    } else {
      newErrors.currentPassword = "";
    }

    if (!passwordInfo.newPassword) {
      newErrors.newPassword = t("error.fieldIsRequired").replace(
        "{field}",
        "New Password",
      );
      valid = false;
    } else {
      newErrors.newPassword = "";
    }

    if (passwordInfo.newPassword !== passwordInfo.reTypePassword) {
      newErrors.reTypePassword = t("error.passwordMismatch");
      valid = false;
    } else {
      newErrors.reTypePassword = "";
    }

    setPasswordErrors(newErrors);
    return valid;
  };

  const [form] = useForm();
  const onEdit = () => {
    const val = form.getFieldsValue();
    const req: {
      firstName?: string;
      profilePicture?: string | null;
      lastName?: string;
    } = {
      firstName: val?.firstName,
      lastName: val?.lastName,
    };
    const image = form.getFieldValue("image");

    if (Array.isArray(image) && image?.length < 1) {
      req.profilePicture = null;
      form.setFieldValue("image", null);
    } else {
      if (image) {
        req.profilePicture = image;
      }
    }

    dispatch(
      RequestAppAction.handlePutUser({
        data: req,
        cbSuccess: () => {
          setActiveTab(null);
          dispatch(RequestAppAction.handleGetUser());
        },
      }),
    );
  };

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        image: user?.profilePicture,
      });
    }
  }, [user]);
  const isLoading = useSelector(getUserLoading);
  return (
    <PrivatePageTemplate
      title={title}
      center
      description={t("messages.profileSettingsMessage")}
    >
      <div className="grid grid-cols-2 gap-4">
        {/* Update Personal Information */}
        <Form form={form} className="flex flex-col gap-4 white-container">
          <Spin spinning={isLoading}>
            <div className="flex flex-row items-center justify-between">
              <p className="heading-3">{t("labels.personalInformation")}</p>
              <Button
                btn_class="filled_btn"
                label={
                  activeTab !== "info" ? t("button.edit") : t("labels.save")
                }
                onClick={() => {
                  if (activeTab !== "info") {
                    setActiveTab("info");
                  } else {
                    onPersonalInfoChange();
                  }
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                size="large"
                label={t("labels.firstName")}
                name={"firstName"}
                disabled={activeTab !== "info"}
                value={personalInfo.firstName}
                onChange={handlePersonalInfoChange}
                error={personalInfoErrors.name}
                rules={[
                  { required: true, message: t("error.nameRequired") },
                  {
                    pattern: /^[a-zA-Z\s'-]+$/,
                    message:
                      "First name can only contain letters, spaces, hyphens, and apostrophes",
                  },
                ]}
              />
              <Input
                size="large"
                label={t("labels.lastName")}
                name={"lastName"}
                disabled={activeTab !== "info"}
                value={personalInfo.lastName}
                onChange={handlePersonalInfoChange}
                error={personalInfoErrors.name}
                rules={[
                  { required: true, message: t("error.nameRequired") },
                  {
                    pattern: /^[a-zA-Z\s'-]+$/,
                    message:
                      "Last name can only contain letters, spaces, hyphens, and apostrophes",
                  },
                ]}
              />
              <div className="col-span-2">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    size="large"
                    label={t("labels.email")}
                    name={"email"}
                    disabled={true}
                    value={personalInfo.email}
                    onChange={handlePersonalInfoChange}
                    error={personalInfoErrors.email}
                    rules={[
                      { required: true, message: t("error.emailRequired") },
                    ]}
                  />
                </div>
              </div>
              <div className="flex flex-col col-span-2 items-start  justify-between">
                <p className="heading-3 pb-3">{t("labels.profileImage")}</p>
                <UploadFile
                  maxSize={1}
                  initialValue={
                    form.getFieldValue("image")
                      ? [form.getFieldValue("image")]
                      : undefined
                  }
                  clearImage={() => {
                    form.setFieldValue("image", undefined);
                  }}
                  type="image"
                  disabled={activeTab !== "info"}
                  multiple={false}
                  onFileUpload={onProfilePicChange}
                />
              </div>
            </div>
          </Spin>
        </Form>

        {/* Change Password */}
        <ProfilePasswordFields
          currentTab={activeTab}
          setCurrentTab={setActiveTab}
        />
      </div>
    </PrivatePageTemplate>
  );
};
