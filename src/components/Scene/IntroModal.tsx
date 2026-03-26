import { useTranslation } from "react-i18next";
import resumePDF from "@/assets/docs/Sanjeev.pdf";
import { SpaceModal } from "./SpaceModal";

type IntroModalProps = {
  onClose: () => void;
};

export const IntroModal = ({ onClose }: IntroModalProps) => {
  const { t } = useTranslation();

  return (
    <SpaceModal
      onClose={onClose}
      className="w-full max-w-2xl h-[90vh] sm:h-auto sm:max-h-[85vh] flex flex-col"
      ariaLabelledBy="intro-modal-title"
    >
      <div className="space-modal-header">
        <div className="flex items-center gap-3 mb-1">
          <h1
            id="intro-modal-title"
            className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-blue-300"
          >
            {t("resume.name")}
          </h1>
          <a
            href={resumePDF}
            download="Sanjeev CV.pdf"
            className="space-btn text-xs px-3 py-1 no-underline"
            aria-label="Download Resume"
          >
            <svg
              className="w-4 h-4 inline-block mr-1 -mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            {t("resume.download")}
          </a>
        </div>
        <h2 className="text-lg sm:text-xl text-gray-400">
          {t("resume.designation")}
        </h2>
      </div>

      <div className="space-modal-body flex-1 overflow-y-auto">
        <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
          {t("resume.intro_text")}
        </p>

        <div className="space-modal-divider" />

        <div className="mb-5">
          <h3 className="space-section-title">{t("resume.skills_title")}</h3>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {(t("resume.skillSet") as unknown as string[]).map((skill) => (
              <span key={skill} className="space-tag space-tag-alt">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="space-section-title">
            {t("resume.languages_title")}
          </h3>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {(t("resume.languageProficiency") as unknown as string[]).map(
              (language) => (
                <span key={language} className="space-tag">
                  {language}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </SpaceModal>
  );
};
