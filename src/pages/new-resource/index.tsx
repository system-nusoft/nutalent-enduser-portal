import { useTranslation } from "react-i18next";
import { Disclaimer } from "src/assets";
import { JDSearchInput } from "src/components/j-d-search-input/JDSearchInput";
import { PrivatePageTemplate } from "src/components/private-page-template/PrivatePageTemplate";
import styles from "./styles.module.scss";
export const NewResource = () => {
  const { t } = useTranslation();

  return (
    <PrivatePageTemplate
      title={t("heading.hireNow")}
      center
      description={t("newResource.description")}
    >
      <div className="flex flex-col align-middle items-center justify-center">
        <div className="w-1/2 overflow-hidden gap-4 flex flex-col">
          <div className={styles.card}>
            <div className="flex p-4   grow">
              <div className="flex flex-col justify-center gap-2">
                <div className={styles.heading}>{t("heading.disclaimer!")}</div>
                <div className={styles.description}>
                  {t("newResource.card.description")}
                </div>
              </div>
              <div>
                <Disclaimer />
              </div>
              <div className="flex grow-0 flex-col gap-2">
                <img />
              </div>
            </div>
          </div>
          <div>
            <JDSearchInput />
          </div>
          <div className="flex justify-between items-center">
            <div className={styles.example_text}>
              {t("heading.example")}{" "}
              <span className={styles.skills}>{t("placeholder.skills")} </span>
            </div>
            <span className={`${styles.skills}`}>
              {t("placeholder.poweredByAI")}
            </span>
          </div>
        </div>
      </div>
    </PrivatePageTemplate>
  );
};
