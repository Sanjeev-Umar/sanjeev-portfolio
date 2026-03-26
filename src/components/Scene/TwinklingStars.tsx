import { memo, useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const STAR_COUNT = 150;

/**
 * Background star field with subtle twinkling effect.
 * Stars are placed on a large sphere and their opacity
 * oscillates at different rates for a shimmering night sky.
 */
const TwinklingStars = () => {
  const ref = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const { geometry } = useMemo(() => {
    const positions = new Float32Array(STAR_COUNT * 3);
    const sizes = new Float32Array(STAR_COUNT);
    const phasesArr = new Float32Array(STAR_COUNT);

    for (let i = 0; i < STAR_COUNT; i++) {
      // Distribute on a sphere at distance 40-55
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 40 + Math.random() * 15;

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      sizes[i] = 0.3 + Math.random() * 0.7;
      phasesArr[i] = Math.random() * Math.PI * 2;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute("aPhase", new THREE.BufferAttribute(phasesArr, 1));

    return { geometry: geo, phases: phasesArr };
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
    }),
    []
  );

  useFrame(({ clock }) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  });

  return (
    <points ref={ref} geometry={geometry} raycast={() => null}>
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={`
          attribute float aSize;
          attribute float aPhase;
          uniform float uTime;
          varying float vBrightness;

          void main() {
            // Twinkle: each star oscillates at its own rate
            float twinkle = sin(uTime * (1.0 + aPhase * 0.5) + aPhase * 6.28) * 0.5 + 0.5;
            // Add a second frequency for more organic feel
            twinkle *= 0.6 + 0.4 * sin(uTime * 0.7 + aPhase * 3.14);
            vBrightness = 0.3 + twinkle * 0.7;

            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = aSize * (200.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          varying float vBrightness;

          void main() {
            // Soft circular point
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard;

            float alpha = smoothstep(0.5, 0.1, dist) * vBrightness;
            vec3 color = mix(vec3(0.7, 0.8, 1.0), vec3(1.0, 0.95, 0.8), vBrightness);

            gl_FragColor = vec4(color * vBrightness, alpha * 0.8);
          }
        `}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default memo(TwinklingStars);
