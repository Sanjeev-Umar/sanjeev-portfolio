import { memo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const moonVertexShader = /* glsl */ `
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vNormal = normal;
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const moonFragmentShader = /* glsl */ `
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  // Light coming from the central orb (origin)
  vec3 lightDir = normalize(-vPosition);
  float diffuse = max(dot(vNormal, lightDir), 0.0);

  // Crater-like surface variation using position
  float pattern = fract(sin(dot(vPosition.xy * 8.0, vec2(12.9898, 78.233))) * 43758.5453);
  float craters = smoothstep(0.3, 0.35, pattern) * 0.15;

  vec3 darkSide = vec3(0.08, 0.06, 0.12);
  vec3 litSide = vec3(0.45, 0.42, 0.55);

  vec3 color = mix(darkSide, litSide, diffuse);
  color -= craters;

  // Subtle rim light
  float rim = 1.0 - max(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)), 0.0);
  rim = pow(rim, 3.0);
  color += vec3(0.15, 0.1, 0.25) * rim;

  gl_FragColor = vec4(color, 1.0);
}
`;

const OrbitingMoon = () => {
  const groupRef = useRef<THREE.Group>(null);
  const moonRef = useRef<THREE.Mesh>(null);

  const ORBIT_RADIUS = 3.5;
  const ORBIT_SPEED = 0.3;
  const MOON_SIZE = 0.35;
  const TILT = 0.3; // Slight orbital tilt

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const angle = time * ORBIT_SPEED;

    if (groupRef.current) {
      groupRef.current.position.set(
        Math.cos(angle) * ORBIT_RADIUS,
        Math.sin(angle * 0.7) * ORBIT_RADIUS * Math.sin(TILT),
        Math.sin(angle) * ORBIT_RADIUS
      );
    }

    if (moonRef.current) {
      moonRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={moonRef} raycast={() => null}>
        <sphereGeometry args={[MOON_SIZE, 16, 16]} />
        <shaderMaterial
          vertexShader={moonVertexShader}
          fragmentShader={moonFragmentShader}
        />
      </mesh>
    </group>
  );
};

export default memo(OrbitingMoon);
