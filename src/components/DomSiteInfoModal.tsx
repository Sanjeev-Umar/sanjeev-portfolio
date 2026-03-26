import { useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

type DomSiteInfoModalProps = {
  onClose: () => void;
};

export const DomSiteInfoModal = ({ onClose }: DomSiteInfoModalProps) => {
  const { t } = useTranslation();
  const modalRef = useRef<HTMLDivElement>(null);

  const sections = [
    { key: "centralPlanet", icon: "\u{1FA90}" },
    { key: "experienceRings", icon: "\u{1F4AB}" },
    { key: "languageAsteroid", icon: "\u{1F30D}" },
    { key: "contactRocket", icon: "\u{1F680}" },
  ] as const;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (
            document.activeElement === first ||
            document.activeElement === modalRef.current
          ) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    },
    [onClose]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    modalRef.current?.focus();
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div
      className="space-modal-backdrop"
      onClick={onClose}
      role="presentation"
      style={{ position: "fixed", inset: 0, zIndex: 50 }}
    >
      <div
        ref={modalRef}
        className="space-modal w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="site-info-modal-title"
        tabIndex={-1}
      >
        <div className="space-modal-scanlines" aria-hidden="true" />
        <div className="space-modal-corners" aria-hidden="true" />
        <div className="space-modal-glow" aria-hidden="true" />

        <button
          onClick={onClose}
          className="space-modal-close"
          aria-label="Close"
        >
          <span aria-hidden="true">{"\u2715"}</span>
        </button>

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
                <span
                  className="text-2xl flex-shrink-0 mt-0.5"
                  role="img"
                  aria-hidden="true"
                >
                  {icon}
                </span>
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
      </div>
    </div>
  );
};
