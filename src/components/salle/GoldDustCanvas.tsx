import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseOpacity: number;
  opacity: number;
  phase: number;
}

const GoldDustCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Particles spawn in top 20%, rain downward
    particlesRef.current = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * 0.2,
      vx: (Math.random() - 0.5) * 0.16,
      vy: 0.05 + Math.random() * 0.1, // always downward
      size: 0.5 + Math.random() * 1,
      baseOpacity: 0.05 + Math.random() * 0.07,
      opacity: 0.05 + Math.random() * 0.07,
      phase: Math.random() * Math.PI * 2,
    }));

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      particlesRef.current.forEach((p) => {
        // Gentle mouse attraction
        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 300 && dist > 0) {
          p.vx += (dx / dist) * 0.0005;
          p.vy += (dy / dist) * 0.0005;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.phase += 0.02;
        p.opacity = p.baseOpacity + Math.sin(p.phase) * 0.02;

        // Fade out in bottom 20%
        const fadeZone = canvas.height * 0.8;
        if (p.y > fadeZone) {
          p.opacity *= 1 - (p.y - fadeZone) / (canvas.height * 0.2);
        }

        // Reset to top when below screen
        if (p.y > canvas.height) {
          p.y = -5;
          p.x = Math.random() * canvas.width;
          p.vy = 0.05 + Math.random() * 0.1;
          p.vx = (Math.random() - 0.5) * 0.16;
        }

        // Horizontal wrap
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(247, 231, 206, ${Math.max(0, p.opacity)})`;
        ctx.fill();
      });

      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
};

export default GoldDustCanvas;
