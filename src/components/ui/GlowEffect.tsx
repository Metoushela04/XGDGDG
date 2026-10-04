// Atmospheric glow effects
export function GlowEffect({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute pointer-events-none ${className}`}>
      <div className="absolute inset-0 bg-accent/5 blur-3xl rounded-full animate-glow-pulse" />
      <div className="absolute inset-0 bg-accent/10 blur-2xl rounded-full" style={{ transform: "scale(0.6)" }} />
    </div>
  );
}

export function LightStreak({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute pointer-events-none overflow-hidden ${className}`}>
      <div
        className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent"
        style={{ animation: "shimmer 3s linear infinite" }}
      />
    </div>
  );
}
