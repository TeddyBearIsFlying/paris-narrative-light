import { useState, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import CameraRig from './three/CameraRig';
import PaintingPlane from './three/PaintingPlane';
import GoldenLights from './three/GoldenLights';
import MonumentHitboxes from './three/MonumentHitboxes';
import LightBeam from './three/LightBeam';
import { MONUMENTS, paintingToWorld, type MonumentDef } from '@/lib/constants';

const PhaseTimer = ({ phase, onElapsed }: { phase: number; onElapsed: (t: number) => void }) => {
  const startRef = useRef<number | null>(null);

  useFrame(({ clock }) => {
    if (phase === 7) {
      if (startRef.current === null) startRef.current = clock.elapsedTime;
      onElapsed(clock.elapsedTime - startRef.current);
    } else if (phase > 7) {
      onElapsed(99);
    } else {
      startRef.current = null;
      onElapsed(0);
    }
  });

  return null;
};

interface CitySceneProps {
  phase: number;
  onMonumentClick: (monument: MonumentDef) => void;
  selectedMonument: MonumentDef | null;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  approachProgress: number;
  rippleStarted: boolean;
}

const CityScene = ({ phase, onMonumentClick, selectedMonument, hoveredId, onHover, approachProgress, rippleStarted }: CitySceneProps) => {
  const [phaseElapsed, setPhaseElapsed] = useState(0);

  const focusTarget = useMemo(() => {
    if (!selectedMonument) return null;
    return paintingToWorld(selectedMonument.pos.x, selectedMonument.pos.y, 0);
  }, [selectedMonument]);

  const monumentList = useMemo(() => Object.values(MONUMENTS), []);

  if (phase < 1) return null;

  return (
    <div className="fixed inset-0 z-10" style={{ cursor: 'crosshair' }}>
      <Canvas
        camera={{ position: [0, 0, 24], fov: 40, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 1.5]}
      >
        <color attach="background" args={['#0A0A0A']} />
        <PhaseTimer phase={phase} onElapsed={setPhaseElapsed} />
        <CameraRig
          phase={phase}
          focusTarget={focusTarget}
          selectedMonument={selectedMonument}
        />
        <PaintingPlane phase={phase} phaseElapsed={phaseElapsed} approachProgress={approachProgress} rippleStarted={rippleStarted} />
        <GoldenLights
          phase={phase}
          phaseElapsed={phaseElapsed}
          approachProgress={approachProgress}
          selectedMonumentId={selectedMonument?.id ?? null}
          rippleStarted={rippleStarted}
        />
        <MonumentHitboxes
          phase={phase}
          hoveredId={hoveredId}
          onHover={onHover}
          onClick={onMonumentClick}
          approachProgress={approachProgress}
        />
        {monumentList.map((m) => (
          <LightBeam
            key={m.id}
            monument={m}
            phase={phase}
            isHovered={hoveredId === m.id}
            isSelected={selectedMonument?.id === m.id}
            approachProgress={approachProgress}
          />
        ))}
      </Canvas>
    </div>
  );
};

export default CityScene;
