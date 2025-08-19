import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import enUSTranslation from "./en-US.json";
import zhTWTranslation from "./zh-TW.json";
import zhCNTranslation from "./zh-CN.json";

i18n
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      "en-US": {
        translation: enUSTranslation.translation,
      },
      "zh-TW": {
        translation: zhTWTranslation.translation,
      },
      "zh-CN": {
        translation: zhCNTranslation.translation,
      },
    },
    fallbackLng: "en-US", // fallback language if current language is not available
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["navigator", "querystring", "cookie", "localStorage", "sessionStorage", "htmlTag", "path", "subdomain"],
      caches: ["localStorage"],
    },
  });

export default i18n;
