import { memo, useMemo } from "react";
import * as THREE from "three";

// Seed-based pseudo-random for deterministic star placement
function seededRandom(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

interface Constellation {
  stars: THREE.Vector3[];
  edges: [number, number][];
}

/**
 * Background constellation patterns — fixed star formations
 * placed far away on a large sphere, like a real night sky star map.
 */
const ConstellationLines = () => {
  const { lineGeo, dotGeo } = useMemo(() => {
    const constellations: Constellation[] = [];
    const DISTANCE = 50; // far background but within fog range
    const COUNT = 12;

    for (let c = 0; c < COUNT; c++) {
      // Place each constellation in a random direction on the sky sphere
      const theta = seededRandom(c * 3 + 1) * Math.PI * 2;
      const phi = seededRandom(c * 3 + 2) * Math.PI * 0.6 + 0.2; // avoid poles
      const centerDir = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta),
        Math.cos(phi),
        Math.sin(phi) * Math.sin(theta)
      );

      // Generate 4-7 stars clustered around center
      const starCount = 4 + Math.floor(seededRandom(c * 7 + 5) * 4);
      const stars: THREE.Vector3[] = [];

      for (let s = 0; s < starCount; s++) {
        // Small random offset from center direction (angular spread ~8°)
        const offsetTheta = (seededRandom(c * 100 + s * 13 + 1) - 0.5) * 0.14;
        const offsetPhi = (seededRandom(c * 100 + s * 13 + 2) - 0.5) * 0.14;

        const dir = centerDir
          .clone()
          .applyAxisAngle(new THREE.Vector3(0, 1, 0), offsetTheta)
          .applyAxisAngle(new THREE.Vector3(1, 0, 0), offsetPhi);

        stars.push(dir.multiplyScalar(DISTANCE));
      }

      // Connect stars: chain + a few cross-links
      const edges: [number, number][] = [];
      for (let i = 0; i < starCount - 1; i++) {
        edges.push([i, i + 1]);
      }
      // Add 1-2 extra connections for variety
      if (starCount > 4) {
        edges.push([0, Math.floor(starCount / 2)]);
      }
      if (starCount > 5) {
        edges.push([1, starCount - 1]);
      }

      constellations.push({ stars, edges });
    }

    // Build line geometry
    const linePositions: number[] = [];
    for (const c of constellations) {
      for (const [a, b] of c.edges) {
        linePositions.push(c.stars[a].x, c.stars[a].y, c.stars[a].z);
        linePositions.push(c.stars[b].x, c.stars[b].y, c.stars[b].z);
      }
    }
    const lineGeoResult = new THREE.BufferGeometry();
    lineGeoResult.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(linePositions, 3)
    );

    // Build dot geometry (small points at each star)
    const dotPositions: number[] = [];
    for (const c of constellations) {
      for (const star of c.stars) {
        dotPositions.push(star.x, star.y, star.z);
      }
    }
    const dotGeoResult = new THREE.BufferGeometry();
    dotGeoResult.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(dotPositions, 3)
    );

    return { lineGeo: lineGeoResult, dotGeo: dotGeoResult };
  }, []);

  return (
    <group>
      {/* Constellation connection lines */}
      <lineSegments geometry={lineGeo} raycast={() => null}>
        <lineBasicMaterial
          color="#8b7fc7"
          transparent
          opacity={0.25}
          depthWrite={false}
        />
      </lineSegments>

      {/* Star dots at constellation vertices */}
      <points geometry={dotGeo} raycast={() => null}>
        <pointsMaterial
          color="#c4b5fd"
          size={0.6}
          transparent
          opacity={0.7}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
    </group>
  );
};

export default memo(ConstellationLines);
