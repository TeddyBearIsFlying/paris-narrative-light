import { motion } from 'framer-motion';

interface VignetteOverlayProps {
  visible: boolean;
  centerRadius?: number;
}

const VignetteOverlay = ({ visible, centerRadius = 40 }: VignetteOverlayProps) => {
  if (!visible) return null;

  return (
    <motion.div
      className="fixed inset-0 z-20 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      style={{
        background: `
          radial-gradient(ellipse at 50% 50%, transparent ${centerRadius}%, rgba(10,10,10,0.7) 100%),
          linear-gradient(to top, rgba(10,10,10,0.8) 0%, transparent 25%),
          linear-gradient(to bottom, rgba(10,10,10,0.6) 0%, transparent 20%),
          linear-gradient(to left, rgba(10,10,10,0.5) 0%, transparent 15%),
          linear-gradient(to right, rgba(10,10,10,0.5) 0%, transparent 15%)
        `,
      }}
    />
  );
};

export default VignetteOverlay;
