import { Billboard, Html } from "@react-three/drei";
import { useState } from "react";
import { useTranslation } from "react-i18next";

type InfoIconProps = {
  position: [number, number, number];
  onClick: () => void;
};

const InfoIcon = ({ position, onClick }: InfoIconProps) => {
  const { t } = useTranslation();
  const [hovered, setHovered] = useState(false);

  return (
    <Billboard position={position}>
      <group
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={onClick}
      >
        <mesh>
          <circleGeometry args={[0.5, 32]} />
          <meshStandardMaterial
            color={hovered ? "#60a5fa" : "#3b82f6"}
            emissive={hovered ? "#60a5fa" : "#3b82f6"}
            emissiveIntensity={hovered ? 1 : 0.5}
          />
        </mesh>

        <mesh>
          <circleGeometry args={[1, 32]} />
          <meshStandardMaterial
            transparent
            opacity={0}
            side={2}
            depthWrite={false}
            depthTest={false}
          />
        </mesh>

        <Html
          center
          position={[0, 0, 0.1]}
          style={{
            pointerEvents: "none",
          }}
        >
          <div
            className="text-white text-xl font-bold select-none"
            style={{
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            i
          </div>
        </Html>

        {hovered && (
          <Html
            center
            position={[0, 1, 0]}
            style={{
              pointerEvents: "none",
            }}
          >
            <div className="bg-gray-900 bg-opacity-80 text-white px-2 py-1 rounded text-sm whitespace-nowrap">
              {t("resume.info.click")}
            </div>
          </Html>
        )}
      </group>
    </Billboard>
  );
};

export default InfoIcon;
