import { useState } from "react";
import { useTranslation } from "react-i18next";
import CentralOrb from "./CentralOrb";
import ExperienceRing from "./ExperienceRing";

import ContactForm from "./ContactForm";
import { Color } from "three";
import LanguageAsteroid from "./LanguageAsteroid";
import { ExperienceModal } from "./ExperienceModal";
import LinkedinComponent from "@/models/Linkedin";
import RocketComponent from "@/models/Rocket";
import InfoIcon from "./InfoIcon";
import GithubComponent from "@/models/Github";
import SpaceDust from "./SpaceDust";
import Nebula from "./Nebula";
import ShootingStars from "./ShootingStars";
import ConstellationLines from "./ConstellationLines";
import CameraRig from "./CameraRig";
import TwinklingStars from "./TwinklingStars";
import OrbitingMoon from "./OrbitingMoon";
import Comet from "./Comet";
import {
  EXPERIENCE_RINGS,
  SCENE_POSITIONS,
  SUPPORTED_LANGUAGES,
} from "@/constants/scene";

export type Experience = {
  isOpen: boolean;
  title: string;
  company: string;
  duration: string;
  location: string;
  responsibilities: string[];
};

export interface Position {
  x: number;
  y: number;
  z: number;
}

export interface ProjectProps {
  position: [number, number, number];
  title: string;
  onSelect: () => void;
  isActive: boolean;
}

export const COLORS = {
  PRIMARY: "#8b5cf6",
  SECONDARY: "#6d28d9",
  HOVER: "#60a5fa",
  INACTIVE: "#3b82f6",
};

interface SceneProps {
  onTooltip: (tooltip: {
    show: boolean;
    x: number;
    y: number;
    titleKey: string;
    periodKey: string;
  }) => void;
  isMobile: boolean;
  onInfoClick: () => void;
}

export const Scene = ({ onTooltip, isMobile, onInfoClick }: SceneProps) => {
  const { t, i18n } = useTranslation();
  const handleRingHover = (
    isHovered: boolean,
    event: React.PointerEvent | undefined,
    titleKey: string,
    periodKey: string
  ) => {
    if (isHovered && event) {
      onTooltip({
        show: true,
        x: event.clientX,
        y: event.clientY,
        titleKey,
        periodKey,
      });
    } else {
      onTooltip({ show: false, x: 0, y: 0, titleKey: "", periodKey: "" });
    }
  };
  const [showContactForm, setShowContactForm] = useState(false);
  const [experience, setExperience] = useState<Experience>({
    isOpen: false,
    title: "",
    company: "",
    duration: "",
    location: "",
    responsibilities: [""],
  });

  const onExperienceClick = (exp: Experience) => {
    setExperience({
      isOpen: exp.isOpen,
      title: exp.title,
      company: exp.company,
      duration: exp.duration,
      location: exp.location,
      responsibilities: exp.responsibilities,
    });
  };
  const onExperienceClose = () => {
    setExperience({
      isOpen: false,
      title: "",
      company: "",
      duration: "",
      location: "",
      responsibilities: [""],
    });
  };
  return (
    <CameraRig>
      <Nebula isMobile={isMobile} />
      <SpaceDust isMobile={isMobile} />
      {!isMobile && <ShootingStars />}
      <ConstellationLines />
      <TwinklingStars />
      <CentralOrb isMobile={isMobile} />
      <OrbitingMoon />
      {!isMobile && <Comet />}

      <InfoIcon
        position={SCENE_POSITIONS.infoIcon}
        onClick={onInfoClick}
      />

      {EXPERIENCE_RINGS.map(({ radius, color, positionKey }) => (
        <ExperienceRing
          key={positionKey}
          radius={radius}
          color={new Color(color)}
          isMobile={isMobile}
          onClick={() => {
            onExperienceClick({
              company: t(`resume.positions.${positionKey}.company`),
              duration: t(`resume.positions.${positionKey}.duration`),
              isOpen: true,
              location: t(`resume.positions.${positionKey}.location`),
              responsibilities: t(
                `resume.positions.${positionKey}.responsibilities`
              ) as unknown as string[],
              title: t(`resume.positions.${positionKey}.title`),
            });
          }}
          onHover={(isHovered, event) =>
            handleRingHover(
              isHovered,
              event,
              `resume.positions.${positionKey}.company`,
              `resume.positions.${positionKey}.duration`
            )
          }
        />
      ))}

      {experience.isOpen && (
        <ExperienceModal
          position={[0, 0, 0]}
          experience={experience}
          onClose={onExperienceClose}
        />
      )}

      <RocketComponent
        position={SCENE_POSITIONS.rocket.position}
        scale={SCENE_POSITIONS.rocket.scale}
        onClick={() => setShowContactForm(!showContactForm)}
      />

      {showContactForm && (
        <ContactForm
          position={[0, 0, 0]}
          onClose={() => setShowContactForm(false)}
          isMobile={isMobile}
        />
      )}
      <LinkedinComponent
        position={SCENE_POSITIONS.linkedin.position}
        scale={SCENE_POSITIONS.linkedin.scale}
      />
      <GithubComponent
        position={SCENE_POSITIONS.github.position}
        scale={SCENE_POSITIONS.github.scale}
      />
      <LanguageAsteroid
        position={SCENE_POSITIONS.languageAsteroid}
        languages={[...SUPPORTED_LANGUAGES]}
        currentLanguage={i18n.language}
        onLanguageChange={(lang) => i18n.changeLanguage(lang)}
        isMobile={isMobile}
      />
    </CameraRig>
  );
};
