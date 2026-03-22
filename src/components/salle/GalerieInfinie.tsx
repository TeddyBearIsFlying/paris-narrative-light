import { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

interface ArchiveCard {
  year: string;
  label: string;
  img: string;
  video: string;
}

const archives: ArchiveCard[] = [
  { year: '2021', label: 'Palais du Luxembourg', img: '/archives/2021.jpg', video: '/archives/2021.mp4' },
  { year: '2022', label: "Fouquet's", img: '/archives/2022.jpg', video: '/archives/2022.mp4' },
  { year: '2023', label: 'Palais du Luxembourg', img: '/archives/2023.jpg', video: '/archives/2023.mp4' },
  { year: '2024', label: 'Artcurial', img: '/archives/2024.jpg', video: '/archives/2024.mp4' },
  { year: '2025', label: 'Institut de France', img: '/archives/2025.jpg', video: '/archives/2025.mp4' },
];

interface GalerieInfinieProps {
  onBack: () => void;
}

const GalerieInfinie = ({ onBack }: GalerieInfinieProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const cards = [...archives, ...archives, ...archives];

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = window.innerWidth * 0.55 + window.innerWidth * 0.04;
    el.scrollLeft = cardWidth * archives.length;
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      const cardWidth = window.innerWidth * 0.55 + window.innerWidth * 0.04;
      const groupWidth = cardWidth * archives.length;
      if (el.scrollLeft < groupWidth * 0.2) {
        el.scrollLeft += groupWidth;
      } else if (el.scrollLeft > groupWidth * 1.8) {
        el.scrollLeft -= groupWidth;
      }
    };
    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToDirection = useCallback((direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = window.innerWidth * 0.55 + window.innerWidth * 0.04;
    const target = el.scrollLeft + (direction === 'right' ? cardWidth : -cardWidth);
    el.scrollTo({ left: target, behavior: 'smooth' });
  }, []);

  return (
    <motion.div
      className="fixed inset-0 flex flex-col"
      style={{ zIndex: 50, background: '#0A0A0A' }}
      initial={{ opacity: 0, x: '100%', filter: 'blur(20px)' }}
      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, x: '100%', filter: 'blur(20px)' }}
      transition={{ duration: 1.8, ease: [0.25, 1, 0.5, 1] }}
    >
      {/* Stage footlight */}
      <div style={{ width: '100%', height: '1px', background: 'rgba(201,168,76,0.08)' }} />

      {/* Back */}
      <motion.button
        className="fixed top-8 left-8 font-display bg-transparent border-none cursor-pointer z-50"
        style={{
          fontSize: '0.7rem',
          color: 'rgba(201, 168, 76, 0.12)',
          letterSpacing: '0.1em',
          transition: 'all 0.6s ease',
        }}
        onClick={onBack}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = 'rgba(201, 168, 76, 0.4)';
          e.currentTarget.style.textShadow = '0 0 20px rgba(201,168,76,0.08)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'rgba(201, 168, 76, 0.12)';
          e.currentTarget.style.textShadow = 'none';
        }}
      >
        ← La Traversée
      </motion.button>

      {/* Gallery */}
      <div
        ref={scrollRef}
        className="flex-1 flex items-center overflow-x-auto"
        style={{
          scrollSnapType: 'x mandatory',
          paddingLeft: '20vw',
          paddingRight: '20vw',
          gap: '4vw',
          scrollbarWidth: 'none',
        }}
      >
        {cards.map((card, i) => (
          <div
            key={`${card.year}-${i}`}
            className="flex-shrink-0 relative cursor-pointer group"
            style={{
              width: '55vw',
              aspectRatio: '16/9',
              scrollSnapAlign: 'center',
            }}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="absolute inset-0 transition-all duration-[2500ms]" style={{
              background: '#1a1a1a',
              filter: hoveredIndex === i ? 'grayscale(0%)' : 'grayscale(100%)',
            }} />
            <div className="absolute inset-0 transition-all duration-[2500ms]" style={{
              background: hoveredIndex === i ? 'rgba(0,0,0,0.1)' : 'rgba(0,0,0,0.4)',
            }} />
            {/* Play triangle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 40 40" style={{ opacity: 0.3 }}>
                <polygon points="12,8 32,20 12,32" fill="none" stroke="white" strokeWidth="0.5" />
              </svg>
            </div>
            {/* Hover info */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end transition-all duration-[1500ms]" style={{
              opacity: hoveredIndex === i ? 1 : 0,
              transform: hoveredIndex === i ? 'translateY(0)' : 'translateY(8px)',
            }}>
              <div>
                <p className="font-display uppercase" style={{ fontSize: '9px', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.6)' }}>
                  ÉCRIN
                </p>
                <p className="font-display italic mt-1" style={{ fontSize: '1.2rem', color: '#FFFFFF' }}>
                  {card.label}
                </p>
              </div>
              <span className="font-display" style={{
                fontSize: '4rem',
                color: 'transparent',
                WebkitTextStroke: '0.5px white',
                lineHeight: 1,
                transition: 'opacity 1.5s',
              }}>
                {card.year}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <div className="flex justify-center gap-12 pb-4">
        <button
          onClick={() => scrollToDirection('left')}
          className="bg-transparent border-none cursor-pointer transition-opacity duration-300"
          style={{ opacity: 0.3 }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.8'; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.3'; }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24"><path d="M15 4l-8 8 8 8" stroke="white" strokeWidth="0.5" fill="none" /></svg>
        </button>
        <button
          onClick={() => scrollToDirection('right')}
          className="bg-transparent border-none cursor-pointer transition-opacity duration-300"
          style={{ opacity: 0.3 }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.8'; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.3'; }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24"><path d="M9 4l8 8-8 8" stroke="white" strokeWidth="0.5" fill="none" /></svg>
        </button>
      </div>

      {/* Footer */}
      <p className="font-display uppercase text-center pb-4" style={{ fontSize: '9px', letterSpacing: '0.4em', color: 'rgba(255,255,255,0.25)' }}>
        ARCHIVES VISUELLES
      </p>
    </motion.div>
  );
};

export default GalerieInfinie;
