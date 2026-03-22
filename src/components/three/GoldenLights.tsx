import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SEINE_LIGHTS, MONUMENTS, paintingToWorld, createGlowTexture } from '@/lib/constants';

interface GoldenLightsProps {
  phase: number;
  phaseElapsed: number;
  approachProgress: number;
  selectedMonumentId: string | null;
  rippleStarted: boolean;
}

const ACTIVATION_ORDER = [6, 5, 7, 4, 8, 3, 9, 2, 1, 0];

const GoldenLights = ({ phase, phaseElapsed, approachProgress, selectedMonumentId, rippleStarted }: GoldenLightsProps) => {
  const glowTexture = useMemo(() => createGlowTexture(), []);
  const spriteRefs = useRef<(THREE.Sprite | null)[]>([]);
  const reflectionRefs = useRef<(THREE.Sprite | null)[]>([]);
  const monumentPulseRefs = useRef<(THREE.Sprite | null)[]>([]);

  const monumentList = useMemo(() => Object.values(MONUMENTS), []);

  useFrame(() => {
    if (phase < 7) return;

    // During approach, fade out non-selected lights
    const approachFade = approachProgress > 0 ? Math.max(0, 1 - approachProgress / 0.6) : 1;

    SEINE_LIGHTS.forEach((_, i) => {
      const sprite = spriteRefs.current[i];
      const reflection = reflectionRefs.current[i];
      if (!sprite || !reflection) return;

      let targetOpacity = 0;

      if (phase >= 8) {
        const breath = 0.3 + Math.sin(Date.now() * 0.001 * 0.15 + i * 0.5) * 0.05;
        targetOpacity = breath * approachFade;
      } else if (rippleStarted) {
        // Phase 7 ripple
        const orderIndex = ACTIVATION_ORDER.indexOf(i);
        if (i === 6 && phaseElapsed >= 0) {
          // First spark - starts immediately when ripple begins
          targetOpacity = Math.min(phaseElapsed / 0.8, 1) * 0.5;
        } else if ([2, 3, 4].includes(i) && phaseElapsed >= 1.0 + (i - 2) * 0.3) {
          targetOpacity = Math.min((phaseElapsed - (1.0 + (i - 2) * 0.3)) / 0.5, 1) * 0.4;
        } else if (phaseElapsed >= 2.0 + orderIndex * 0.25) {
          targetOpacity = Math.min((phaseElapsed - (2.0 + orderIndex * 0.25)) / 0.4, 1) * 0.35;
        }
      }

      const mat = sprite.material as THREE.SpriteMaterial;
      mat.opacity += (targetOpacity - mat.opacity) * 0.05;

      const refMat = reflection.material as THREE.SpriteMaterial;
      refMat.opacity += (targetOpacity * 0.4 - refMat.opacity) * 0.03;
    });

    // Monument pulses during phase 7
    if (phase === 7 && rippleStarted) {
      const stagger = [3.5, 3.8, 4.1, 4.4];
      monumentList.forEach((_, i) => {
        const sprite = monumentPulseRefs.current[i];
        if (!sprite) return;
        const mat = sprite.material as THREE.SpriteMaterial;
        const t = phaseElapsed - stagger[i];
        if (t > 0 && t < 1.2) {
          mat.opacity = t < 0.4 ? (t / 0.4) * 0.25 : 0.25 * (1 - (t - 0.4) / 0.8);
        } else {
          mat.opacity = 0;
        }
      });
    }
  });

  if (phase < 7) return null;

  return (
    <group>
      {SEINE_LIGHTS.map((light, i) => {
        const pos = paintingToWorld(light.x, light.y, 0.3);
        const refPos = paintingToWorld(light.x, light.y + 0.03, 0.25);
        return (
          <group key={`seine-${i}`}>
            <sprite
              ref={(el) => { spriteRefs.current[i] = el; }}
              position={pos}
              scale={[2.5, 2.5, 1]}
            >
              <spriteMaterial
                map={glowTexture}
                color={0xC9A84C}
                transparent
                opacity={0}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </sprite>
            <sprite
              ref={(el) => { reflectionRefs.current[i] = el; }}
              position={refPos}
              scale={[2, 1.5, 1]}
            >
              <spriteMaterial
                map={glowTexture}
                color={0xFFD699}
                transparent
                opacity={0}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </sprite>
          </group>
        );
      })}

      {monumentList.map((m, i) => {
        const pos = paintingToWorld(m.pos.x, m.pos.y, 0.35);
        return (
          <sprite
            key={`pulse-${m.id}`}
            ref={(el) => { monumentPulseRefs.current[i] = el; }}
            position={pos}
            scale={[3, 3, 1]}
          >
            <spriteMaterial
              map={glowTexture}
              color={0xC9A84C}
              transparent
              opacity={0}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </sprite>
        );
      })}
    </group>
  );
};

export default GoldenLights;
