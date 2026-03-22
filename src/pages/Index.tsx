import { useState, useEffect, useRef } from "react";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PANORAMA CSS — pas de canvas, juste des div superposées
// Parallaxe via transform CSS, animé avec requestAnimationFrame
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

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

export default function Index() {
  const mouse  = useRef({ x: 0, y: 0 });
  const smooth = useRef({ x: 0, y: 0 });
  const refs   = useRef<(HTMLDivElement | null)[]>([]);
  const tsRef  = useRef(0);

  // Suivi souris
  useEffect(() => {
    const h = (e: MouseEvent) => {
      mouse.current = {
        x: (e.clientX / window.innerWidth  - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);

  // Boucle parallaxe
  useEffect(() => {
    let raf: number;
    const PAX = 40, PAY = 14;

    const loop = (ts: number) => {
      tsRef.current = ts;
      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.04;
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.04;
      const sx = smooth.current.x, sy = smooth.current.y;

      refs.current.forEach((el, i) => {
        if (!el) return;
        const layer = LAYERS[i];
        const tx = sx * PAX * layer.p * 4 + (layer.dx * ts * 0.04);
        const ty = sy * PAY * layer.p * 4;
        el.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px))`;
      });

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #root { width: 100%; height: 100%; overflow: hidden; background: #060608; }
      `}</style>

      {/* Conteneur plein écran */}
      <div style={{ position: "fixed", inset: 0, overflow: "hidden", background: "#060608" }}>

        {/* Calques superposés */}
        {LAYERS.map((layer, i) => (
          <div
            key={layer.src}
            ref={(el) => { refs.current[i] = el; }}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "110vw",
              height: "110vh",
              transform: "translate(-50%, -50%)",
              willChange: "transform",
            }}
          >
            <img
              src={layer.src}
              alt=""
              style={{ width: "100%", height: "100%", minHeight: "100vh", objectFit: "cover", display: "block" }}
            />
          </div>
        ))}

        {/* Vignette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: `radial-gradient(ellipse at 50% 52%, transparent 10%, rgba(0,0,0,0.08) 45%, rgba(0,0,0,0.92) 100%)`,
          }}
        />
      </div>
    </>
  );
}
