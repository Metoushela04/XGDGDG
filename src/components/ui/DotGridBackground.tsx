"use client";

import { useEffect, useRef } from "react";

/**
 * DotGridBackground — Google Stitch Style Haute Visibilité
 * - Grille de points nettement visible, dense et lumineuse.
 * - Onde de luminosité et de mouvement ambiant visible sur mobile et desktop.
 * - Effet magnétique fluide et glow éclatant au passage de la souris / du doigt.
 * - Rendu batch optimisé : 60-120 FPS constants sans surcharge GPU.
 */
export function DotGridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Configuration haute visibilité
    const DOT_SPACING = 28; // Espacement régulier et dense
    const BASE_RADIUS = 1.3; // Points nettement visibles et nets
    const GLOW_RADIUS = 180; // Rayon d'aura généreux
    const MAX_DISPLACEMENT = 7; // Déformation magnétique visible
    const LERP_FACTOR = 0.10; // Réactivité fluide

    let width = 0;
    let height = 0;
    let dpr = 1;
    let animId = 0;
    let isVisible = true;

    // Position souris / tactile
    const target = { x: -2000, y: -2000, active: false };
    const smooth = { x: -2000, y: -2000 };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMouseMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      target.active = true;
    };

    const onMouseLeave = () => {
      target.active = false;
      target.x = -2000;
      target.y = -2000;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        target.x = e.touches[0].clientX;
        target.y = e.touches[0].clientY;
        target.active = true;
      }
    };

    const onTouchEnd = () => {
      target.active = false;
      target.x = -2000;
      target.y = -2000;
    };

    const onVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible) {
        animId = requestAnimationFrame(render);
      } else {
        cancelAnimationFrame(animId);
      }
    };

    const render = (time: number) => {
      if (!isVisible) return;

      // Interpolation fluide
      smooth.x += (target.x - smooth.x) * LERP_FACTOR;
      smooth.y += (target.y - smooth.y) * LERP_FACTOR;

      ctx.clearRect(0, 0, width, height);

      const hasCursor = smooth.x > -500;
      const glowRadiusSq = GLOW_RADIUS * GLOW_RADIUS;

      // Halo lumineux d'ambiance sous le curseur (Aura douce)
      if (hasCursor) {
        const aura = ctx.createRadialGradient(smooth.x, smooth.y, 0, smooth.x, smooth.y, GLOW_RADIUS);
        aura.addColorStop(0, "rgba(200, 255, 0, 0.16)");
        aura.addColorStop(0.45, "rgba(200, 255, 0, 0.05)");
        aura.addColorStop(1, "transparent");
        ctx.fillStyle = aura;
        ctx.beginPath();
        ctx.arc(smooth.x, smooth.y, GLOW_RADIUS, 0, Math.PI * 2);
        ctx.fill();
      }

      const startX = (width % DOT_SPACING) / 2;
      const startY = (height % DOT_SPACING) / 2;

      // 1. Grille de base nettement visible avec onde de mouvement et luminosité vivante
      ctx.fillStyle = "rgba(255, 255, 255, 0.28)";
      ctx.beginPath();

      for (let x = startX; x < width + DOT_SPACING; x += DOT_SPACING) {
        for (let y = startY; y < height + DOT_SPACING; y += DOT_SPACING) {
          // Onde organique continue (visible sur mobile et PC)
          const waveX = Math.sin(x * 0.007 + y * 0.007 + time * 0.0016) * 1.8;
          const waveY = Math.cos(x * 0.005 - y * 0.005 + time * 0.0014) * 1.8;

          const dotX = x + waveX;
          const dotY = y + waveY;

          // Si dans la zone active du curseur, sera dessiné séparément avec son glow
          if (hasCursor) {
            const dx = dotX - smooth.x;
            const dy = dotY - smooth.y;
            if (dx * dx + dy * dy < glowRadiusSq) {
              continue;
            }
          }

          ctx.moveTo(dotX + BASE_RADIUS, dotY);
          ctx.arc(dotX, dotY, BASE_RADIUS, 0, Math.PI * 2);
        }
      }
      ctx.fill();

      // 2. Traitement interactif des points sous le curseur / doigt
      if (hasCursor) {
        const minX = Math.max(0, smooth.x - GLOW_RADIUS);
        const maxX = Math.min(width, smooth.x + GLOW_RADIUS);
        const minY = Math.max(0, smooth.y - GLOW_RADIUS);
        const maxY = Math.min(height, smooth.y + GLOW_RADIUS);

        const startNearbyX = Math.floor(minX / DOT_SPACING) * DOT_SPACING + startX;
        const startNearbyY = Math.floor(minY / DOT_SPACING) * DOT_SPACING + startY;

        for (let x = startNearbyX; x <= maxX + DOT_SPACING; x += DOT_SPACING) {
          for (let y = startNearbyY; y <= maxY + DOT_SPACING; y += DOT_SPACING) {
            const waveX = Math.sin(x * 0.007 + y * 0.007 + time * 0.0016) * 1.8;
            const waveY = Math.cos(x * 0.005 - y * 0.005 + time * 0.0014) * 1.8;

            const dotX = x + waveX;
            const dotY = y + waveY;

            const dx = dotX - smooth.x;
            const dy = dotY - smooth.y;
            const distSq = dx * dx + dy * dy;

            if (distSq < glowRadiusSq) {
              const dist = Math.sqrt(distSq);
              const factor = 1 - dist / GLOW_RADIUS; // 0 à 1

              // Déformation magnétique : répulsion progressive
              const angle = Math.atan2(dy, dx);
              const repel = Math.sin(factor * Math.PI) * MAX_DISPLACEMENT;
              const finalX = dotX + Math.cos(angle) * repel;
              const finalY = dotY + Math.sin(angle) * repel;

              // Grossissement et luminosité puissante
              const radius = BASE_RADIUS + factor * 1.8; // jusqu'à 3.1px
              const alpha = 0.35 + factor * 0.65; // jusqu'à 1.0 (plein éclat)

              // Point lumineux néon
              ctx.fillStyle = `rgba(200, 255, 0, ${alpha})`;
              ctx.beginPath();
              ctx.arc(finalX, finalY, radius, 0, Math.PI * 2);
              ctx.fill();

              // Cœur blanc éclatant au centre immédiat du curseur
              if (factor > 0.45) {
                const coreAlpha = (factor - 0.45) * 1.8;
                ctx.fillStyle = `rgba(255, 255, 255, ${coreAlpha})`;
                ctx.beginPath();
                ctx.arc(finalX, finalY, radius * 0.55, 0, Math.PI * 2);
                ctx.fill();
              }
            }
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    // Écouteurs
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    document.addEventListener("visibilitychange", onVisibilityChange);

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none select-none"
      style={{ zIndex: 0 }}
    />
  );
}
