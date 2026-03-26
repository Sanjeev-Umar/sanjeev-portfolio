import { useTranslation } from "react-i18next";
import { SpaceModal } from "./SpaceModal";

type SiteInfoModalProps = {
  onClose: () => void;
};

export const SiteInfoModal = ({ onClose }: SiteInfoModalProps) => {
  const { t } = useTranslation();

  const sections = [
    { key: "centralPlanet", icon: "🪐" },
    { key: "experienceRings", icon: "💫" },
    { key: "languageAsteroid", icon: "🌍" },
    { key: "contactRocket", icon: "🚀" },
  ] as const;

  return (
    <SpaceModal
      onClose={onClose}
      className="w-full max-w-2xl"
      ariaLabelledBy="site-info-modal-title"
    >
      <div className="space-modal-header">
        <h2
          id="site-info-modal-title"
          className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-blue-300"
        >
          {t("resume.siteInfo.welcome")}
        </h2>
      </div>

      <div className="space-modal-body">
        <div className="space-y-4">
          {sections.map(({ key, icon }) => (
            <div
              key={key}
              className="flex gap-3 p-3 rounded-lg border border-transparent hover:border-violet-500/20 hover:bg-violet-500/5 transition-colors"
            >
              <span className="text-2xl flex-shrink-0 mt-0.5" role="img" aria-hidden="true">{icon}</span>
              <div>
                <h3 className="text-base font-semibold text-violet-300 mb-1">
                  {t(`resume.siteInfo.${key}.title`)}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {t(`resume.siteInfo.${key}.description`)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-modal-divider" />

        <div className="text-center">
          <button onClick={onClose} className="space-btn">
            {t("resume.siteInfo.exploreButton")}
          </button>
        </div>
      </div>
    </SpaceModal>
  );
};
