import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  EffectComposer,
  Bloom,
  Vignette,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Vector2 } from "three";
import { POST_PROCESSING } from "@/constants/scene";

type PostProcessingProps = {
  isMobile: boolean;
};

const PostProcessing = ({ isMobile }: PostProcessingProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bloomRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const vignetteRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chromaticRef = useRef<any>(null);
  const progress = useRef(0);

  useFrame((_, delta) => {
    if (progress.current >= 1) return;

    // Fade in over ~1.5 seconds
    progress.current = Math.min(progress.current + delta * 0.7, 1);
    const t = progress.current;

    if (bloomRef.current) {
      bloomRef.current.intensity = POST_PROCESSING.bloom.intensity * t;
    }
    if (vignetteRef.current) {
      vignetteRef.current.darkness = POST_PROCESSING.vignette.darkness * t;
    }
    if (chromaticRef.current) {
      const offset = POST_PROCESSING.chromaticAberration.offset * t;
      chromaticRef.current.offset.set(offset, offset);
    }
  });

  if (isMobile) {
    return (
      <EffectComposer multisampling={0}>
        <Bloom
          ref={bloomRef}
          intensity={0}
          luminanceThreshold={POST_PROCESSING.bloom.threshold}
          luminanceSmoothing={POST_PROCESSING.bloom.smoothing}
          mipmapBlur
        />
      </EffectComposer>
    );
  }

  return (
    <EffectComposer multisampling={4}>
      <Bloom
        ref={bloomRef}
        intensity={0}
        luminanceThreshold={POST_PROCESSING.bloom.threshold}
        luminanceSmoothing={POST_PROCESSING.bloom.smoothing}
        mipmapBlur
      />
      <Vignette
        ref={vignetteRef}
        offset={POST_PROCESSING.vignette.offset}
        darkness={0}
        blendFunction={BlendFunction.NORMAL}
      />
      <ChromaticAberration
        ref={chromaticRef}
        offset={new Vector2(0, 0)}
        blendFunction={BlendFunction.NORMAL}
        radialModulation
        modulationOffset={
          POST_PROCESSING.chromaticAberration.modulationOffset
        }
      />
    </EffectComposer>
  );
};

export default PostProcessing;
