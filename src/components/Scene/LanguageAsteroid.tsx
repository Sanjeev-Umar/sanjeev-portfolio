import { useState, useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, useTexture } from "@react-three/drei";
import { LanguageSelector } from "../LanguageSelector";
import * as THREE from "three";
import asteroidTexture from "./asteroid.jpeg";

// 3D hash-based noise for spatially coherent displacement
function hash3(x: number, y: number, z: number) {
  let h = x * 374761393 + y * 668265263 + z * 1274126177;
  h = ((h ^ (h >> 13)) * 1274126177) | 0;
  return (h & 0x7fffffff) / 0x7fffffff;
}

function smoothNoise3D(px: number, py: number, pz: number) {
  const ix = Math.floor(px), iy = Math.floor(py), iz = Math.floor(pz);
  const fx = px - ix, fy = py - iy, fz = pz - iz;
  // Smoothstep
  const sx = fx * fx * (3 - 2 * fx);
  const sy = fy * fy * (3 - 2 * fy);
  const sz = fz * fz * (3 - 2 * fz);

  const c000 = hash3(ix, iy, iz);
  const c100 = hash3(ix + 1, iy, iz);
  const c010 = hash3(ix, iy + 1, iz);
  const c110 = hash3(ix + 1, iy + 1, iz);
  const c001 = hash3(ix, iy, iz + 1);
  const c101 = hash3(ix + 1, iy, iz + 1);
  const c011 = hash3(ix, iy + 1, iz + 1);
  const c111 = hash3(ix + 1, iy + 1, iz + 1);

  const x0 = c000 + sx * (c100 - c000);
  const x1 = c010 + sx * (c110 - c010);
  const x2 = c001 + sx * (c101 - c001);
  const x3 = c011 + sx * (c111 - c011);
  const y0 = x0 + sy * (x1 - x0);
  const y1 = x2 + sy * (x3 - x2);
  return y0 + sz * (y1 - y0);
}

function createAsteroidGeometry() {
  // Higher subdivision for smoother surface
  const geo = new THREE.DodecahedronGeometry(1, 3);
  const pos = geo.attributes.position;
  const freq = 3.0; // noise frequency
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const len = Math.sqrt(x * x + y * y + z * z);
    const nx = x / len, ny = y / len, nz = z / len;

    // Spatially coherent noise — nearby vertices get similar displacement
    const n1 = smoothNoise3D(nx * freq + 5.3, ny * freq + 1.7, nz * freq + 3.1);
    const n2 = smoothNoise3D(nx * freq * 2 + 10.1, ny * freq * 2 + 7.3, nz * freq * 2 + 2.9) * 0.5;
    const displacement = 0.92 + (n1 + n2) * 0.12; // range ~0.92 to 1.10

    pos.setXYZ(i, nx * displacement, ny * displacement, nz * displacement);
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}

interface LanguageAsteroidProps {
  position: [number, number, number];
  languages: { code: string; name: string }[];
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  isMobile?: boolean;
}

const LanguageAsteroid = ({
  position,
  languages,
  currentLanguage,
  onLanguageChange,
  isMobile = false,
}: LanguageAsteroidProps) => {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  // Use relative path since the image is in the same directory
  const texture = useTexture(asteroidTexture);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = isMobile ? 4 : 16;

  const asteroidGeo = useMemo(() => createAsteroidGeometry(), []);

  // Random rotation speeds (memoized to avoid recalculation on re-render)
  const spin = useMemo(() => ({
    x: Math.random() * Math.PI * 0.001,
    y: Math.random() * Math.PI * 0.001,
    z: Math.random() * Math.PI * 0.001,
  }), []);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += spin.x;
      meshRef.current.rotation.y += spin.y;
      meshRef.current.rotation.z += spin.z;
    }
  });

  return (
    <group position={position}>
      {/* Main asteroid body */}
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => setClicked(!clicked)}
        scale={clicked ? 1.1 : 1}
      >
        <primitive object={asteroidGeo} attach="geometry" />
        <meshStandardMaterial
          map={texture}
          bumpMap={texture}
          bumpScale={0.6}
          color={hovered ? "#999999" : "#777777"}
          roughness={0.9}
          metalness={0.1}
          emissive="#111111"
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Add point light to illuminate the asteroid */}
      <pointLight
        position={[2, 2, 2]}
        intensity={1}
        color="#ffffff"
        distance={10}
      />

      {/* Ambient light for better visibility */}
      <ambientLight intensity={0.3} />

      {/* Language selector UI */}
      <Html position={[0, 1.5, 0]} center distanceFactor={15}>
        <div className="select-none pointer-events-auto">
          <LanguageSelector
            languages={languages}
            currentLanguage={currentLanguage}
            onLanguageChange={(lang) => {
              onLanguageChange(lang);
              setClicked(false);
            }}
            className="bg-gray-900 bg-opacity-80 text-white rounded-md shadow-lg"
          />
        </div>
      </Html>
    </group>
  );
};

export default LanguageAsteroid;
