import { Form } from "antd";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import RequestAppAction from "src/store/slices/app-actions";
import Button from "../button/Button";
import Input from "../input";
import { Notification } from "../notification/Notification";

interface props {
  currentTab?: "password" | null | "info";
  setCurrentTab?: (text: "password") => void;
}
export const ProfilePasswordFields: React.FC<props> = ({
  currentTab,
  setCurrentTab,
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const comparePasswords = () => {
    const debounceTimeout = setTimeout(() => {
      const val = form.getFieldValue("newPassword");
      const confirmPass = form.getFieldValue("reTypePassword");

      if (val !== confirmPass && confirmPass?.length > 0) {
        form.setFields([
          {
            name: "newPassword",
            errors: undefined,
          },
          {
            name: "reTypePassword",
            errors: [t("error.passwordDoNotMatch")],
          },
        ]);
      }

      if (val === confirmPass && confirmPass?.length > 0) {
        form.setFields([
          {
            name: "newPassword",
            errors: undefined,
          },
          {
            name: "reTypePassword",
            errors: undefined,
          },
        ]);
      }
      // TODO : Parrsword regex functionality
      // if (!PASSWORDREGEX.test(val) && val?.length > 0) {
      //   form.setFields([
      //     {
      //       name: "password",
      //       errors: [t("error.passwordRegexError1")],
      //     },
      //     {
      //       name: "confirmPassword",
      //       errors: [t("error.passwordRegexError2")],
      //     },
      //   ]);
      // }
    }, 500);

    return () => {
      clearTimeout(debounceTimeout);
    };
  };
  const dispatch = useDispatch();
  const onFinish = (values: any) => {
    const { currentPassword, newPassword } = values;
    dispatch(
      RequestAppAction.handleUpdatePassword({
        data: { currentPassword, newPassword },
        cbSuccess: () => {
          form.resetFields();
          Notification({ type: "success", message: t("labels.success") });
        },
      })
    );
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      className="flex flex-col gap-6 white-container"
    >
      <div className="flex flex-row items-center justify-between">
        <p className="heading-3">{t("labels.changePassword")}</p>
        <Button
          btn_class="filled_btn"
          btn_Type={currentTab !== "password" ? "button" : "submit"}
          onClick={() => {
            if (currentTab !== "password" && setCurrentTab) {
              setCurrentTab("password");
            }
          }}
          label={
            currentTab !== "password" ? t("button.edit") : t("labels.save")
          }
        />
      </div>

      <div className="flex gap-4 flex-col">
        <Input
          size="large"
          label={t("labels.currentPassword")}
          name={"currentPassword"}
          inputType="password"
          disabled={currentTab !== "password"}
          rules={[{ required: true, message: t("error.passwordRequired") }]}
        />
        <Input
          size="large"
          label={t("labels.newPassword")}
          name={"newPassword"}
          inputType="password"
          disabled={currentTab !== "password"}
          onChange={comparePasswords}
          rules={[{ required: true, message: t("error.newPasswordRequired") }]}
        />
        <Input
          size="large"
          label={t("labels.reTypePassword")}
          name={"reTypePassword"}
          inputType="password"
          disabled={currentTab !== "password"}
          onChange={comparePasswords}
          rules={[{ required: true, message: t("error.passwordRequired") }]}
        />
      </div>
    </Form>
  );
};
