import { useGLTF, Html } from "@react-three/drei";
import { a } from "@react-spring/three";
import Github from "../assets/3d/github.glb";
import { useRef, useState } from "react";
import { Group, Mesh, MeshStandardMaterial } from "three";
import { useTranslation } from "react-i18next";
import type { GLTF } from "three-stdlib";

type GithubGLTF = GLTF & {
  nodes: Record<string, Mesh>;
  materials: Record<string, MeshStandardMaterial>;
};

const GithubComponent = (props: JSX.IntrinsicElements["group"]) => {
  const { t } = useTranslation();
  const githubRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const { nodes, materials } = useGLTF(Github) as GithubGLTF;

  const modifiedMaterials = {
    material_0: materials.material_0.clone(),
    material_1: materials.material_1.clone(),
    material_2: materials.material_2.clone(),
    material_3: materials.material_3.clone(),
    material_4: materials.material_4.clone(),
    material_5: materials.material_5.clone(),
    material_6: materials.material_6.clone(),
  };

  modifiedMaterials.material_0.color.set("#2d333b");
  modifiedMaterials.material_0.emissive.set("#444c56");
  modifiedMaterials.material_0.emissiveIntensity = hovered ? 1.5 : 0.8;
  modifiedMaterials.material_0.metalness = 0.7;
  modifiedMaterials.material_0.roughness = 0.3;

  [
    "material_1",
    "material_2",
    "material_3",
    "material_4",
    "material_5",
    "material_6",
  ].forEach((matKey) => {
    const material =
      modifiedMaterials[matKey as keyof typeof modifiedMaterials];
    material.emissive.copy(material.color);
    material.emissiveIntensity = hovered ? 0.4 : 0.2;
    material.metalness = 0.5;
    material.roughness = 0.5;
  });

  const handleClick = () => {
    window.open("https://github.com/sanjeev-umar", "_blank", "noopener,noreferrer");
  };

  return (
    <a.group
      ref={githubRef}
      {...props}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={handleClick}
    >
      <mesh
        geometry={nodes.Object_4.geometry}
        material={modifiedMaterials.material_0}
        position={[0.004, 9.995, 0.636]}
        scale={0.09}
      />
      <mesh
        geometry={nodes.Object_6.geometry}
        material={modifiedMaterials.material_1}
        position={[0.002, 9.997, 1.487]}
        scale={0.09}
      />
      <mesh
        geometry={nodes.Object_8.geometry}
        material={modifiedMaterials.material_2}
        position={[-0.002, 9.994, 1.813]}
        scale={0.09}
      />
      <mesh
        geometry={nodes.Object_10.geometry}
        material={modifiedMaterials.material_3}
        position={[-0.002, 9.988, 1.8]}
        scale={0.09}
      />
      <mesh
        geometry={nodes.Object_12.geometry}
        material={modifiedMaterials.material_4}
        position={[-0.001, 9.996, 1.81]}
        scale={0.09}
      />
      <mesh
        geometry={nodes.Object_14.geometry}
        material={modifiedMaterials.material_5}
        position={[0.012, 10.002, 1.755]}
        scale={0.09}
      />
      <mesh
        geometry={nodes.Object_16.geometry}
        material={modifiedMaterials.material_6}
        position={[0, 9.995, 1.325]}
        scale={0.09}
      />
      {hovered && (
        <Html
          position={[0, 11, 0]}
          center
          style={{
            transform: "translateY(-100%)",
          }}
        >
          <div className="bg-gray-900 bg-opacity-80 text-white px-2 py-1 rounded text-sm">
            {t("social.github")}
          </div>
        </Html>
      )}
    </a.group>
  );
};

export default GithubComponent;
