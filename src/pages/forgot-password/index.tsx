import { Form, Spin } from "antd";
import { useForm } from "antd/es/form/Form";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Logo } from "src/assets";
import { Button, Input, Notification } from "src/components";
import { ROUTES } from "src/constants/navigation-routes";
import { passwordLoading } from "src/store/selectors/features/password-selector";
import RequestAuthAction from "src/store/slices/auth-actions";
import styles from "./styles.module.scss";

const ForgotPassword: React.FC = () => {
  const { t } = useTranslation();
  const [form] = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector(passwordLoading);

  const onFinish = (values: { email: string }) => {
    const { email } = values;
    dispatch(
      RequestAuthAction.handleForgotPassword({
        email,
        cbSuccess: (res: any) => {
          Notification({
            type: "success",
            message: res?.message || t("notification.emailSent"),
          });
          navigate(-1);
        },
      })
    );
  };

  return (
    <>
      <div className="h-full w-full ">
        <div className="grid grid-cols-2  h-full">
          <div
            className={`${styles.main_container} relative flex flex-col pl-8 justify-center gap-3`}
          >
            <div className="absolute top-5 left-8">
              <Logo />
            </div>
            <div className={`${styles.heading} w-1/2`}>
              {t("login.heading")}
            </div>
            {/* <div className={`${styles.description} w-3/5`}>
              {t("login.description")}
            </div> */}
          </div>
          <div className="bg-white flex items-center justify-center">
            <Form
              form={form}
              requiredMark={false}
              onFinish={onFinish}
              className="flex flex-col gap-8 items-center justify-center w-full"
            >
              <div className="flex flex-col items-center justify-center gap-2">
                <div className={styles.label}>
                  {t("forgotPassword.heading")}
                </div>
                <div className={`${styles.description} w-3/5 text-center`}>
                  {t("forgotPassword.description")}
                </div>
              </div>

              <div className="w-2/5">
                <Input
                  name="email"
                  label={t("labels.email")}
                  disabled={isLoading}
                  placeholder={t("placeholder.email")}
                  rules={[
                    { required: true, message: t("error.emailRequired") },
                  ]}
                />
              </div>

              <Spin spinning={isLoading}>
                <Button btn_Type="submit" label={t("button.submit")} />
              </Spin>

              <div className={styles.hyper_link_description}>
                {t("forgotPassword.click")}{" "}
                <span
                  onClick={() => navigate(ROUTES.LOGIN)}
                  className={styles.hyper_link}
                >
                  {t("forgotPassword.here")}
                </span>{" "}
                {t("forgotPassword.toLogin")}
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
