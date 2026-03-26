import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface CameraRigProps {
  children: React.ReactNode;
  intensity?: number;
}

/**
 * Wraps scene children in a group that subtly sways based on mouse position,
 * creating a parallax depth effect without conflicting with OrbitControls.
 */
const CameraRig = ({ children, intensity = 0.3 }: CameraRigProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const { size } = useThree();
  const mouse = useRef(new THREE.Vector2(0, 0));
  const smoothed = useRef(new THREE.Vector2(0, 0));

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / size.width - 0.5) * 2;
      mouse.current.y = (e.clientY / size.height - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [size]);

  useFrame(() => {
    if (!groupRef.current) return;

    // Smooth interpolation
    smoothed.current.x += (mouse.current.x - smoothed.current.x) * 0.03;
    smoothed.current.y += (mouse.current.y - smoothed.current.y) * 0.03;

    // Apply as subtle rotation to the scene group
    groupRef.current.rotation.y = smoothed.current.x * intensity * 0.05;
    groupRef.current.rotation.x = -smoothed.current.y * intensity * 0.05;
  });

  return <group ref={groupRef}>{children}</group>;
};

export default CameraRig;
