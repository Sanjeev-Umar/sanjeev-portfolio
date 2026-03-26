import { memo, useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const SPREAD = 60;

const SpaceDust = ({ isMobile = false }: { isMobile?: boolean }) => {
  const particleCount = isMobile ? 80 : 300;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Generate random positions, speeds, and sizes once
  const particles = useMemo(() => {
    const data = [];
    const MIN_DIST = 8; // Keep dust away from the central orb
    for (let i = 0; i < particleCount; i++) {
      let x, y, z;
      do {
        x = (Math.random() - 0.5) * SPREAD;
        y = (Math.random() - 0.5) * SPREAD;
        z = (Math.random() - 0.5) * SPREAD;
      } while (x * x + y * y + z * z < MIN_DIST * MIN_DIST);
      data.push({
        x,
        y,
        z,
        scale: Math.random() * 0.025 + 0.008,
        // Slow drift direction per particle
        dx: (Math.random() - 0.5) * 0.003,
        dy: (Math.random() - 0.5) * 0.002,
        dz: (Math.random() - 0.5) * 0.003,
        // Phase offset for subtle pulsing
        phase: Math.random() * Math.PI * 2,
      });
    }
    return data;
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const time = clock.getElapsedTime();

    for (let i = 0; i < particleCount; i++) {
      const p = particles[i];

      // Drift and wrap around
      p.x += p.dx;
      p.y += p.dy;
      p.z += p.dz;
      const half = SPREAD / 2;
      if (p.x > half) p.x = -half;
      if (p.x < -half) p.x = half;
      if (p.y > half) p.y = -half;
      if (p.y < -half) p.y = half;
      if (p.z > half) p.z = -half;
      if (p.z < -half) p.z = half;

      // Subtle size pulse
      const s = p.scale * (0.9 + Math.sin(time * 0.8 + p.phase) * 0.1);

      dummy.position.set(p.x, p.y, p.z);
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, particleCount]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial
        color="#8b7fc7"
        transparent
        opacity={0.4}
      />
    </instancedMesh>
  );
};

export default memo(SpaceDust);
