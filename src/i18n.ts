import i18n from "i18next";
import { initReactI18next } from "react-i18next/initReactI18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

// Get the base URL from environment or default to repository name
const base =
  process.env.NODE_ENV === "production"
    ? `/${process.env.GITHUB_REPOSITORY?.split("/")[1] || "sanjeev-portfolio"}/`
    : "/";

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: {
      "zh-HK": ["zh", "en"],
      "zh-TW": ["zh", "en"],
      "zh-CN": ["zh", "en"],
      "ko-KR": ["ko", "en"],
      "pt-BR": ["pt", "en"],
      default: ["en"],
    },
    supportedLngs: ["en", "ja", "de", "zh", "ko", "fr", "es", "pt"],
    debug: process.env.NODE_ENV === "development",
    returnObjects: true,
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: `${base}locales/{{lng}}/{{ns}}.json`,
    },
  });

// Update <html lang> attribute when language changes (WCAG 3.1.1)
i18n.on("languageChanged", (lng: string) => {
  document.documentElement.lang = lng;
});

export default i18n;
