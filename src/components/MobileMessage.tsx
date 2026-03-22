const MobileMessage = () => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background px-8 md:hidden">
    <p className="font-display text-center text-foreground text-sm tracking-[0.1em] leading-relaxed" style={{ maxWidth: '280px' }}>
      Cette expérience est conçue pour un écran large. Veuillez utiliser un ordinateur.
    </p>
  </div>
);

export default MobileMessage;
