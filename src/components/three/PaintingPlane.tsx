import { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { PAINTING_WIDTH, PAINTING_HEIGHT } from '@/lib/constants';

interface PaintingPlaneProps {
  phase: number;
  phaseElapsed: number;
  approachProgress: number;
  rippleStarted: boolean;
}

function getTargetBrightness(phase: number, elapsed: number, approachProgress: number, rippleStarted: boolean): number {
  if (approachProgress > 0) {
    const baseBrightness = 0.8;
    if (approachProgress < 0.8) return baseBrightness;
    return baseBrightness * (1 - (approachProgress - 0.8) / 0.2);
  }

  if (phase < 7) return 0;
  if (phase >= 8) return 0.8;

  if (!rippleStarted) return 0;

  // Phase 7 timeline (ripple-relative)
  if (elapsed < 0.5) return 0;
  if (elapsed < 1.5) return 0.02;
  if (elapsed < 2.5) return 0.05;
  if (elapsed < 4.0) return 0.05 + (elapsed - 2.5) / 1.5 * 0.15;
  if (elapsed < 6.0) return 0.2 + (elapsed - 4.0) / 2.0 * 0.3;
  if (elapsed < 7.0) return 0.5 + (elapsed - 6.0) / 1.0 * 0.2;
  return 0.7 + Math.min((elapsed - 7.0) / 0.5, 1) * 0.1;
}

const PaintingPlane = ({ phase, phaseElapsed, approachProgress, rippleStarted }: PaintingPlaneProps) => {
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const texture = useLoader(THREE.TextureLoader, '/paris-bw.jpg');
  texture.colorSpace = THREE.SRGBColorSpace;

  useFrame(() => {
    if (!materialRef.current) return;
    const b = getTargetBrightness(phase, phaseElapsed, approachProgress, rippleStarted);
    const target = new THREE.Color(b, b * 0.975, b * 0.925);
    materialRef.current.color.lerp(target, 0.02);
  });

  return (
    <mesh position={[0, 0, 0]}>
      <planeGeometry args={[PAINTING_WIDTH, PAINTING_HEIGHT]} />
      <meshBasicMaterial
        ref={materialRef}
        map={texture}
        color={new THREE.Color(0, 0, 0)}
        toneMapped={false}
      />
    </mesh>
  );
};

export default PaintingPlane;
