import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { MonumentDef } from '@/lib/constants';

const stagger = (i: number) => 0.6 + i * 0.2;

const SalleLouvre = ({ monument }: { monument: MonumentDef }) => {
  const [vanishX, setVanishX] = useState(50);

  // Drifting vanishing point
  useEffect(() => {
    let raf: number;
    const start = Date.now();
    const animate = () => {
      const t = (Date.now() - start) / 1000;
      setVanishX(50 + Math.sin(t * 0.314) * 2); // ±2vw over ~20s
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  const lines = [5, 15, 30, 45, 55, 70, 85, 95];

  return (
    <div className="fixed inset-0 flex items-end justify-center" style={{ zIndex: 1 }}>
      {/* Perspective grid lines */}
      <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0, pointerEvents: 'none' }}>
        {lines.map((x, i) => (
          <line
            key={i}
            x1={`${vanishX}%`}
            y1="-10%"
            x2={`${x}%`}
            y2="110%"
            stroke="rgba(255,255,255,0.025)"
            strokeWidth="0.5"
          />
        ))}
        {/* Horizontal glass reflection */}
        <line x1="0" y1="55%" x2="100%" y2="55%" stroke="rgba(201,168,76,0.02)" strokeWidth="1" />
      </svg>

      {/* Totem: TEMPS */}
      <motion.span
        className="absolute font-display italic pointer-events-none select-none"
        style={{
          top: '8%',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '8vw',
          color: 'rgba(255,255,255,0.04)',
          filter: 'blur(5px)',
          zIndex: 0,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.03, 0.06, 0.03] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      >
        {monument.spaceTotem}
      </motion.span>

      {/* Content - lower 60% */}
      <div className="flex flex-col items-center relative z-10 pb-24" style={{ maxWidth: '480px', padding: '0 2rem 6rem' }}>
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

        {monument.spaceFooter && (
          <motion.p className="font-display mt-6 text-center"
            style={{ fontSize: '0.5rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.15)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: stagger(6) }}
          >{monument.spaceFooter[0]}</motion.p>
        )}
      </div>
    </div>
  );
};

export default SalleLouvre;
