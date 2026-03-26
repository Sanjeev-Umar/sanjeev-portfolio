import { memo, useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const MAX_STARS = 6;

const ShootingStars = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Each star: startPos, direction, speed, lifetime, age, active
  const stars = useMemo(() => {
    return Array.from({ length: MAX_STARS }, () => ({
      start: new THREE.Vector3(),
      dir: new THREE.Vector3(),
      speed: 0,
      lifetime: 0,
      age: 0,
      active: false,
      nextSpawn: Math.random() * 8 + 2, // stagger initial spawns
      timer: 0,
    }));
  }, []);

  const spawnStar = (star: (typeof stars)[0]) => {
    // Spawn from random edge of visible area
    const side = Math.random();
    const spread = 80;
    if (side < 0.5) {
      // From top-right
      star.start.set(
        30 + Math.random() * spread,
        20 + Math.random() * 30,
        -20 + Math.random() * 10
      );
      star.dir
        .set(-1 - Math.random() * 0.5, -0.5 - Math.random() * 0.5, 0)
        .normalize();
    } else {
      // From top-left
      star.start.set(
        -30 - Math.random() * spread,
        20 + Math.random() * 30,
        -20 + Math.random() * 10
      );
      star.dir
        .set(1 + Math.random() * 0.5, -0.5 - Math.random() * 0.5, 0)
        .normalize();
    }
    star.speed = 40 + Math.random() * 60;
    star.lifetime = 0.8 + Math.random() * 1.2;
    star.age = 0;
    star.active = true;
  };

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    for (let i = 0; i < MAX_STARS; i++) {
      const star = stars[i];

      if (!star.active) {
        star.timer += delta;
        if (star.timer >= star.nextSpawn) {
          spawnStar(star);
          star.timer = 0;
          star.nextSpawn = 3 + Math.random() * 10;
        }
      }

      if (star.active) {
        star.age += delta;
        const t = star.age / star.lifetime;

        if (t >= 1) {
          star.active = false;
          dummy.position.set(0, 0, -9999);
          dummy.scale.setScalar(0);
          dummy.updateMatrix();
          meshRef.current.setMatrixAt(i, dummy.matrix);
          continue;
        }

        // Position along trajectory
        const dist = star.age * star.speed;
        dummy.position.copy(star.start).addScaledVector(star.dir, dist);

        // Streak shape: stretched along direction
        const fadeIn = Math.min(t * 4, 1);
        const fadeOut = 1 - Math.pow(t, 2);
        const brightness = fadeIn * fadeOut;

        // Elongated along direction of travel
        dummy.lookAt(
          dummy.position.x + star.dir.x,
          dummy.position.y + star.dir.y,
          dummy.position.z + star.dir.z
        );
        dummy.scale.set(0.08 * brightness, 0.08 * brightness, 3 + brightness * 4);

        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
      }
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, MAX_STARS]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial
        color="#ffffff"
        transparent
        opacity={0.9}
        toneMapped={false}
      />
    </instancedMesh>
  );
};

export default memo(ShootingStars);
