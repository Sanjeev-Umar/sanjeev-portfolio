import { Billboard, Text } from "@react-three/drei";
import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useTranslation } from "react-i18next";
import { IntroModal } from "./IntroModal";

import * as THREE from "three";

// Simplex 3D Noise (Ashima Arts)
const simplexNoise = /* glsl */ `
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x,289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}

float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+2.0*C.xxx;
  vec3 x3=x0-1.0+3.0*C.xxx;
  i=mod(i,289.0);
  vec4 p=permute(permute(permute(
    i.z+vec4(0.0,i1.z,i2.z,1.0))
    +i.y+vec4(0.0,i1.y,i2.y,1.0))
    +i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=1.0/7.0;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`;

const planetVertexShader = /* glsl */ `
${simplexNoise}

uniform float uTime;
uniform float uHovered;

varying vec3 vNormal;
varying vec3 vPosition;
varying float vDisplacement;

void main() {
  vNormal = normal;

  float displacement = snoise(normal * 2.0 + uTime * 0.1) * 0.15;
  displacement += snoise(normal * 4.0 + uTime * 0.15) * 0.08;
  displacement += snoise(normal * 8.0 + uTime * 0.2) * 0.04;

  displacement += sin(uTime * 3.0) * 0.02 * uHovered;

  vDisplacement = displacement;

  vec3 newPosition = position + normal * displacement;
  vPosition = newPosition;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
`;

const planetFragmentShader = /* glsl */ `
${simplexNoise}

uniform float uTime;
uniform float uHovered;

varying vec3 vNormal;
varying vec3 vPosition;
varying float vDisplacement;

void main() {
  vec3 deepColor = vec3(0.05, 0.01, 0.12);
  vec3 midColor = vec3(0.14, 0.07, 0.32);
  vec3 brightColor = vec3(0.26, 0.16, 0.55);
  vec3 hotColor = vec3(0.35, 0.22, 0.7);
  vec3 accentColor = vec3(0.2, 0.45, 0.7);

  float n1 = snoise(vNormal * 3.0 + uTime * 0.05) * 0.5 + 0.5;
  float n2 = snoise(vNormal * 6.0 - uTime * 0.08) * 0.5 + 0.5;
  float n3 = snoise(vNormal * 12.0 + uTime * 0.12) * 0.5 + 0.5;

  vec3 color = mix(deepColor, midColor, n1);
  color = mix(color, brightColor, n2 * 0.6);
  color = mix(color, hotColor, pow(n3, 2.0) * 0.4);

  float veins = pow(abs(snoise(vNormal * 8.0 + uTime * 0.1)), 3.0);
  color = mix(color, accentColor, veins * 0.35);

  float highlight = smoothstep(0.1, 0.25, vDisplacement);
  color = mix(color, hotColor, highlight * 0.3);

  float rim = 1.0 - max(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)), 0.0);
  rim = pow(rim, 4.0);
  color += accentColor * rim * 0.25;

  color += vec3(0.08, 0.05, 0.15) * uHovered;

  float emissive = 0.1 + veins * 0.2 + rim * 0.15 + uHovered * 0.1;

  gl_FragColor = vec4(color * (1.0 + emissive), 1.0);
}
`;

const atmosphereVertexShader = /* glsl */ `
varying vec3 vNormal;
varying vec3 vWorldPosition;

void main() {
  vNormal = normalize(normalMatrix * normal);
  vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const atmosphereFragmentShader = /* glsl */ `
uniform float uTime;
uniform float uHovered;
uniform vec3 uCameraPosition;

varying vec3 vNormal;
varying vec3 vWorldPosition;

void main() {
  vec3 viewDir = normalize(uCameraPosition - vWorldPosition);
  float fresnel = 1.0 - dot(viewDir, vNormal);
  fresnel = pow(fresnel, 3.0);

  vec3 innerGlow = vec3(0.25, 0.15, 0.55);
  vec3 outerGlow = vec3(0.2, 0.4, 0.7);

  float pulse = sin(uTime * 1.5) * 0.1 + 0.9;

  vec3 color = mix(innerGlow, outerGlow, fresnel);
  float alpha = fresnel * (0.35 + uHovered * 0.15) * pulse;

  float bloomBoost = 0.8 + uHovered * 0.2;

  gl_FragColor = vec4(color * bloomBoost, alpha);
}
`;

const CentralOrb = ({ isMobile = false }: { isMobile?: boolean }) => {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const planetRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const planetMatRef = useRef<THREE.ShaderMaterial>(null);
  const atmosphereMatRef = useRef<THREE.ShaderMaterial>(null);

  const planetUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uHovered: { value: 0 },
    }),
    []
  );

  const atmosphereUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uHovered: { value: 0 },
      uCameraPosition: { value: new THREE.Vector3() },
    }),
    []
  );

  useFrame(({ clock, camera }) => {
    const time = clock.getElapsedTime();
    const hoverTarget = isHovered ? 1 : 0;

    if (planetMatRef.current) {
      planetMatRef.current.uniforms.uTime.value = time;
      planetMatRef.current.uniforms.uHovered.value +=
        (hoverTarget - planetMatRef.current.uniforms.uHovered.value) * 0.1;
    }

    if (atmosphereMatRef.current) {
      atmosphereMatRef.current.uniforms.uTime.value = time;
      atmosphereMatRef.current.uniforms.uHovered.value +=
        (hoverTarget - atmosphereMatRef.current.uniforms.uHovered.value) * 0.1;
      atmosphereMatRef.current.uniforms.uCameraPosition.value.copy(
        camera.position
      );
    }

    if (planetRef.current) {
      planetRef.current.rotation.y += 0.002;
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group>
      <mesh
        ref={planetRef}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
        onClick={() => setIsOpen(true)}
      >
        <icosahedronGeometry args={[2, isMobile ? 16 : 32]} />
        <shaderMaterial
          ref={planetMatRef}
          vertexShader={planetVertexShader}
          fragmentShader={planetFragmentShader}
          uniforms={planetUniforms}
        />
      </mesh>

      <mesh ref={atmosphereRef}>
        <icosahedronGeometry args={[2.4, isMobile ? 16 : 32]} />
        <shaderMaterial
          ref={atmosphereMatRef}
          vertexShader={atmosphereVertexShader}
          fragmentShader={atmosphereFragmentShader}
          uniforms={atmosphereUniforms}
          transparent
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      <mesh>
        <icosahedronGeometry args={[2.15, 16]} />
        <meshBasicMaterial
          color="#6d28d9"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </mesh>

      {isHovered && (
        <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
          <group position={[0, 3, 0]}>
            <Text
              color="white"
              fontSize={0.8}
              anchorX="center"
              anchorY="middle"
            >
              {t("resume.intro")}
            </Text>
          </group>
        </Billboard>
      )}
      {isOpen && <IntroModal onClose={() => setIsOpen(false)} />}
    </group>
  );
};

export default CentralOrb;
