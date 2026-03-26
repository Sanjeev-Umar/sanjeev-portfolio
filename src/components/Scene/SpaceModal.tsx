import { Html } from "@react-three/drei";
import { useCallback, useEffect, useRef, type ReactNode } from "react";

type SpaceModalProps = {
  onClose: () => void;
  className?: string;
  ariaLabelledBy?: string;
  children: ReactNode;
};

export const SpaceModal = ({
  onClose,
  className = "",
  ariaLabelledBy,
  children,
}: SpaceModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      // Focus trap: cycle Tab within modal
      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first || document.activeElement === modalRef.current) {
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
    <Html fullscreen>
      <div
        className="space-modal-backdrop"
        onClick={onClose}
        role="presentation"
      >
        <div
          ref={modalRef}
          className={`space-modal ${className}`}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby={ariaLabelledBy}
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
            <span aria-hidden="true">✕</span>
          </button>

          {children}
        </div>
      </div>
    </Html>
  );
};
