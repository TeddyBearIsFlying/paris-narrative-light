import { useMemo } from 'react';
import * as THREE from 'three';
import { MONUMENTS, paintingToWorld, type MonumentDef } from '@/lib/constants';

interface MonumentHitboxesProps {
  phase: number;
  onHover: (id: string | null) => void;
  onClick: (monument: MonumentDef) => void;
  hoveredId: string | null;
  approachProgress: number;
}

const MonumentHitboxes = ({ phase, onHover, onClick, approachProgress }: MonumentHitboxesProps) => {
  const monumentList = useMemo(() => Object.values(MONUMENTS), []);

  if (phase < 8 || approachProgress > 0) return null;

  return (
    <group>
      {monumentList.map((m) => {
        const pos = paintingToWorld(m.pos.x, m.pos.y, 0.5);
        return (
          <mesh
            key={m.id}
            position={pos}
            onPointerEnter={(e) => {
              e.stopPropagation();
              onHover(m.id);
              document.body.style.cursor = 'pointer';
            }}
            onPointerLeave={() => {
              onHover(null);
              document.body.style.cursor = 'crosshair';
            }}
            onClick={(e) => {
              e.stopPropagation();
              onClick(m);
            }}
          >
            <planeGeometry args={m.hitboxSize} />
            <meshBasicMaterial transparent opacity={0} side={THREE.DoubleSide} />
          </mesh>
        );
      })}
    </group>
  );
};

export default MonumentHitboxes;
