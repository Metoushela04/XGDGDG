// Lightweight radial glow — pure CSS gradient, 0 blur filter, 0 lag
export function GlowEffect({ className = "" }: { className?: string }) {
  return (
    <div
      className={`absolute pointer-events-none ${className}`}
      style={{
        background: "radial-gradient(circle, rgba(200, 255, 0, 0.06) 0%, transparent 70%)",
      }}
    />
  );
}

export function LightStreak({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute pointer-events-none overflow-hidden ${className}`}>
      <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
    </div>
  );
}
