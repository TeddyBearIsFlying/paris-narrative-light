import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { paintingToWorld, createGlowTexture, type MonumentDef } from '@/lib/constants';

interface LightBeamProps {
  monument: MonumentDef;
  phase: number;
  isHovered: boolean;
  isSelected: boolean;
  approachProgress: number;
}

const LightBeam = ({ monument, phase, isHovered, isSelected, approachProgress }: LightBeamProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Sprite>(null);
  const opacityRef = useRef(0);
  const haloOpacityRef = useRef(0.03);
  const scaleRef = useRef(0);
  const glowTexture = useMemo(() => createGlowTexture(), []);

  const beamPos = paintingToWorld(monument.pos.x, monument.pos.y - 0.15, 0.2);
  const haloPos = paintingToWorld(monument.pos.x, monument.pos.y, 0.35);

  useFrame(() => {
    if (!meshRef.current) return;
    let beamTarget = 0;
    let haloTarget = 0.03;
    let scaleTarget = 0;

    if (phase >= 8 && approachProgress === 0) {
      if (isSelected) {
        beamTarget = 0.4;
        haloTarget = 0.15;
        scaleTarget = 1;
      } else if (isHovered) {
        beamTarget = 0.25;
        haloTarget = 0.12;
        scaleTarget = 1;
      } else {
        beamTarget = 0;
        haloTarget = 0.03;
        scaleTarget = 0;
      }
    }

    // Progressive rise: smooth lerp for scaleY
    scaleRef.current += (scaleTarget - scaleRef.current) * (scaleTarget > scaleRef.current ? 0.03 : 0.06);
    opacityRef.current += (beamTarget - opacityRef.current) * 0.06;
    haloOpacityRef.current += (haloTarget - haloOpacityRef.current) * 0.06;

    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = opacityRef.current;
    // Scale from bottom (beam grows upward)
    meshRef.current.scale.y = Math.max(0.001, scaleRef.current);
    meshRef.current.position.y = beamPos[1] + (1 - scaleRef.current) * -4;

    if (haloRef.current) {
      const haloMat = haloRef.current.material as THREE.SpriteMaterial;
      haloMat.opacity = haloOpacityRef.current;
    }
  });

  return (
    <group>
      <mesh ref={meshRef} position={beamPos}>
        <planeGeometry args={[0.04, 8]} />
        <meshBasicMaterial
          color={0xC9A84C}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <sprite ref={haloRef} position={haloPos} scale={[4, 4, 1]}>
        <spriteMaterial
          map={glowTexture}
          color={0xC9A84C}
          transparent
          opacity={0.03}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </sprite>
    </group>
  );
};

export default LightBeam;
