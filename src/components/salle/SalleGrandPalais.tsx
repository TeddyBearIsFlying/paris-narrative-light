import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { MonumentDef } from '@/lib/constants';

const stagger = (i: number) => 0.6 + i * 0.2;

const SalleGrandPalais = ({ monument }: { monument: MonumentDef }) => {
  const [activeTotem, setActiveTotem] = useState<'MÉMOIRE' | 'RÉSONANCE'>('MÉMOIRE');
  const [totemTransition, setTotemTransition] = useState(false);

  // Alternate totem words every 8s
  useEffect(() => {
    const interval = setInterval(() => {
      setTotemTransition(true);
      setTimeout(() => {
        setActiveTotem(prev => prev === 'MÉMOIRE' ? 'RÉSONANCE' : 'MÉMOIRE');
        setTotemTransition(false);
      }, 1500);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 1 }}>
      {/* Sky gradient hint through glass */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'linear-gradient(to bottom, rgba(30,35,50,0.15) 0%, transparent 8%)',
      }} />

      {/* Glass roof structure */}
      <svg className="absolute pointer-events-none" style={{ top: 0, left: 0, width: '100%', height: '12vh', opacity: 0.6 }}>
        <line x1="10%" y1="2vh" x2="90%" y2="2vh" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />
        <line x1="8%" y1="4vh" x2="92%" y2="4vh" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />
        <line x1="5%" y1="6vh" x2="95%" y2="6vh" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />
        <line x1="3%" y1="8vh" x2="97%" y2="8vh" stroke="rgba(255,255,255,0.015)" strokeWidth="0.5" />
        <line x1="25%" y1="0" x2="25%" y2="10vh" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />
        <line x1="50%" y1="0" x2="50%" y2="10vh" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />
        <line x1="75%" y1="0" x2="75%" y2="10vh" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />
      </svg>

      {/* Alternating totem words */}
      <motion.span
        className="absolute font-display italic pointer-events-none select-none"
        style={{
          top: '60%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          fontSize: '15vw',
          color: 'rgba(255,255,255,0.04)',
          filter: totemTransition ? 'blur(20px)' : 'blur(3px)',
          opacity: totemTransition ? 0 : 0.04,
          transition: 'filter 1.5s ease, opacity 1.5s ease',
          zIndex: 0,
        }}
      >
        {activeTotem}
      </motion.span>

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

        {/* Heritage in motion */}
        <motion.p className="font-display italic text-center mt-6"
          style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.12)' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: stagger(6) }}
        >
          Héritage en mouvement.
        </motion.p>

        {/* Contact section */}
        <motion.div className="mt-8 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: stagger(7) }}
        >
          <p className="font-display" style={{ fontSize: '0.45rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.18)' }}>
            Relations institutionnelles et mécénat
          </p>
          <a
            href={`mailto:${monument.spaceEmail}`}
            className="font-display"
            style={{
              fontSize: '9px',
              color: '#C9A84C',
              opacity: 0.25,
              textDecoration: 'none',
              borderBottom: '1px solid transparent',
              transition: 'all 0.6s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.5';
              e.currentTarget.style.borderBottomColor = 'rgba(201,168,76,0.3)';
              e.currentTarget.style.textShadow = '0 0 15px rgba(201,168,76,0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '0.25';
              e.currentTarget.style.borderBottomColor = 'transparent';
              e.currentTarget.style.textShadow = 'none';
            }}
          >
            {monument.spaceEmail}
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default SalleGrandPalais;
