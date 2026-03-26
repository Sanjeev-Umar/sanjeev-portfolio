import { useFrame } from "@react-three/fiber";
import { useRef, useState, useMemo } from "react";
import * as THREE from "three";

type ExperienceRingArgs = {
  radius: number;
  color: THREE.Color;
  onHover: (
    isHovered: boolean,
    event: React.PointerEvent | undefined
  ) => void;
  onClick: () => void;
  isMobile?: boolean;
};

const ExperienceRing = ({
  radius,
  color,
  onHover,
  onClick,
  isMobile = false,
}: ExperienceRingArgs) => {
  const particleCount = isMobile ? 8 : 24;
  const ringSegments = isMobile ? 32 : 64;
  const groupRef = useRef<THREE.Group>(null);
  const nodeRef = useRef<THREE.Mesh>(null);
  const innerMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const outerMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const particlesRef = useRef<THREE.InstancedMesh>(null);

  const saturnTilt = Math.PI * 0.1;
  const [isHovered, setIsHovered] = useState(false);

  // Inner rings spin faster
  const rotationSpeed = useMemo(() => 0.06 / radius, [radius]);
  // Orbiting node — random start, speed inversely proportional to radius
  const nodeOffset = useMemo(() => Math.random() * Math.PI * 2, []);
  const nodeSpeed = useMemo(() => 0.25 / radius, [radius]);

  const emissiveRef = useRef(0.2);
  const ringRotation: [number, number, number] = [
    -Math.PI / 2 + Math.PI / 6,
    0,
    0,
  ];

  // Ring particles: evenly spaced dots orbiting along the ring
  const particleData = useMemo(() => {
    const dummy = new THREE.Object3D();
    return Array.from({ length: particleCount }, (_, i) => ({
      angleOffset: (i / particleCount) * Math.PI * 2,
      radiusOffset: (Math.random() - 0.5) * 0.6, // slight spread
      speed: 0.15 / radius + (Math.random() - 0.5) * 0.02,
      phase: Math.random() * Math.PI * 2,
      size: 0.03 + Math.random() * 0.04,
      dummy,
    }));
  }, [radius]);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    // Keep tilt, accumulate spin
    if (groupRef.current) {
      groupRef.current.rotation.z = saturnTilt;
      groupRef.current.rotation.y += rotationSpeed * 0.01;
    }

    // Smooth emissive lerp
    const target = isHovered ? 0.7 : 0.2;
    emissiveRef.current += (target - emissiveRef.current) * 0.08;

    if (innerMatRef.current) {
      innerMatRef.current.emissiveIntensity = emissiveRef.current;
      innerMatRef.current.opacity =
        0.3 + Math.sin(time * 0.5 + radius) * 0.05;
    }
    if (outerMatRef.current) {
      outerMatRef.current.emissiveIntensity = emissiveRef.current * 0.7;
      outerMatRef.current.opacity =
        0.1 + Math.sin(time * 0.5 + radius) * 0.03;
    }

    // Orbiting node position (XY plane, parent group handles tilt)
    if (nodeRef.current) {
      const angle = time * nodeSpeed + nodeOffset;
      nodeRef.current.position.x = Math.cos(angle) * radius;
      nodeRef.current.position.y = Math.sin(angle) * radius;
      // Gentle pulse
      const scale = 0.12 + Math.sin(time * 2 + radius) * 0.03;
      nodeRef.current.scale.setScalar(scale);
    }

    // Animate ring particles
    if (particlesRef.current) {
      for (let i = 0; i < particleCount; i++) {
        const p = particleData[i];
        const angle = time * p.speed + p.angleOffset;
        const r = radius + p.radiusOffset;
        p.dummy.position.set(Math.cos(angle) * r, Math.sin(angle) * r, 0);
        // Pulse size
        const s = p.size * (0.8 + Math.sin(time * 2 + p.phase) * 0.3);
        p.dummy.scale.setScalar(s);
        p.dummy.updateMatrix();
        particlesRef.current!.setMatrixAt(i, p.dummy.matrix);
      }
      particlesRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  const handlePointerOver = (e: any) => {
    onHover(true, e);
    setIsHovered(true);
  };

  const handlePointerOut = () => {
    onHover(false, undefined);
    setIsHovered(false);
  };

  return (
    <group
      ref={groupRef}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={onClick}
    >
      {/* Inner ring */}
      <mesh rotation={ringRotation}>
        <ringGeometry args={[radius - 0.4, radius + 0.4, ringSegments]} />
        <meshStandardMaterial
          ref={innerMatRef}
          color={color}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Outer ring */}
      <mesh rotation={ringRotation}>
        <ringGeometry args={[radius + 0.5, radius + 0.9, ringSegments]} />
        <meshStandardMaterial
          ref={outerMatRef}
          color={color}
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Orbiting glowing node */}
      <group rotation={ringRotation}>
        <mesh ref={nodeRef}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial color={color} transparent opacity={0.9} />
        </mesh>
      </group>

      {/* Ring particles — tiny glowing dots orbiting along the ring */}
      <group rotation={ringRotation}>
        <instancedMesh
          ref={particlesRef}
          args={[undefined, undefined, particleCount]}
        >
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.7}
            toneMapped={false}
          />
        </instancedMesh>
      </group>
    </group>
  );
};

export default ExperienceRing;
