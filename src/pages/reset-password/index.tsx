import { Form, Spin } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Logo } from "src/assets";
import { Button, Input, Notification } from "src/components";
import { ROUTES } from "src/constants/navigation-routes";
import { passwordLoading } from "src/store/selectors/features/password-selector";
import { verifyTokenLoading } from "src/store/selectors/features/verify-token-selector";
import RequestAuthAction from "src/store/slices/auth-actions";
import styles from "./styles.module.scss";
import { PASSWORDREGEX } from "src/utils/functions";

const ResetPassword: React.FC = () => {
  const { t } = useTranslation();
  const [form] = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector(passwordLoading);
  const isVerifying = useSelector(verifyTokenLoading);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const userId = params.get("userId");
  const token = params.get("token");

  const onFinish = (values: { password: string }) => {
    const { password } = values;
    if (token && userId)
      dispatch(
        RequestAuthAction.handleResetPassword({
          token: token,
          userId: userId,
          password: password,
          cbSuccess: (res: any) => {
            Notification({ type: "success", message: res?.message });
            setTimeout(() => {
              navigate(ROUTES.LOGIN);
            }, 500);
          },
        })
      );
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
            <div className={`${styles.heading}  w-1/2`}>
              {t("login.heading")}
            </div>
            {/* <div className={`${styles.description} w-9/12`}>
              {t("login.description")}
            </div> */}
          </div>
          <div className="bg-white flex items-center justify-center">
            <Form
              form={form}
              onFinish={onFinish}
              className="flex flex-col gap-8 items-center justify-center w-full"
            >
              <div className="flex flex-col items-center justify-center gap-2">
                <div className={styles.label}>{t("resetPassword.heading")}</div>
                <div className={`${styles.description} w-8/12 text-center`}>
                  {t("resetPassword.description")}
                </div>
              </div>

              <div className="w-2/4 flex flex-col gap-2">
                <Input
                  name="password"
                  disabled={isLoading || isVerifying}
                  inputType="password"
                  label={t("labels.password")}
                  placeholder={t("placeholder.password")}
                  rules={[
                    { required: true, message: t("error.passwordRequired") },
                    {
                      pattern: PASSWORDREGEX,
                      message: t("error.passwordInvalid"),
                    },
                    {
                      validator: async (_: unknown, value: string) => {
                        const confirmPassword =
                          form.getFieldValue("confirmPassowrd");
                        if (
                          value &&
                          value !== confirmPassword &&
                          confirmPassword?.length > 0
                        ) {
                          form.setFields([
                            {
                              name: "confirmPassowrd",
                              errors: [t("error.passwordMismatch")],
                            },
                          ]);
                        } else {
                          form.setFields([
                            {
                              name: "confirmPassowrd",
                              errors: undefined,
                            },
                          ]);
                        }
                      },
                    },
                  ]}
                />
                <Input
                  name="confirmPassowrd"
                  label={t("labels.confirmPassword")}
                  disabled={isLoading || isVerifying}
                  inputType="password"
                  placeholder={t("placeholder.password")}
                  rules={[
                    { required: true, message: t("error.passwordRequired") },
                    {
                      validator: async (_: unknown, value: string) => {
                        const password = form.getFieldValue("password");
                        if (value && value !== password) {
                          throw new Error(t("error.passwordMismatch"));
                        }
                      },
                    },
                  ]}
                />
              </div>

              <Spin spinning={isLoading || isVerifying}>
                <Button btn_Type="submit" label={t("button.submit")} />
              </Spin>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
