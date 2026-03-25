import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import IntroSequence from "@/components/IntroSequence";
import MonumentOverlay from "@/components/MonumentOverlay";
import ApproachTransition from "@/components/ApproachTransition";
import MonumentSpace from "@/components/MonumentSpace";
import BottomSignature from "@/components/BottomSignature";
import MobileMessage from "@/components/MobileMessage";
import GrainOverlay from "@/components/GrainOverlay";
import { MONUMENTS, type MonumentDef } from "@/lib/constants";

const LAYERS = [
  { src: "/layer_skyline.webp",        p: 0.02, dx: 0     },
  { src: "/layer_sky.webp",            p: 0.04, dx: 0.008 },
  { src: "/layer_clouds.webp",         p: 0.06, dx: 0.015 },
  { src: "/layer_far_city.webp",       p: 0.08, dx: 0     },
  { src: "/layer_mid_city.webp",       p: 0.12, dx: 0     },
  { src: "/layer_eiffel.webp",         p: 0.10, dx: 0     },
  { src: "/layer_institut.webp",       p: 0.14, dx: 0     },
  { src: "/layer_opera.webp",          p: 0.14, dx: 0     },
  { src: "/layer_bridges.webp",        p: 0.16, dx: 0     },
  { src: "/layer_pyramid_bridge.webp", p: 0.18, dx: 0     },
  { src: "/layer_seine.webp",          p: 0.20, dx: 0     },
  { src: "/layer_water.webp",          p: 0.20, dx: 0     },
  { src: "/layer_boats.webp",          p: 0.22, dx: 0.004 },
  { src: "/layer_pyramide.webp",       p: 0.24, dx: 0     },
  { src: "/layer_foreground.webp",     p: 0.28, dx: 0     },
];

type AppPhase = 'intro' | 'panorama' | 'approaching' | 'salle';

export default function Index() {
  const mouse = useRef({ x: 0, y: 0 });
  const smooth = useRef({ x: 0, y: 0 });
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);

  const [appPhase, setAppPhase] = useState<AppPhase>('intro');
  const [selectedMonument, setSelectedMonument] = useState<MonumentDef | null>(null);
  const [introComplete, setIntroComplete] = useState(false);

  // Portal mount node
  useEffect(() => {
    const el = document.createElement("div");
    el.style.position = "fixed";
    el.style.inset = "0";
    el.style.width = "100vw";
    el.style.height = "100vh";
    el.style.zIndex = "9999";
    el.style.pointerEvents = "none";
    document.body.appendChild(el);
    setMountNode(el);
    return () => {
      document.body.removeChild(el);
      setMountNode(null);
    };
  }, []);

  // Mouse tracking
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Parallax animation loop
  useEffect(() => {
    let raf = 0;
    const PAX = 40;
    const PAY = 14;

    const loop = (ts: number) => {
      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.04;
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.04;

      const sx = smooth.current.x;
      const sy = smooth.current.y;

      for (let i = 0; i < LAYERS.length; i++) {
        const el = layerRefs.current[i];
        if (!el) continue;

        const layer = LAYERS[i];
        let tx = sx * PAX * layer.p * 4 + layer.dx * ts * 0.04;
        let ty = sy * PAY * layer.p * 4;

        if (layer.src === "/layer_clouds.webp") tx += Math.sin(ts * 0.00015) * 8;
        if (layer.src === "/layer_boats.webp") tx += ts * 0.00002 * 60;

        if (layer.src === "/layer_seine.webp" || layer.src === "/layer_water.webp") {
          ty += Math.sin(ts * 0.0012) * 6;
        }

        el.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(1.04)`;
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Intro complete → panorama
  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
    setAppPhase('panorama');
  }, []);

  // Monument click → approach
  const handleMonumentClick = useCallback((monument: MonumentDef) => {
    setSelectedMonument(monument);
    setAppPhase('approaching');
  }, []);

  // Approach complete → salle
  const handleApproachComplete = useCallback(() => {
    setAppPhase('salle');
  }, []);

  // Close salle → panorama
  const handleCloseSalle = useCallback(() => {
    setSelectedMonument(null);
    setAppPhase('panorama');
  }, []);

  // Navigate between salles
  const handleNavigateSalle = useCallback((monumentId: string) => {
    setSelectedMonument(MONUMENTS[monumentId]);
  }, []);

  if (!mountNode) return null;

  const showPanorama = appPhase !== 'intro' || introComplete;
  const showMonuments = appPhase === 'panorama';

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        background: "#060608",
        cursor: showMonuments ? 'crosshair' : 'default',
        pointerEvents: 'auto',
      }}
    >
      {/* Parallax layers — always rendered (visible under intro veil) */}
      {LAYERS.map((layer, i) => (
        <div
          key={layer.src}
          ref={(el) => { layerRefs.current[i] = el; }}
          style={{
            position: "absolute",
            inset: 0,
            willChange: "transform",
            overflow: "hidden",
          }}
        >
          <img
            src={layer.src}
            alt=""
            draggable={false}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              display: "block",
              userSelect: "none",
              pointerEvents: "none",
            }}
          />
        </div>
      ))}

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 80% at 50% 52%, transparent 0%, transparent 30%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0.92) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Monument hitboxes + beams */}
      <MonumentOverlay
        visible={showMonuments}
        onMonumentClick={handleMonumentClick}
      />

      {/* Logo */}
      <BottomSignature
        visible={showPanorama && appPhase !== 'salle'}
        glideTarget={appPhase === 'approaching' ? 'right' : 'center'}
        approachDuration={selectedMonument?.approachDuration}
      />

      {/* Intro sequence (phases 1-3) */}
      {!introComplete && (
        <IntroSequence onComplete={handleIntroComplete} />
      )}

      {/* Approach transition */}
      {appPhase === 'approaching' && selectedMonument && (
        <ApproachTransition
          monument={selectedMonument}
          onComplete={handleApproachComplete}
        />
      )}

      {/* Salle */}
      <MonumentSpace
        monument={selectedMonument}
        visible={appPhase === 'salle'}
        onClose={handleCloseSalle}
        onNavigate={handleNavigateSalle}
      />

      {/* Grain overlay */}
      <GrainOverlay />

      {/* Mobile message */}
      <MobileMessage />
    </div>,
    mountNode,
  );
}
