import { Form, Spin } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Logo } from "src/assets";
import { Button, Input } from "src/components";
import { ROUTES } from "src/constants/navigation-routes";
import { loginLoading } from "src/store/selectors/features/login-selector";
import RequestAuthAction from "src/store/slices/auth-actions";
import { toggleClearLogin } from "src/store/slices/features/auth";
import styles from "./styles.module.scss";

const Login: React.FC = () => {
  const { t } = useTranslation();
  const [form] = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector(loginLoading);

  const onFinish = (values: { email: string; password: string }) => {
    const { email, password } = values;
    dispatch(
      RequestAuthAction.handleLogin({
        email,
        password,
        t,
        cbSuccess: () => {
          navigate(ROUTES.DASHBOARD);
        },
      })
    );
  };

  useEffect(() => {
    dispatch(toggleClearLogin());
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
          </div>
          <div className="bg-white flex items-center justify-center">
            <Form
              form={form}
              requiredMark={false}
              onFinish={onFinish}
              className="flex flex-col gap-8 items-center justify-center w-full"
            >
              <div className="flex flex-col items-center justify-center gap-2">
                <div className={styles.label}>{t("labels.signIn")}</div>
                <div>{t("login.endlessPossibilities")}</div>
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
              <div className="w-2/5">
                <Input
                  name="password"
                  label={t("labels.password")}
                  disabled={isLoading}
                  placeholder={t("placeholder.password")}
                  inputType="password"
                  rules={[
                    { required: true, message: t("error.passwordRequired") },
                  ]}
                />
              </div>
              <Spin spinning={isLoading}>
                <Button btn_Type="submit" label={t("login.login")} />
              </Spin>

              <div>
                <div className={styles.hyper_link_description}>
                  <div>{t("login.cannotRememberPassword")}</div>
                  <div
                    onClick={() => navigate(ROUTES.FORGOT_PASSWORD)}
                    className={styles.hyper_link}
                  >
                    {t("login.toResetPassword")}
                  </div>{" "}
                  {/* {t("login.toResetPassword")} */}
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
