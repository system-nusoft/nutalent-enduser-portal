import { RightOutlined } from "@ant-design/icons";
import { Avatar, Tooltip } from "antd";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ArrowSmallLeft, Info } from "src/assets";
import { colors } from "src/utils/colors";
import Button from "../button/Button";
import styles from "./styles.module.scss";

interface buttonProp {
  onClick: () => void;
  label?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  tooltip?: { text: string };
  btn_class?:
    | "filled_btn_large"
    | "filled_btn"
    | "white_btn"
    | "transparent_btn"
    | "card_grey_btn";
}
export const PageHeader = ({
  title,
  description,
  center,
  buttons,
  avatar,
  img,
  backBtn,
  tabs,
}: {
  title?: string;
  description?: string | ReactNode;
  center?: boolean;
  avatar?: { name: string; img?: string | undefined } | undefined;
  buttons?: buttonProp[] | false;
  img?: string;
  backBtn?: boolean;
  tabs?: {
    data: { id: number; label: string; path: string; toolTipText?: string }[];
    onClick: (id: number) => void;
  };
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = React.useState(0);
  const handleGoBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (tabs) {
      if (window.location.hash) {
        const elementId = window.location.hash.substring(1); // Remove #
        tabs.data.map((tab) => {
          const path = tab.path.substring(1);
          if (path === elementId) {
            setSelectedTab(tab.id);
            tabs?.onClick(tab.id);
          }
        });
      } else {
        navigate(tabs.data[0].path);
        setSelectedTab(tabs.data[0].id);
        tabs?.onClick(tabs.data[0].id);
      }
    }
  }, []);

  return (
    <div className="grid grid-cols-12 gap-4 mt-2">
      <div
        className={`flex  gap-3  ${
          center ? "items-center justify-center col-span-12" : "col-span-8 "
        } `}
      >
        {backBtn && (
          <span
            onClick={handleGoBack}
            className={`flex  mb-2 gap-4 cursor-pointer mt-5 items-center ${styles.back_button}`}
          >
            <ArrowSmallLeft />
            {t("heading.back")}
          </span>
        )}
        {avatar && (
          <div>
            <Avatar
              src={img || avatar?.img || undefined}
              className={`${styles.avatar}`}
              size={70}
            >
              <span className={styles.text}>{avatar.name?.charAt(0)}</span>
            </Avatar>
          </div>
        )}
        <div className="flex flex-col  gap-3">
          <div
            className={`${styles.heading} ${
              center ? "text-center" : "flex items-center justify-start gap-2"
            }`}
          >
            <div>{title}</div>
            {tabs ? (
              <div className="flex justify-center gap-2 items-center">
                <RightOutlined className={styles.icon} />
                {tabs?.data?.map((tab, index) => (
                  <div
                    key={`${index}`}
                    onClick={() => (
                      tabs.onClick(tab.id), setSelectedTab(tab.id)
                    )}
                    className={`cursor-pointer mt-2 p-2 ${
                      selectedTab === tab.id &&
                      "rounded-lg border border-gray-300 bg-gray-200"
                    }`}
                  >
                    <p
                      className={`${
                        selectedTab === tab?.id
                          ? "lg-text-tab-selected"
                          : "lg-text-tab"
                      } flex items-center gap-1`}
                    >
                      {tab.label}
                      {tab.toolTipText ? (
                        <Tooltip
                          color={colors.tooltip}
                          title={tab?.toolTipText}
                        >
                          <Info />
                        </Tooltip>
                      ) : (
                        <></>
                      )}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <></>
            )}
          </div>
          {description && (
            <span
              className={`${styles.description} ${center ? "text-center" : ""}`}
            >
              {description}
            </span>
          )}
        </div>
      </div>

      <div className="col-span-4  justify-end items-start pt-2 flex gap-4">
        {Array.isArray(buttons) &&
          buttons?.map(
            ({ tooltip, label, disabled, onClick, icon, btn_class }, index) => (
              <Button
                key={`${index}`}
                btn_class={btn_class ?? "filled_btn"}
                label={label}
                toolTipTitle={tooltip?.text ?? ""}
                icon={icon}
                disabled={disabled}
                onClick={onClick}
              />
            )
          )}
      </div>
    </div>
  );
};
