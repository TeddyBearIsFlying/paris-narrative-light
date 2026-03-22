import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { MonumentDef } from '@/lib/constants';
import GalerieInfinie from './GalerieInfinie';

const stagger = (i: number) => 0.6 + i * 0.2;

const SalleOpera = ({ monument }: { monument: MonumentDef }) => {
  const [showGallery, setShowGallery] = useState(false);
  const [curtainPull, setCurtainPull] = useState(false);
  const [connectorHovered, setConnectorHovered] = useState(false);
  const [dotPhases, setDotPhases] = useState([0, 0, 0, 0, 0]);

  // Golden dots pulse
  useEffect(() => {
    let raf: number;
    const animate = () => {
      const t = Date.now() / 1000;
      setDotPhases([0, 1, 2, 3, 4].map(i =>
        0.15 + Math.sin(t * 3 - i * 0.6) * 0.125
      ));
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleOpenGallery = () => {
    setCurtainPull(true);
    setTimeout(() => setShowGallery(true), 1500);
  };

  const handleCloseGallery = () => {
    setShowGallery(false);
    setCurtainPull(false);
  };

  return (
    <div className="fixed inset-0" style={{ zIndex: 1 }}>
      {/* Curtains */}
      <div
        className="fixed top-0 bottom-0 left-0"
        style={{
          width: '15vw',
          zIndex: 3,
          background: 'linear-gradient(to right, rgba(15,12,10,1) 0%, rgba(15,12,10,0.8) 40%, transparent 100%)',
          transform: `translateX(${curtainPull ? '-20vw' : connectorHovered ? '-2vw' : '0'})`,
          transition: 'transform 1.5s cubic-bezier(0.25, 1, 0.5, 1)',
        }}
      >
        <div className="absolute inset-0" style={{
          background: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.003) 2px, rgba(255,255,255,0.003) 3px)',
        }} />
      </div>
      <div
        className="fixed top-0 bottom-0 right-0"
        style={{
          width: '15vw',
          zIndex: 3,
          background: 'linear-gradient(to left, rgba(15,12,10,1) 0%, rgba(15,12,10,0.8) 40%, transparent 100%)',
          transform: `translateX(${curtainPull ? '20vw' : connectorHovered ? '2vw' : '0'})`,
          transition: 'transform 1.5s cubic-bezier(0.25, 1, 0.5, 1)',
        }}
      >
        <div className="absolute inset-0" style={{
          background: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.003) 2px, rgba(255,255,255,0.003) 3px)',
        }} />
      </div>

      {/* Totem: SILLAGE (extends behind curtains) */}
      {!showGallery && (
        <motion.span
          className="absolute font-display italic pointer-events-none select-none"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
            fontSize: '20vw',
            color: 'rgba(255,255,255,0.03)',
            filter: 'blur(4px)',
            zIndex: 0,
            whiteSpace: 'nowrap',
          }}
          initial={{ opacity: 0, filter: 'blur(20px)' }}
          animate={{ opacity: 1, filter: 'blur(4px)' }}
          transition={{ duration: 3 }}
        >
          {monument.spaceTotem}
        </motion.span>
      )}

      {/* Gallery */}
      <AnimatePresence>
        {showGallery && (
          <GalerieInfinie onBack={handleCloseGallery} />
        )}
      </AnimatePresence>

      {/* Content (hidden when gallery active) */}
      {!showGallery && (
        <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 5 }}>
          <div className="flex flex-col items-center" style={{ maxWidth: '480px', padding: '4rem 2rem' }}>
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

            {/* Connector: ARCHIVES VISUELLES - clickable */}
            <motion.div className="flex flex-col items-center mt-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: stagger(5) }}>
              <button
                className="font-display uppercase text-center bg-transparent border-none cursor-pointer"
                style={{
                  fontSize: '9px',
                  letterSpacing: '0.3em',
                  color: connectorHovered ? 'rgba(201,168,76,0.6)' : 'rgba(255,255,255,0.85)',
                  fontWeight: 300,
                  textShadow: connectorHovered ? '0 0 40px rgba(201,168,76,0.12)' : '0 0 40px rgba(201,168,76,0.03)',
                  transition: 'all 0.6s ease',
                }}
                onMouseEnter={() => { setConnectorHovered(true); }}
                onMouseLeave={() => { setConnectorHovered(false); }}
                onClick={handleOpenGallery}
              >
                {monument.spaceConnector}
              </button>

              {/* Connector line */}
              <div style={{
                width: connectorHovered ? '200px' : '60px',
                height: '1px',
                background: 'rgba(201,168,76,0.08)',
                marginTop: '0.8rem',
                transition: 'width 1s ease',
              }} />

              {/* Golden dots */}
              <div className="flex gap-3 mt-3">
                {dotPhases.map((opacity, i) => (
                  <div key={i} style={{
                    width: '3px',
                    height: '3px',
                    borderRadius: '50%',
                    background: '#C9A84C',
                    opacity,
                  }} />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalleOpera;
