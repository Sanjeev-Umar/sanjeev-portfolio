import { Experience } from ".";
import { SpaceModal } from "./SpaceModal";

export const ExperienceModal = ({
  experience,
  onClose,
}: {
  experience: Experience;
  position: [number, number, number];
  onClose: () => void;
}) => {
  return (
    <SpaceModal
      onClose={onClose}
      className="w-full max-w-2xl max-h-[80vh] flex flex-col"
      ariaLabelledBy="experience-modal-title"
    >
      <div className="space-modal-header">
        <h2
          id="experience-modal-title"
          className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-blue-300"
        >
          {experience.company}
        </h2>
        <h3 className="text-lg text-gray-300 mt-1">{experience.title}</h3>
        <div className="flex items-center gap-3 mt-2">
          <span className="space-badge">{experience.duration}</span>
          {experience.location && (
            <span className="space-badge">{experience.location}</span>
          )}
        </div>
      </div>

      <div className="space-modal-body flex-1 overflow-y-auto">
        <div className="space-modal-divider" />
        <div className="space-y-3 mt-3">
          {experience.responsibilities.map((res) => (
            <p key={res} className="space-list-item">
              {res}
            </p>
          ))}
        </div>
      </div>
    </SpaceModal>
  );
};
