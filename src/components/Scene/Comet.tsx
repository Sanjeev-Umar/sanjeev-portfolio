import { memo, useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const TRAIL_COUNT = 250;
const PARTICLE_LIFETIME = 4.0; // seconds each particle lives

/**
 * Comet with particles continuously emitted from the head.
 * Each particle has its own position and drifts independently,
 * creating a natural streaming tail.
 */
const Comet = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const nextEmit = useRef(0);

  const ORBIT_RADIUS = 28;
  const SPEED = 0.07;

  // Each particle has its own world position, velocity, age, etc.
  const particles = useMemo(
    () =>
      Array.from({ length: TRAIL_COUNT }, () => ({
        x: 200, y: 200, z: 200, // start offscreen
        vx: 0, vy: 0, vz: 0,   // drift velocity (opposite to comet travel)
        age: PARTICLE_LIFETIME + 1, // start dead
        maxAge: PARTICLE_LIFETIME,
        size: 0.05 + Math.random() * 0.12,
        // Random spread when emitted
        spreadX: (Math.random() - 0.5) * 0.6,
        spreadY: (Math.random() - 0.5) * 0.6,
        spreadZ: (Math.random() - 0.5) * 0.6,
      })),
    []
  );

  // Get comet head position at a given time
  const getHeadPos = (time: number) => {
    const angle = time * SPEED;
    return {
      x: Math.cos(angle) * ORBIT_RADIUS * 1.2,
      y: Math.sin(angle) * ORBIT_RADIUS * 0.35 + Math.sin(angle * 0.3) * 4,
      z: Math.sin(angle) * ORBIT_RADIUS * 0.8,
    };
  };

  useFrame(({ clock }, delta) => {
    if (!meshRef.current) return;
    const time = clock.getElapsedTime();

    const head = getHeadPos(time);
    const headPrev = getHeadPos(time - 0.016);

    // Travel direction (for giving particles backward drift)
    const dirX = head.x - headPrev.x;
    const dirY = head.y - headPrev.y;
    const dirZ = head.z - headPrev.z;
    const dirLen = Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ) || 1;
    const ndx = dirX / dirLen;
    const ndy = dirY / dirLen;
    const ndz = dirZ / dirLen;

    // Emit new particles each frame
    const emitCount = Math.min(4, Math.floor((time - nextEmit.current) / 0.016));
    let emitted = 0;

    for (let i = 0; i < TRAIL_COUNT && emitted < Math.max(emitCount, 2); i++) {
      const p = particles[i];
      if (p.age >= p.maxAge) {
        // Respawn this particle at the head
        p.x = head.x;
        p.y = head.y;
        p.z = head.z;
        p.age = 0;
        p.maxAge = PARTICLE_LIFETIME * (0.5 + Math.random() * 0.5);
        p.size = 0.05 + Math.random() * 0.12;

        // Drift: mostly backward + some random spread
        const driftSpeed = 1.5 + Math.random() * 2.0;
        p.vx = -ndx * driftSpeed + (Math.random() - 0.5) * 0.8;
        p.vy = -ndy * driftSpeed + (Math.random() - 0.5) * 0.8;
        p.vz = -ndz * driftSpeed + (Math.random() - 0.5) * 0.8;

        emitted++;
      }
    }
    nextEmit.current = time;

    // Update all particles
    for (let i = 0; i < TRAIL_COUNT; i++) {
      const p = particles[i];
      p.age += delta;

      if (p.age < p.maxAge) {
        // Move particle
        p.x += p.vx * delta;
        p.y += p.vy * delta;
        p.z += p.vz * delta;

        // Slow down slightly (drag)
        p.vx *= 0.998;
        p.vy *= 0.998;
        p.vz *= 0.998;

        // Size: fade in quickly, then shrink as it ages
        const life = p.age / p.maxAge; // 0→1
        const fadeIn = Math.min(p.age / 0.1, 1.0);
        const fadeOut = 1.0 - life;
        const scale = p.size * fadeIn * fadeOut;

        dummy.position.set(p.x, p.y, p.z);
        dummy.scale.setScalar(Math.max(scale, 0.001));
      } else {
        // Dead particle — hide it
        dummy.position.set(200, 200, 200);
        dummy.scale.setScalar(0.001);
      }

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, TRAIL_COUNT]}
      raycast={() => null}
    >
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial
        color="#90e8d8"
        transparent
        opacity={0.55}
        toneMapped={false}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </instancedMesh>
  );
};

export default memo(Comet);
