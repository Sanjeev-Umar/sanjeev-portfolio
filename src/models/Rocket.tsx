import Rocket from "../assets/3d/rocket.glb";
import { useGLTF } from "@react-three/drei";
import { useRef, useState } from "react";
import { Group, Mesh, MeshStandardMaterial, Vector3, Quaternion, Euler } from "three";
import { useFrame } from "@react-three/fiber";
import type { GLTF } from "three-stdlib";

type RocketGLTF = GLTF & {
  nodes: Record<string, Mesh>;
  materials: Record<string, MeshStandardMaterial>;
};

const RocketComponent = (props: JSX.IntrinsicElements["group"]) => {
  const rocketRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const { nodes, materials } = useGLTF(Rocket) as RocketGLTF;

  // Clone and modify materials to add emissive properties
  const modifiedMaterials = {
    Charcoal: materials.Charcoal.clone(),
    Gloss_Red: materials.Gloss_Red.clone(),
    Gloss_White: materials.Gloss_White.clone(),
    "Material.001": materials["Material.001"].clone(),
    White_Glow: materials.White_Glow.clone(),
    material_0: materials.material_0.clone(),
  };

  // Add emissive properties
  modifiedMaterials.Gloss_Red.emissive.set("#ff0000");
  modifiedMaterials.White_Glow.emissive.set("#ffffff");
  modifiedMaterials.material_0.emissive.set("#ff4400");

  // Adjust emissive intensity based on hover state
  Object.values(modifiedMaterials).forEach((material) => {
    material.emissiveIntensity = hovered ? 7 : 3;
  });

  // Reference quaternion for correct orientation
  const baseRotation = new Quaternion().setFromEuler(
    new Euler(Math.PI / 2, 0, 0)
  );

  useFrame(({ clock }) => {
    if (rocketRef.current) {
      const orbitRadius = 10;
      const orbitSpeed = 0.2;
      const time = clock.getElapsedTime();

      // Calculate current position in the orbit
      const angle = time * orbitSpeed;
      const orbitX = Math.cos(angle) * orbitRadius;
      const orbitZ = Math.sin(angle) * orbitRadius;

      // Set position with floating motion
      rocketRef.current.position.x = orbitX;
      rocketRef.current.position.z = orbitZ;
      rocketRef.current.position.y = Math.sin(time * 1.5) * 0.3;

      // Calculate the tangent to the orbit (direction of movement)
      // For a circle, the tangent is perpendicular to the radius
      const tangentX = -Math.sin(angle);
      const tangentZ = Math.cos(angle);

      // Create look direction based on tangent
      const lookDirection = new Vector3(tangentX, 0, tangentZ);

      // Create temporary group to handle the look rotation
      const targetPosition = new Vector3(
        rocketRef.current.position.x + lookDirection.x,
        rocketRef.current.position.y,
        rocketRef.current.position.z + lookDirection.z
      );

      // Make rocket look in direction of travel
      rocketRef.current.lookAt(targetPosition);

      // Now add the base rotation to make the rocket horizontal
      // This combines the directional alignment with the model orientation correction
      rocketRef.current.quaternion.multiply(baseRotation);

      // Add slight tilt for dynamic effect
      const tiltAngle = Math.sin(time * 0.8) * 0.1;
      rocketRef.current.rotateZ(tiltAngle);
    }
  });

  return (
    <group
      ref={rocketRef}
      {...props}
      dispose={null}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <group scale={0.936}>
        <group scale={0.01}>
          <group
            position={[0, 0, 0.865]}
            rotation={[-Math.PI / 2, 0, -2.595]}
            scale={100}
          >
            <mesh
              geometry={nodes.Cylinder_Charcoal_0.geometry}
              material={modifiedMaterials.Charcoal}
            />
            <mesh
              geometry={nodes.Cylinder_Gloss_Red_0.geometry}
              material={modifiedMaterials.Gloss_Red}
            />
            <mesh
              geometry={nodes.Cylinder_Gloss_White_0.geometry}
              material={modifiedMaterials.Gloss_White}
            />
            <mesh
              geometry={nodes.Cylinder_Material001_0.geometry}
              material={modifiedMaterials["Material.001"]}
            />
            <mesh
              geometry={nodes.Cylinder_White_Glow_0.geometry}
              material={modifiedMaterials.White_Glow}
            />
          </group>
          <mesh
            geometry={nodes.Icosphere_Flame_0.geometry}
            material={modifiedMaterials.material_0}
            position={[0, -145.482, 0]}
            rotation={[1.596, -0.006, 0.725]}
            scale={72.665}
          />
        </group>
      </group>
    </group>
  );
};

export default RocketComponent;
