import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ArrowSmallLeft } from "src/assets";

interface BackButtonProps {
  onBack?: () => void;
  disabled?: boolean;
}

export const BackButton: React.FC<BackButtonProps> = ({ onBack, disabled = false }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleGoBack = () => {
    if (!disabled) {
      if (onBack) {
        onBack();
      } else {
        navigate(-1);
      }
    }
  };

  return (
    <span
      onClick={handleGoBack}
      className={`flex mb-2 gap-2 cursor-pointer items-center font-semibold ${disabled ? 'cursor-not-allowed text-gray-400' : ''}`}
    >
      <ArrowSmallLeft />
      {t("heading.back")}
    </span>
  );
};
