import { CloseCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Avatar, Form, Spin } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { ImagePlaceholder, Logo } from "src/assets";
import { Button, Input, Notification } from "src/components";
import { ROUTES } from "src/constants/navigation-routes";
import { getUploadImageLoading } from "src/store/selectors/features/upload-image-selector";
import { getUserLoading } from "src/store/selectors/features/user-selector";
import { verifyTokenLoading } from "src/store/selectors/features/verify-token-selector";
import RequestAppAction from "src/store/slices/app-actions";
import RequestAuthAction from "src/store/slices/auth-actions";
import { PASSWORDREGEX } from "src/utils/functions";
import styles from "./styles.module.scss";
const ProfileSetup: React.FC = () => {
  const { t } = useTranslation();
  const [form] = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [image, setImage] = useState<null | string>(null);
  const isLoading = useSelector(getUserLoading);
  const isVerifying = useSelector(verifyTokenLoading);
  const uploadRef = useRef<HTMLInputElement>(null);
  const isUploading = useSelector(getUploadImageLoading);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const userId = params.get("userId");
  const token = params.get("token");

  const onFinish = (values: {
    firstName: string;
    lastName: string;
    password: string;
  }) => {
    const { firstName, lastName, password } = values;
    const data: {
      firstName: string;
      lastName: string;
      password: string;
      userId: string | null;
      profilePicture?: string | null;
    } = { firstName, lastName, password, userId };

    if (image) data.profilePicture = image;
    if (userId) {
      dispatch(
        RequestAuthAction.handleAccountSetup({
          data: { ...data },
          cbSuccess: () => {
            Notification({
              type: "success",
              message: t("notification.userCreated"),
            });
            navigate(ROUTES.LOGIN);
          },
        })
      );
    }

    // send Email api here
  };

  const uploadFile = (val: FileList | null) => {
    if (val) {
      const file = val[0];
      const formData = new FormData();
      formData.append("file", file);

      dispatch(
        RequestAppAction.handleUploadImage({
          data: formData,
          cbSuccess: (res) => {
            setImage(res?.data);
            if (uploadRef.current) uploadRef.current.value = ""; // clear state for 2nd use
          },
          cbFailure: () => {
            if (uploadRef.current) uploadRef.current.value = ""; // clear state for 2nd use
          },
        })
      );
    }
  };

  useEffect(() => {
    if (userId && token) {
      dispatch(
        RequestAuthAction.handleVerifyToken({
          id: userId,
          token: token,
          cbFailure: () => {
            setTimeout(() => {
              navigate(ROUTES.LOGIN);
            }, 500);
          },
        })
      );
    } else {
      Notification({ type: "error", message: t("notifiation.invalidToken") });
      setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, 500);
    }
  }, []);

  const comparePasswords = () => {
    const debounceTimeout = setTimeout(() => {
      const val = form.getFieldValue("password");
      if (!PASSWORDREGEX.test(val) && val?.length > 0) {
        form.setFields([
          {
            name: "password",
            errors: [t("message.passwordRegexError")],
          },
        ]);
      } else {
        form.setFields([
          {
            name: "password",
            errors: undefined,
          },
        ]);
      }
    }, 500);
    return () => {
      clearTimeout(debounceTimeout);
    };
  };

  return (
    <>
      <div className="h-full w-full ">
        <div className="grid lg:grid-cols-2 sm:grid-cols-1  h-full">
          <div className={`${styles.main_container} relative hidden  lg:block`}>
            <div className="flex flex-col pl-8 justify-center h-full gap-3">
              <div className="absolute top-5 left-8">
                <Logo />
              </div>
              <div className={`${styles.heading} w-1/2`}>
                {t("login.heading")}
              </div>
              {/* <div className={`${styles.description} w-9/12`}>
                {t("login.description")}
              </div> */}
            </div>
          </div>
          <div className="bg-white flex items-center justify-center">
            <Form
              form={form}
              onFinish={onFinish}
              requiredMark={false}
              className="flex flex-col gap-8 items-center justify-center w-full"
            >
              <div className="flex flex-col items-center justify-center gap-2">
                <div className={styles.label}>{t("profileSetup.heading")}</div>
                <div className={`${styles.description} w-3/4 text-center`}>
                  {t("profileSetup.description")}
                </div>
              </div>

              <div className="w-1/2 grid lg:grid-cols-4   sm:grid-cols-2  gap-4 px-6">
                <div className="lg:col-span-4 sm:col-span-2 sm:flex items-center justify-center">
                  <div className="relative">
                    <input
                      style={{ display: "none" }}
                      className="hidden"
                      ref={uploadRef}
                      type="file"
                      multiple={false}
                      accept=".jpg,.jpeg,.png"
                      onChange={(val) => {
                        const value = val.target.files;
                        uploadFile(value);
                      }}
                    />
                    <Spin spinning={isUploading}>
                      <Avatar
                        className={` bg-white border border-slate-300  overflow-hidden ${
                          image ? "cursor-default" : "cursor-pointer"
                        }`}
                        src={image}
                        shape="circle"
                        onClick={() => {
                          if (!image) uploadRef.current?.click();
                        }}
                        size={90}
                      >
                        {!image && <ImagePlaceholder />}
                      </Avatar>
                    </Spin>
                    {image && (
                      <div
                        onClick={() => setImage(null)}
                        className="absolute cursor-pointer"
                        style={{ top: "-1rem", right: "-0.5rem" }}
                      >
                        <CloseCircleOutlined className="text-black " />
                      </div>
                    )}
                    <PlusCircleOutlined
                      style={{
                        color: "#cbd5e1",
                        fontSize: "1.25rem",
                        position: "absolute",
                        right: "-4px",
                        bottom: "-4px",
                      }}
                    />
                  </div>
                </div>
                <div className="col-span-4">
                  <Input
                    name="firstName"
                    disabled={isLoading || isVerifying}
                    label={t("labels.firstName")}
                    placeholder={t("placeholder.firstName")}
                    rules={[
                      { required: true, message: t("error.firstNameRequired") },
                    ]}
                  />
                </div>
                <div className="col-span-4">
                  <Input
                    name="lastName"
                    disabled={isLoading || isVerifying}
                    label={t("labels.lastName")}
                    placeholder={t("placeholder.lastName")}
                    rules={[
                      { required: true, message: t("error.lastNameRequired") },
                    ]}
                  />
                </div>
                <div className="col-span-4">
                  <Input
                    name="password"
                    inputType="password"
                    disabled={isLoading || isVerifying}
                    label={t("labels.password")}
                    placeholder={t("placeholder.password")}
                    onChange={comparePasswords}
                    rules={[
                      { required: true, message: t("error.passwordRequired") },
                    ]}
                  />
                </div>
              </div>
              <Spin spinning={isLoading || isVerifying}>
                <Button
                  btn_Type="submit"
                  btn_class="filled_btn_large"
                  label={t("button.submit")}
                />
              </Spin>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileSetup;
