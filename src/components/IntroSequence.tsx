import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface IntroSequenceProps {
  onPhaseChange: (phase: number) => void;
  onDotMigrationComplete: () => void;
}

type MottoState = 'hidden' | 'appearing' | 'holding' | 'fading' | 'solo' | 'heritage-fading' | 'dot-only';

const words = ['Reconnaître', 'ce', 'qui', 'fera', 'héritage'];

const getWordOpacity = (i: number, state: MottoState): number => {
  if (state === 'hidden') return 0;
  if (state === 'appearing' || state === 'holding') return 1;
  if (i < 4) return 0;
  if (state === 'heritage-fading' || state === 'dot-only') return 0;
  return 1;
};

const getWordTransition = (i: number, state: MottoState) => {
  if (state === 'appearing') return { duration: 1.0, delay: i * 0.4, ease: [0.25, 0.05, 0.25, 1] as [number, number, number, number] };
  if (state === 'fading' && i < 4) return { duration: 0.8, delay: i * 0.2 };
  if (state === 'heritage-fading') return { duration: 1.0 };
  return { duration: 0.5 };
};

const IntroSequence = ({ onPhaseChange, onDotMigrationComplete }: IntroSequenceProps) => {
  const [phase, setPhase] = useState(0);
  const [mottoState, setMottoState] = useState<MottoState>('hidden');
  const [darknessProgress, setDarknessProgress] = useState(0);
  const [showPeriod, setShowPeriod] = useState(false);
  const [glowValue, setGlowValue] = useState(0);
  const [dotState, setDotState] = useState<'idle' | 'hold' | 'migrating' | 'handoff' | 'done'>('idle');
  const [dotPos, setDotPos] = useState({ x: 50, y: 50 });
  const [dotScale, setDotScale] = useState(6);
  const [dotColor, setDotColor] = useState('#FFFFFF');
  const [dotGlow, setDotGlow] = useState('none');
  const [dotOpacity, setDotOpacity] = useState(1);
  const [isHoveringEntrer, setIsHoveringEntrer] = useState(false);

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const periodRef = useRef<HTMLSpanElement>(null);

  const addTimer = (ms: number, fn: () => void) => {
    const t = setTimeout(fn, ms);
    timersRef.current.push(t);
    return t;
  };

  const advancePhase = useCallback((p: number) => {
    setPhase(p);
    onPhaseChange(p);
  }, [onPhaseChange]);

  // Phase 0 → 1: click enter
  const handleEnter = useCallback(() => {
    if (phase !== 0) return;
    advancePhase(1);

    // Motto timers (relative to click, T = motto start at 4500ms)
    addTimer(4500, () => { advancePhase(2); setMottoState('appearing'); });
    addTimer(9100, () => setMottoState('fading')); // T+4600
    addTimer(11000, () => { setMottoState('solo'); setShowPeriod(true); }); // T+6500
    addTimer(14500, () => setMottoState('heritage-fading')); // T+10000
    addTimer(15500, () => { setMottoState('dot-only'); advancePhase(6); }); // T+11000
    addTimer(17800, () => advancePhase(7)); // T+13300
  }, [phase, advancePhase]);

  // Cleanup
  useEffect(() => () => timersRef.current.forEach(clearTimeout), []);

  // Phase 1: darkness gradient (3.5s)
  useEffect(() => {
    if (phase !== 1) return;
    const start = Date.now();
    let raf: number;
    const animate = () => {
      const p = Math.min((Date.now() - start) / 3500, 1);
      setDarknessProgress(p);
      if (p < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  // Glow pulse during 'solo'
  useEffect(() => {
    if (mottoState !== 'solo') { setGlowValue(0); return; }
    let raf: number;
    const animate = () => {
      setGlowValue(0.05 + Math.sin(Date.now() * 0.0021) * 0.035);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [mottoState]);

  // Dot migration (phase 6)
  useEffect(() => {
    if (phase !== 6) return;
    // Capture period position
    let startX = 55;
    let startY = 50;
    if (periodRef.current) {
      const rect = periodRef.current.getBoundingClientRect();
      startX = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
      startY = ((rect.top + rect.height / 2) / window.innerHeight) * 100;
    }
    setDotPos({ x: startX, y: startY });
    setDotScale(6);
    setDotColor('#FFFFFF');
    setDotGlow('none');
    setDotOpacity(1);
    setDotState('hold');

    const t1 = setTimeout(() => {
      setDotState('migrating');
      const start = Date.now();
      let _raf: number;
      const animateMigration = () => {
        const elapsed = Date.now() - start;
        const t = Math.min(elapsed / 1500, 1);
        const eased = 1 - Math.pow(1 - t, 3);

        setDotPos({
          x: startX + (55 - startX) * eased,
          y: startY + (60 - startY) * eased,
        });
        setDotScale(6 + 6 * eased);
        const r = Math.round(255 + (201 - 255) * eased);
        const g = Math.round(255 + (168 - 255) * eased);
        const b = Math.round(255 + (76 - 255) * eased);
        setDotColor(`rgb(${r},${g},${b})`);
        setDotGlow(`0 0 ${40 * eased}px ${10 * eased}px rgba(201,168,76,${0.3 * eased})`);

        if (t < 1) {
          _raf = requestAnimationFrame(animateMigration);
        } else {
          setDotState('handoff');
          const fadeStart = Date.now();
          const fadeOut = () => {
            const ft = Math.min((Date.now() - fadeStart) / 300, 1);
            setDotOpacity(1 - ft);
            if (ft < 1) {
              requestAnimationFrame(fadeOut);
            } else {
              setDotState('done');
              onDotMigrationComplete();
            }
          };
          requestAnimationFrame(fadeOut);
        }
      };
      requestAnimationFrame(animateMigration);
    }, 500);

    return () => clearTimeout(t1);
  }, [phase, onDotMigrationComplete]);

  // Skip handler
  const handleSkip = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    advancePhase(7);
    setTimeout(() => onDotMigrationComplete(), 500);
  }, [advancePhase, onDotMigrationComplete]);

  if (phase >= 7) return null;

  // Background computation
  const getBg = () => {
    if (phase === 0) return '#FFFFFF';
    if (phase >= 2) return '#0A0A0A';
    // Phase 1: radial gradient
    const p = darknessProgress;
    const innerAlpha = Math.max(0, 1 - p * 1.8);
    const outerAlpha = Math.min(1, p * 1.3);
    const stopPos = 20 + p * 80;
    return `radial-gradient(ellipse 120% 120% at 50% 50%, rgba(255,255,255,${innerAlpha}) 0%, rgba(10,10,10,${outerAlpha}) ${stopPos}%)`;
  };

  const showMotto = phase >= 2 && phase < 6;
  const showSkip = phase >= 2 && phase < 7;
  const showDot = phase === 6 && dotState !== 'idle' && dotState !== 'done';

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ zIndex: 50, background: getBg() }}
    >
      <AnimatePresence mode="wait">
        {/* Phase 0: Entrer */}
        {phase === 0 && (
          <motion.button
            key="entrer"
            onClick={handleEnter}
            onMouseEnter={() => setIsHoveringEntrer(true)}
            onMouseLeave={() => setIsHoveringEntrer(false)}
            className="font-display uppercase cursor-pointer bg-transparent border-none"
            style={{
              fontSize: '0.9rem',
              letterSpacing: isHoveringEntrer ? '0.35em' : '0.25em',
              color: 'rgba(10, 10, 10, 0.35)',
              transition: 'letter-spacing 0.8s ease, opacity 0.8s ease',
            }}
            initial={{ opacity: 0.3 }}
            animate={{
              opacity: isHoveringEntrer ? 0.7 : [0.30, 0.50, 0.30],
            }}
            transition={isHoveringEntrer
              ? { duration: 0.3 }
              : { opacity: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' } }
            }
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
          >
            Entrer
          </motion.button>
        )}
      </AnimatePresence>

      {/* Motto words — single line, no vertical movement */}
      {showMotto && (
        <div className="flex items-center justify-center gap-x-[0.4em] px-8">
          {words.map((word, i) => (
            <motion.span
              key={i}
              className="font-display italic"
              style={{
                fontSize: '1.4rem',
                letterSpacing: '0.08em',
                color: '#FFFFFF',
                fontWeight: 400,
                textShadow: i === 4 && mottoState === 'solo'
                  ? `0 0 30px rgba(201,168,76,${glowValue})`
                  : 'none',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: getWordOpacity(i, mottoState) }}
              transition={getWordTransition(i, mottoState)}
            >
              {word}
              {/* Period after héritage */}
              {i === 4 && showPeriod && (
                <motion.span
                  ref={periodRef}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: mottoState === 'dot-only' ? 0
                      : mottoState === 'heritage-fading' ? 1
                      : 1,
                  }}
                  transition={{ duration: 0.5 }}
                >
                  .
                </motion.span>
              )}
            </motion.span>
          ))}
        </div>
      )}

      {/* Dot migration */}
      {showDot && (
        <div
          style={{
            position: 'fixed',
            left: `${dotPos.x}%`,
            top: `${dotPos.y}%`,
            transform: 'translate(-50%, -50%)',
            width: `${dotScale}px`,
            height: `${dotScale}px`,
            borderRadius: '50%',
            backgroundColor: dotColor,
            boxShadow: dotGlow,
            opacity: dotOpacity,
            zIndex: 45,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Skip button */}
      {showSkip && (
        <motion.button
          className="fixed font-display uppercase bg-transparent border-none cursor-pointer"
          style={{
            bottom: '2rem',
            right: '2.5rem',
            fontSize: '0.55rem',
            letterSpacing: '0.2em',
            color: 'rgba(255,255,255,0.08)',
            transition: 'all 0.6s ease',
            zIndex: 51,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.06, 0.12, 0.06] }}
          transition={{ opacity: { duration: 4, repeat: Infinity, ease: 'easeInOut' } }}
          onClick={handleSkip}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.35';
            e.currentTarget.style.letterSpacing = '0.25em';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '';
            e.currentTarget.style.letterSpacing = '0.2em';
          }}
        >
          Passer
        </motion.button>
      )}
    </div>
  );
};

export default IntroSequence;
