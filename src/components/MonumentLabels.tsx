import { motion, AnimatePresence } from 'framer-motion';
import { MONUMENTS, type MonumentDef } from '@/lib/constants';

interface MonumentLabelsProps {
  hoveredId: string | null;
  visible: boolean;
  selectedMonument?: MonumentDef | null;
  approachProgress?: number;
}

// Label positions: next to the beam (1rem right), at 70% beam height
const LABEL_POSITIONS: Record<string, { left: string; top: string }> = {
  louvre: { left: '51%', top: '48%' },
  institut: { left: '31%', top: '26%' },
  opera: { left: '81%', top: '22%' },
  grandPalais: { left: '58%', top: '14%' },
};

const MonumentLabels = ({ hoveredId, visible, selectedMonument, approachProgress = 0 }: MonumentLabelsProps) => {
  if (!visible) return null;

  const monuments = Object.values(MONUMENTS);

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 25 }}>
      <AnimatePresence>
        {monuments.map((m) => {
          const isHovered = hoveredId === m.id;
          const isApproaching = selectedMonument?.id === m.id && approachProgress > 0;
          if (!isHovered && !isApproaching) return null;

          const pos = LABEL_POSITIONS[m.id];
          if (!pos) return null;

          // During approach: migrate label toward upper center
          const style: React.CSSProperties = isApproaching ? {
            left: `${parseFloat(pos.left) + (50 - parseFloat(pos.left)) * approachProgress}%`,
            top: `${parseFloat(pos.top) + (30 - parseFloat(pos.top)) * approachProgress}%`,
            transform: 'translateX(-50%)',
            fontSize: `${0.65 + approachProgress * 0.05}rem`,
            letterSpacing: `${0.15 + approachProgress * 0.2}em`,
            color: approachProgress > 0.5
              ? `rgba(255,255,255,${0.75 * Math.min(1, (approachProgress - 0.5) * 2)})`
              : '#C9A84C',
            fontStyle: approachProgress > 0.7 ? 'normal' : 'italic',
          } : {
            left: pos.left,
            top: pos.top,
            transform: 'translateX(0)',
          };

          return (
            <motion.div
              key={m.id}
              className="absolute"
              style={style}
              initial={{ opacity: 0 }}
              animate={{ opacity: isApproaching ? 1 - (approachProgress > 0.9 ? (approachProgress - 0.9) * 10 : 0) : 1 }}
              exit={{ opacity: 0, transition: { duration: 0.4 } }}
              transition={{ duration: 0.5 }}
            >
              <span
                className="font-display italic uppercase"
                style={{
                  fontSize: isApproaching ? undefined : '0.65rem',
                  letterSpacing: isApproaching ? undefined : '0.15em',
                  color: isApproaching ? undefined : '#C9A84C',
                  opacity: 0.5,
                }}
              >
                {m.label}
              </span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default MonumentLabels;
