import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { type MonumentDef } from '@/lib/constants';

interface CameraRigProps {
  phase: number;
  focusTarget: [number, number, number] | null;
  selectedMonument: MonumentDef | null;
}

const CameraRig = ({ phase, focusTarget, selectedMonument }: CameraRigProps) => {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 0, 24));
  const lookTarget = useRef(new THREE.Vector3(0, 0, 0));
  const targetFov = useRef(40);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;

    if (focusTarget && selectedMonument) {
      targetPos.current.set(
        focusTarget[0] * 0.4,
        focusTarget[1] * 0.3,
        18
      );
      lookTarget.current.set(
        focusTarget[0] * 0.5,
        focusTarget[1] * 0.5,
        0
      );
      targetFov.current = selectedMonument.fovTarget;
    } else if (phase >= 8) {
      targetPos.current.set(
        Math.sin(t * 0.015) * 0.8,
        Math.sin(t * 0.01) * 0.25,
        24
      );
      lookTarget.current.set(0, 0, 0);
      targetFov.current = 40;
    } else if (phase === 7) {
      targetPos.current.set(
        Math.sin(t * 0.02) * 0.15,
        Math.sin(t * 0.015) * 0.05,
        24
      );
      lookTarget.current.set(0, 0, 0);
      targetFov.current = 40;
    } else {
      targetPos.current.set(0, 0, 24);
      lookTarget.current.set(0, 0, 0);
      targetFov.current = 40;
    }

    camera.position.lerp(targetPos.current, 0.02);
    camera.lookAt(lookTarget.current);

    const perspCam = camera as THREE.PerspectiveCamera;
    perspCam.fov = THREE.MathUtils.lerp(perspCam.fov, targetFov.current, 0.01);
    perspCam.updateProjectionMatrix();
  });

  return null;
};

export default CameraRig;
