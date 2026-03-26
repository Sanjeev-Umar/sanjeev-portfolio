import { memo, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const nebulaVertexShader = /* glsl */ `
varying vec3 vWorldPosition;

void main() {
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPos.xyz;
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;

const nebulaFragmentShader = /* glsl */ `
uniform float uTime;
uniform int uOctaves;
varying vec3 vWorldPosition;

// Simplex-style hash noise
vec3 hash33(vec3 p) {
  p = fract(p * vec3(443.8975, 397.2973, 491.1871));
  p += dot(p.zxy, p.yxz + 19.19);
  return fract(vec3(p.x * p.y, p.z * p.x, p.y * p.z));
}

float noise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);

  float a = dot(hash33(i), f - vec3(0.0));
  float b = dot(hash33(i + vec3(1.0, 0.0, 0.0)), f - vec3(1.0, 0.0, 0.0));
  float c = dot(hash33(i + vec3(0.0, 1.0, 0.0)), f - vec3(0.0, 1.0, 0.0));
  float d = dot(hash33(i + vec3(1.0, 1.0, 0.0)), f - vec3(1.0, 1.0, 0.0));
  float e = dot(hash33(i + vec3(0.0, 0.0, 1.0)), f - vec3(0.0, 0.0, 1.0));
  float g = dot(hash33(i + vec3(1.0, 0.0, 1.0)), f - vec3(1.0, 0.0, 1.0));
  float h = dot(hash33(i + vec3(0.0, 1.0, 1.0)), f - vec3(0.0, 1.0, 1.0));
  float j = dot(hash33(i + vec3(1.0, 1.0, 1.0)), f - vec3(1.0, 1.0, 1.0));

  return mix(
    mix(mix(a, b, f.x), mix(c, d, f.x), f.y),
    mix(mix(e, g, f.x), mix(h, j, f.x), f.y),
    f.z
  ) * 0.5 + 0.5;
}

float fbm(vec3 p, int octaves) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 5; i++) {
    if (i >= octaves) break;
    value += amplitude * noise(p);
    p *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec3 dir = normalize(vWorldPosition);
  float time = uTime * 0.01;

  // Layered nebula clouds at different scales
  float n1 = fbm(dir * 2.0 + time * 0.3, uOctaves);
  float n2 = fbm(dir * 4.0 - time * 0.2 + 50.0, uOctaves);
  float n3 = fbm(dir * 1.5 + time * 0.15 + 100.0, uOctaves);

  // Shape the clouds — create regions of density
  float cloud1 = smoothstep(0.35, 0.65, n1);
  float cloud2 = smoothstep(0.4, 0.7, n2);
  float cloud3 = smoothstep(0.3, 0.6, n3);

  // Nebula colors — deep purple, teal, warm pink
  vec3 purple = vec3(0.12, 0.02, 0.18);
  vec3 teal = vec3(0.02, 0.1, 0.14);
  vec3 pink = vec3(0.15, 0.02, 0.08);
  vec3 deep = vec3(0.01, 0.005, 0.02);

  // Mix nebula colors based on cloud layers
  vec3 color = deep;
  color = mix(color, purple, cloud1 * 0.6);
  color = mix(color, teal, cloud2 * 0.4);
  color = mix(color, pink, cloud3 * 0.3);

  // Add subtle bright cores in dense regions
  float core = pow(cloud1 * cloud2, 2.0);
  color += vec3(0.08, 0.04, 0.12) * core;

  // Keep it dark overall — this is a subtle backdrop, not overpowering
  color *= 0.8;

  gl_FragColor = vec4(color, 1.0);
}
`;

const Nebula = ({ isMobile = false }: { isMobile?: boolean }) => {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOctaves: { value: isMobile ? 3 : 5 },
    }),
    [isMobile]
  );

  useFrame(({ clock }) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh>
      <sphereGeometry args={[180, isMobile ? 16 : 32, isMobile ? 16 : 32]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={nebulaVertexShader}
        fragmentShader={nebulaFragmentShader}
        uniforms={uniforms}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  );
};

export default memo(Nebula);
