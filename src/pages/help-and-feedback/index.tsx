import { useTranslation } from "react-i18next";
import { Accordian } from "src/components";
import { PrivatePageTemplate } from "src/components/private-page-template/PrivatePageTemplate";

export const HelpAndFeedBack = ({ title }: { title: string }) => {
  const { t } = useTranslation();
  return (
    <PrivatePageTemplate
      center
      title={title}
      description={t("help&feedback.description")}
    >
      <Accordian />
    </PrivatePageTemplate>
  );
};
