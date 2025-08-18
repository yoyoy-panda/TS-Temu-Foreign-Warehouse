import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enUSTranslation from "./en-US.json";
import zhTWTranslation from "./zh-TW.json";
import zhCNTranslation from "./zh-CN.json";

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      "en-US": enUSTranslation,
      "zh-TW": zhTWTranslation,
      "zh-CN": zhCNTranslation,
    },
    lng: "zh-TW", // default language
    fallbackLng: "en-US", // fallback language if current language is not available
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
