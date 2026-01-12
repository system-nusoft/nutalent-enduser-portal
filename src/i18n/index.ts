import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
import commonEn from "./en/common.json";
import commonUr from "./ur/common.json";

i18next
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: true,
    interpolation: { escapeValue: false },
    resources: {
      en: {
        translation: commonEn,
      },
      ur: {
        translation: commonUr,
      },
    },
    react: { useSuspense: false },
  });

export default i18next;
