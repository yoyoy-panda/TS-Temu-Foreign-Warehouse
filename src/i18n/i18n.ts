import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "./en.json";
import zhTWTranslation from "./zh-TW.json";

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: enTranslation,
      "zh-TW": zhTWTranslation,
    },
    lng: "zh-TW", // default language
    fallbackLng: "en", // fallback language if current language is not available
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
