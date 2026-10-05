// Simple card component — lightweight, no JS mouse tracking
export function SpotlightCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-[#222222] bg-surface/50 hover:border-accent/20 transition-colors ${className}`}
    >
      {children}
    </div>
  );
}
