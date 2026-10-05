"use client";

import { useEffect, useRef, useState } from "react";

export function DotGridBackground() {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000, active: false });
  const [isDesktop, setIsDesktop] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 768px)");
    setIsDesktop(media.matches);

    const updateMode = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    if (media.addEventListener) {
      media.addEventListener("change", updateMode);
      return () => media.removeEventListener("change", updateMode);
    } else {
      media.addListener(updateMode);
      return () => media.removeListener(updateMode);
    }
  }, []);

  useEffect(() => {
    if (!isDesktop) return;

    let rafId: number;
    let targetX = -1000;
    let targetY = -1000;
    let currentX = -1000;
    let currentY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!mousePos.active) {
        setMousePos((prev) => ({ ...prev, active: true }));
      }
    };

    const handleMouseLeave = () => {
      targetX = -1000;
      targetY = -1000;
      setMousePos((prev) => ({ ...prev, active: false }));
    };

    // Smooth lerp for desktop cursor spotlight
    const tick = () => {
      const dx = targetX - currentX;
      const dy = targetY - currentY;
      if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
        currentX += dx * 0.15;
        currentY += dy * 0.15;
        setMousePos({ x: Math.round(currentX), y: Math.round(currentY), active: true });
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isDesktop]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden select-none"
      style={{ zIndex: 0 }}
    >
      {/* ========================================================
          1. COUCHE LUMIÈRE EN MOUVEMENT (MOBILE & DESKTOP)
          Animations GPU pures (translate3d) sans aucun filtre blur lourd
         ======================================================== */}
      <div className="absolute inset-0">
        {/* Orbe Lumineux 1: Lime Vendix (#c8ff00) - Dérive diagonale */}
        <div
          className="absolute w-[360px] h-[360px] sm:w-[550px] sm:h-[550px] rounded-full opacity-60"
          style={{
            top: "5%",
            left: "15%",
            background: "radial-gradient(circle, rgba(200, 255, 0, 0.22) 0%, rgba(200, 255, 0, 0.08) 45%, transparent 70%)",
            animation: "driftOrb1 18s ease-in-out infinite alternate",
            willChange: "transform",
          }}
        />

        {/* Orbe Lumineux 2: Émeraude (#10b981) - Dérive basse */}
        <div
          className="absolute w-[320px] h-[320px] sm:w-[500px] sm:h-[500px] rounded-full opacity-50"
          style={{
            bottom: "10%",
            right: "10%",
            background: "radial-gradient(circle, rgba(16, 185, 129, 0.20) 0%, rgba(16, 185, 129, 0.06) 50%, transparent 70%)",
            animation: "driftOrb2 24s ease-in-out infinite alternate",
            willChange: "transform",
          }}
        />

        {/* Orbe Lumineux 3: Cyan électrique (#06b6d4) - Mouvement doux central */}
        <div
          className="absolute w-[280px] h-[280px] sm:w-[450px] sm:h-[450px] rounded-full opacity-45"
          style={{
            top: "40%",
            left: "45%",
            background: "radial-gradient(circle, rgba(6, 182, 212, 0.18) 0%, rgba(6, 182, 212, 0.05) 50%, transparent 70%)",
            animation: "driftOrb3 20s ease-in-out infinite alternate",
            willChange: "transform",
          }}
        />

        {/* Vague lumineuse (Light Wave Sweep) - Balayage régulier élégant */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: "linear-gradient(115deg, transparent 20%, rgba(200, 255, 0, 0.08) 45%, rgba(6, 182, 212, 0.06) 55%, transparent 80%)",
            backgroundSize: "200% 200%",
            animation: "lightWaveSweep 12s ease-in-out infinite",
          }}
        />
      </div>

      {/* ========================================================
          2. SPOTLIGHT INTERACTIF DU CURSEUR (DESKTOP SEULEMENT)
         ======================================================== */}
      {isDesktop && mousePos.active && (
        <div
          className="absolute pointer-events-none rounded-full"
          style={{
            width: "380px",
            height: "380px",
            left: mousePos.x - 190,
            top: mousePos.y - 190,
            background: "radial-gradient(circle, rgba(200, 255, 0, 0.28) 0%, rgba(200, 255, 0, 0.10) 40%, transparent 70%)",
            transition: "opacity 0.3s ease",
            willChange: "transform",
          }}
        />
      )}

      {/* ========================================================
          3. GRILLE DE POINTS DE BASE (VISIBLE & NETTE)
          Points blancs/argentés clairs et visibles (30px x 30px)
         ======================================================== */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.16) 1.25px, transparent 1.25px)",
          backgroundSize: "30px 30px",
          backgroundPosition: "center center",
        }}
      />

      {/* ========================================================
          4. GRILLE DE POINTS BRILLANTS (NEON LIME HIGHLIGHTS)
          Révélée par les zones de lumière pour l'effet "Whaou"
         ======================================================== */}
      <div
        className="absolute inset-0 opacity-75"
        style={{
          backgroundImage: "radial-gradient(rgba(200, 255, 0, 0.50) 1.5px, transparent 1.5px)",
          backgroundSize: "30px 30px",
          backgroundPosition: "center center",
          maskImage: "radial-gradient(ellipse at 50% 30%, black 15%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 30%, black 15%, transparent 70%)",
        }}
      />

      {/* Vignette sombre périphérique pour adoucir les bords de l'écran */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 35%, #050505 85%)",
        }}
      />

      {/* ========================================================
          KEYFRAMES CSS HAUTE PERFORMANCE (GPU COMPOSITOR)
         ======================================================== */}
      <style jsx>{`
        @keyframes driftOrb1 {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(80px, 90px, 0) scale(1.15);
          }
          100% {
            transform: translate3d(-60px, 140px, 0) scale(0.92);
          }
        }

        @keyframes driftOrb2 {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(-100px, -70px, 0) scale(1.2);
          }
          100% {
            transform: translate3d(50px, -120px, 0) scale(0.95);
          }
        }

        @keyframes driftOrb3 {
          0% {
            transform: translate3d(0, 0, 0) scale(0.95);
          }
          50% {
            transform: translate3d(-70px, 60px, 0) scale(1.1);
          }
          100% {
            transform: translate3d(80px, -50px, 0) scale(1.05);
          }
        }

        @keyframes lightWaveSweep {
          0% {
            background-position: 0% 0%;
          }
          50% {
            background-position: 100% 100%;
          }
          100% {
            background-position: 0% 0%;
          }
        }
      `}</style>
    </div>
  );
}
