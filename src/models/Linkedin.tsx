import { useGLTF, Html } from "@react-three/drei";
import { a } from "@react-spring/three";
import Linkedin from "../assets/3d/linkedin_logo.glb";
import { useRef, useState } from "react";
import { Group, Mesh, MeshStandardMaterial } from "three";
import { useTranslation } from "react-i18next";
import type { GLTF } from "three-stdlib";

type LinkedinGLTF = GLTF & {
  nodes: Record<string, Mesh>;
  materials: Record<string, MeshStandardMaterial>;
};

const LinkedinComponent = (props: JSX.IntrinsicElements["group"]) => {
  const { t } = useTranslation();
  const linkedinRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const { nodes, materials } = useGLTF(Linkedin) as LinkedinGLTF;

  // Clone and modify materials to add emissive properties
  const modifiedMaterials = {
    "Material.007": materials["Material.007"].clone(),
    "Material.006": materials["Material.006"].clone(),
  };

  // Add emissive properties
  modifiedMaterials["Material.007"].emissive.set("#0077B5");
  modifiedMaterials["Material.006"].emissive.set("white");
  modifiedMaterials["Material.007"].emissiveIntensity = hovered ? 1 : 0.7;
  modifiedMaterials["Material.006"].emissiveIntensity = hovered ? 1 : 0.7;
  const handleClick = () => {
    window.open("https://www.linkedin.com/in/sanjeev-umar/", "_blank", "noopener,noreferrer");
  };

  return (
    <a.group
      ref={linkedinRef}
      {...props}
      rotation={[Math.PI / 2, 0, 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={handleClick}
    >
      <group position={[0, -0.016, 0]} scale={0.158}>
        <mesh
          geometry={nodes.Object_4.geometry}
          material={modifiedMaterials["Material.007"]}
        />
        <mesh
          geometry={nodes.Object_5.geometry}
          material={modifiedMaterials["Material.006"]}
        />
      </group>
      {hovered && (
        <Html position={[0, 0, -3]} center>
          <div className="bg-gray-900 bg-opacity-80 text-white px-2 py-1 rounded text-sm">
            {t("social.linkedin")}
          </div>
        </Html>
      )}
    </a.group>
  );
};

export default LinkedinComponent;
