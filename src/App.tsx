import "./i18n";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, Preload } from "@react-three/drei";
import { Scene } from "./components/Scene";
import "./App.css";
import { useState, Suspense, useEffect, useCallback, lazy } from "react";

const PostProcessing = lazy(
  () => import("./components/Scene/PostProcessing")
);
import { Loader } from "./components/Loader";
import { DomSiteInfoModal } from "./components/DomSiteInfoModal";
import { FogExp2 } from "three";
import { useTranslation } from "react-i18next";
import {
  CAMERA,
  DPR,
  FOG,
  BACKGROUND_STARS,
  ORBIT_CONTROLS,
  TOOLTIP_OFFSET,
  MOBILE_BREAKPOINT,
} from "./constants/scene";

export default function App() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showSiteInfo, setShowSiteInfo] = useState(true);
  const [showEffects, setShowEffects] = useState(false);
  const [tooltip, setTooltip] = useState<{
    show: boolean;
    x: number;
    y: number;
    titleKey: string;
    periodKey: string;
  }>({
    show: false,
    x: 0,
    y: 0,
    titleKey: "",
    periodKey: "",
  });

  const fogDensity = isMobile ? FOG.density.mobile : FOG.density.desktop;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Defer post-processing effects to reduce initial TBT
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => setShowEffects(true), 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const handleInfoClick = useCallback(() => setShowSiteInfo(true), []);

  return (
    <>
      {isLoading && <Loader />}
      {showSiteInfo && (
        <DomSiteInfoModal onClose={() => setShowSiteInfo(false)} />
      )}
      <a href="#main-content" className="skip-nav">
        Skip to content
      </a>
      <div
        id="main-content"
        role="main"
        aria-label="Interactive 3D portfolio of Sanjeev Umar"
        style={{
          width: "100vw",
          height: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          overflow: "hidden",
          visibility: isLoading ? "hidden" : "visible",
          touchAction: "none",
        }}
      >
        <Canvas
          style={{ width: "100%", height: "100%", display: "block" }}
          aria-hidden="true"
          camera={{
            position: isMobile
              ? [...CAMERA.mobile.position]
              : [...CAMERA.desktop.position],
            fov: isMobile ? CAMERA.mobile.fov : CAMERA.desktop.fov,
            near: CAMERA.near,
            far: CAMERA.far,
          }}
          gl={{
            alpha: false,
            antialias: false,
            powerPreference: isMobile ? "default" : "high-performance",
          }}
          onCreated={({ scene }) => {
            scene.fog = new FogExp2(FOG.color, fogDensity);
            setIsLoading(false);
          }}
          dpr={isMobile ? DPR.mobile : DPR.desktop}
        >
          <color attach="background" args={[FOG.color]} />
          <Suspense fallback={null}>
            <Stars
              radius={BACKGROUND_STARS.radius}
              depth={BACKGROUND_STARS.depth}
              count={
                isMobile
                  ? BACKGROUND_STARS.count.mobile
                  : BACKGROUND_STARS.count.desktop
              }
              factor={BACKGROUND_STARS.factor}
              saturation={0}
              fade
              speed={1}
            />
            <ambientLight intensity={0.6} />
            <pointLight
              position={[10, 10, 10]}
              intensity={1.2}
              distance={50}
              decay={2}
            />
            {/* Nebula fill lights */}
            <pointLight
              position={[-30, 15, -20]}
              color="#6b21a8"
              intensity={0.5}
              distance={80}
              decay={2}
            />
            <pointLight
              position={[25, -10, 30]}
              color="#0d9488"
              intensity={0.4}
              distance={80}
              decay={2}
            />
            <Scene
              onTooltip={setTooltip}
              isMobile={isMobile}
              onInfoClick={handleInfoClick}
            />
            <OrbitControls
              enableZoom={true}
              enablePan={true}
              enableRotate={true}
              minDistance={
                isMobile
                  ? ORBIT_CONTROLS.minDistance.mobile
                  : ORBIT_CONTROLS.minDistance.desktop
              }
              maxDistance={
                isMobile
                  ? ORBIT_CONTROLS.maxDistance.mobile
                  : ORBIT_CONTROLS.maxDistance.desktop
              }
              enableDamping={true}
              dampingFactor={ORBIT_CONTROLS.dampingFactor}
              rotateSpeed={
                isMobile
                  ? ORBIT_CONTROLS.rotateSpeed.mobile
                  : ORBIT_CONTROLS.rotateSpeed.desktop
              }
              zoomSpeed={ORBIT_CONTROLS.zoomSpeed}
              makeDefault
            />
            {showEffects && (
              <Suspense fallback={null}>
                <PostProcessing isMobile={isMobile} />
              </Suspense>
            )}
            {!isMobile && <Preload all />}
          </Suspense>
        </Canvas>

        <div aria-live="polite" aria-atomic="true">
          {tooltip.show && (
            <div
              className="game-tooltip"
              role="tooltip"
              style={{
                left:
                  tooltip.x +
                  (isMobile ? TOOLTIP_OFFSET.mobile : TOOLTIP_OFFSET.desktop),
                top:
                  tooltip.y +
                  (isMobile ? TOOLTIP_OFFSET.mobile : TOOLTIP_OFFSET.desktop),
                maxWidth: isMobile ? "80vw" : "auto",
              }}
            >
              <div className="game-tooltip-inner">
                <div className="game-tooltip-corners" aria-hidden="true" />
                <div className="game-tooltip-scanlines" aria-hidden="true" />
                <div className="game-tooltip-title">{t(tooltip.titleKey)}</div>
                <div className="game-tooltip-divider" aria-hidden="true" />
                <div className="game-tooltip-subtitle">
                  {t(tooltip.periodKey)}
                </div>
                <div className="game-tooltip-arrow" aria-hidden="true" />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
