import { useState } from "react";
import emailjs from "@emailjs/browser";
import { useTranslation } from "react-i18next";
import { SpaceModal } from "./SpaceModal";

type ContactFormArgs = {
  position: [number, number, number];
  onClose: () => void;
  isMobile: boolean;
};

type StatusMessage = {
  type: "success" | "error" | null;
  text: string;
};

const ContactForm = ({ onClose }: ContactFormArgs) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<StatusMessage>({ type: null, text: "" });

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      message: "",
    };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = t("contact.errors.nameRequired");
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = t("contact.errors.emailRequired");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t("contact.errors.emailInvalid");
      isValid = false;
    }

    if (!formData.message.trim()) {
      newErrors.message = t("contact.errors.messageRequired");
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: null, text: "" });

    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const result = await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          {
            from_name: formData.name,
            from_email: formData.email,
            message: formData.message,
          },
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        );

        if (result.text === "OK") {
          setStatus({
            type: "success",
            text: t("contact.success"),
          });
          setFormData({ name: "", email: "", message: "" });
          setTimeout(() => {
            onClose();
          }, 2000);
        }
      } catch (error) {
        setStatus({
          type: "error",
          text: t("contact.error"),
        });
        void error;
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <SpaceModal
      onClose={onClose}
      className="w-full max-w-2xl max-h-[90vh] sm:max-h-[80vh] flex flex-col"
      ariaLabelledBy="contact-form-title"
    >
      <div className="space-modal-header">
        <h2
          id="contact-form-title"
          className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-blue-300"
        >
          {t("contact.title")}
        </h2>
      </div>

      <div className="space-modal-body flex-1 overflow-y-auto">
        <div aria-live="polite" aria-atomic="true" role="status">
          {status.text && (
            <div
              className={`mb-4 p-3 rounded ${
                status.type === "success"
                  ? "bg-green-600/50 text-green-100"
                  : "bg-red-600/50 text-red-100"
              }`}
            >
              {status.text}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4" noValidate>
          <div>
            <label htmlFor="contact-name" className="block text-gray-300 mb-2">
              {t("contact.name")}
            </label>
            <input
              id="contact-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full bg-gray-800/50 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-violet-500 ${
                errors.name
                  ? "border border-red-500"
                  : "border border-gray-700/50"
              }`}
              placeholder={t("contact.namePlaceholder")}
              disabled={isSubmitting}
              required
              aria-required="true"
              aria-invalid={errors.name ? "true" : undefined}
              aria-describedby={errors.name ? "contact-name-error" : undefined}
            />
            {errors.name && (
              <span id="contact-name-error" className="text-red-400 text-sm mt-1" role="alert">{errors.name}</span>
            )}
          </div>

          <div>
            <label htmlFor="contact-email" className="block text-gray-300 mb-2">
              {t("contact.email")}
            </label>
            <input
              id="contact-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full bg-gray-800/50 text-white rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-violet-500 ${
                errors.email
                  ? "border border-red-500"
                  : "border border-gray-700/50"
              }`}
              placeholder={t("contact.emailPlaceholder")}
              disabled={isSubmitting}
              required
              aria-required="true"
              aria-invalid={errors.email ? "true" : undefined}
              aria-describedby={errors.email ? "contact-email-error" : undefined}
            />
            {errors.email && (
              <span id="contact-email-error" className="text-red-400 text-sm mt-1" role="alert">
                {errors.email}
              </span>
            )}
          </div>

          <div>
            <label htmlFor="contact-message" className="block text-gray-300 mb-2">
              {t("contact.message")}
            </label>
            <textarea
              id="contact-message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className={`w-full bg-gray-800/50 text-white rounded-lg px-4 py-2 h-32 resize-none outline-none focus:ring-2 focus:ring-violet-500 ${
                errors.message
                  ? "border border-red-500"
                  : "border border-gray-700/50"
              }`}
              placeholder={t("contact.messagePlaceholder")}
              disabled={isSubmitting}
              required
              aria-required="true"
              aria-invalid={errors.message ? "true" : undefined}
              aria-describedby={errors.message ? "contact-message-error" : undefined}
            />
            {errors.message && (
              <span id="contact-message-error" className="text-red-400 text-sm mt-1" role="alert">
                {errors.message}
              </span>
            )}
          </div>

          <div className="flex justify-end mt-4 sm:mt-6">
            <button
              type="submit"
              className="space-btn disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? t("contact.sending") : t("contact.send")}
            </button>
          </div>
        </form>
      </div>
    </SpaceModal>
  );
};

export default ContactForm;
