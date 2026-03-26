// ── Camera ──────────────────────────────────────────────────────────
export const CAMERA = {
  mobile: { position: [0, 0, 35] as const, fov: 76 },
  desktop: { position: [0, 0, 26] as const, fov: 60 },
  near: 0.1,
  far: 250,
} as const;

export const DPR = {
  mobile: [1, 1] as [number, number],
  desktop: [1, 1.5] as [number, number],
};

// ── Fog ─────────────────────────────────────────────────────────────
export const FOG = {
  color: "#030014",
  density: { mobile: 0.012, desktop: 0.015 },
  near: { mobile: 15, desktop: 30 },
  far: { mobile: 60, desktop: 80 },
} as const;

// ── Background Stars (drei <Stars />) ───────────────────────────────
export const BACKGROUND_STARS = {
  radius: 100,
  depth: 50,
  count: { mobile: 800, desktop: 5000 },
  factor: 4,
} as const;

// ── Orbit Controls ──────────────────────────────────────────────────
export const ORBIT_CONTROLS = {
  minDistance: { mobile: 15, desktop: 10 },
  maxDistance: { mobile: 40, desktop: 50 },
  rotateSpeed: { mobile: 0.5, desktop: 1 },
  dampingFactor: 0.05,
  zoomSpeed: 0.5,
} as const;

// ── Post-Processing ─────────────────────────────────────────────────
export const POST_PROCESSING = {
  bloom: { intensity: 1.5, threshold: 0.1, smoothing: 0.9 },
  vignette: { offset: 0.3, darkness: 0.7 },
  chromaticAberration: { offset: 0.0006, modulationOffset: 0.2 },
} as const;

// ── Tooltip ─────────────────────────────────────────────────────────
export const TOOLTIP_OFFSET = { mobile: 5, desktop: 15 } as const;

// ── Responsive ──────────────────────────────────────────────────────
export const MOBILE_BREAKPOINT = 768;

// ── Experience Rings ────────────────────────────────────────────────
export const EXPERIENCE_RINGS = [
  { radius: 4, color: "#818cf8", positionKey: "freelancer" },
  { radius: 6, color: "#567DF4", positionKey: "constbase" },
  { radius: 8, color: "#F5831F", positionKey: "moofwd" },
  { radius: 10, color: "#185D82", positionKey: "bysness" },
  { radius: 12, color: "#4B46E0", positionKey: "paktolus" },
  { radius: 14, color: "#17A28B", positionKey: "uvh" },
  { radius: 16, color: "#E8453C", positionKey: "ekishwar" },
] as const;

// ── 3D Object Positions ─────────────────────────────────────────────
export const SCENE_POSITIONS = {
  infoIcon: [-15, 8, 0] as [number, number, number],
  rocket: {
    position: [-8, 4, 0] as [number, number, number],
    scale: [0.4, 0.4, 0.4] as [number, number, number],
  },
  linkedin: {
    position: [12, 6, 2] as [number, number, number],
    scale: [0.5, 0.5, 0.5] as [number, number, number],
  },
  github: {
    position: [10, 8, -2] as [number, number, number],
    scale: [0.1, 0.1, 0.1] as [number, number, number],
  },
  languageAsteroid: [15, 11, -3] as [number, number, number],
} as const;

// ── Supported Languages ─────────────────────────────────────────────
export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English" },
  { code: "ja", name: "日本語" },
  { code: "de", name: "Deutsch" },
  { code: "zh", name: "中文" },
  { code: "ko", name: "한국어" },
  { code: "fr", name: "Français" },
  { code: "es", name: "Español" },
  { code: "pt", name: "Português" },
] as const;
