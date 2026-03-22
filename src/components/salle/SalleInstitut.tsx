import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { MonumentDef } from '@/lib/constants';
import GoldDustCanvas from './GoldDustCanvas';

const stagger = (i: number) => 0.6 + i * 0.2;

const SalleInstitut = ({ monument }: { monument: MonumentDef }) => {
  const [rotation, setRotation] = useState(0);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [activePortrait, setActivePortrait] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Rotate AURA text
  useEffect(() => {
    let raf: number;
    const animate = () => {
      setRotation(Date.now() / 120000 * 360 % 360); // 120s per revolution
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Track mouse
  useEffect(() => {
    const handler = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  // Cycle portraits
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePortrait(p => (p + 1) % 3);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 1 }}>
      {/* Dome gradient */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(circle 40vw at 50% -5%, rgba(201,168,76,0.03) 0%, rgba(201,168,76,0.01) 30%, transparent 60%)',
      }} />

      {/* Gold dust (rain from dome) */}
      <GoldDustCanvas />

      {/* Circular AURA text */}
      <svg viewBox="0 0 400 400" className="absolute pointer-events-none select-none" style={{
        left: '50%', top: '50%', transform: `translate(-50%,-50%) rotate(${rotation}deg)`,
        width: '55vw', height: '55vw', opacity: 0.03, filter: 'blur(2px)',
      }}>
        <defs>
          <path id="auraCircle" d="M200,200 m-160,0 a160,160 0 1,1 320,0 a160,160 0 1,1 -320,0" />
        </defs>
        <text fill="rgba(255,255,255,0.8)" fontFamily="Playfair Display, serif" fontSize="18" fontStyle="italic" letterSpacing="8">
          <textPath href="#auraCircle">AURA · AURA · AURA · AURA · AURA · AURA · AURA ·</textPath>
        </text>
      </svg>

      {/* Portrait reveal with cursor mask */}
      <div className="absolute inset-0 pointer-events-none" style={{
        zIndex: 2,
        WebkitMaskImage: `radial-gradient(circle 200px at ${mousePos.x}px ${mousePos.y}px, rgba(0,0,0,0.8) 0%, transparent 100%)`,
        maskImage: `radial-gradient(circle 200px at ${mousePos.x}px ${mousePos.y}px, rgba(0,0,0,0.8) 0%, transparent 100%)`,
      }}>
        {[0, 1, 2].map((i) => (
          <div key={i} className="absolute inset-0" style={{
            background: '#1a1a1a',
            filter: 'grayscale(100%)',
            opacity: activePortrait === i ? 0.3 : 0,
            transition: 'opacity 2.5s ease',
          }} />
        ))}
      </div>

      {/* Content */}
      <div className="flex flex-col items-center relative z-10" style={{ maxWidth: '480px', padding: '4rem 2rem' }}>
        <motion.p className="font-display uppercase text-center"
          style={{ fontSize: '8px', letterSpacing: '0.35em', color: 'rgba(255,255,255,0.15)' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: stagger(0) }}
        >{monument.spaceSurtitle}</motion.p>

        <motion.h1 className="font-display uppercase text-center mt-3"
          style={{ fontSize: '11px', letterSpacing: '0.35em', color: 'rgba(255,255,255,0.75)' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: stagger(1) }}
        >{monument.spaceTitle}</motion.h1>

        <motion.p className="font-display italic text-center mt-2"
          style={{ fontSize: '9px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: stagger(2) }}
        >{monument.spaceSubtitle}</motion.p>

        <motion.div
          style={{ width: '20px', height: '1px', background: 'rgba(255,255,255,0.08)', margin: '2rem auto' }}
          initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ duration: 0.8, delay: stagger(3) }}
        />

        <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: stagger(4) }}>
          {monument.spaceBody.split('\n').map((line, i) => (
            <p key={i} className="font-display" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', lineHeight: 2.4, letterSpacing: '0.02em', fontWeight: 300 }}>
              {line || '\u00A0'}
            </p>
          ))}
        </motion.div>

        <motion.p className="font-display uppercase text-center mt-6"
          style={{ fontSize: '9px', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.85)', fontWeight: 300 }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: stagger(5) }}
        >{monument.spaceConnector}</motion.p>
      </div>
    </div>
  );
};

export default SalleInstitut;
