"use client";

import { useEffect, useRef, useState } from "react";

export function DotGridBackground() {
  const [isDesktop, setIsDesktop] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Detect desktop pointer capability (mouse) and minimum viewport width
    const media = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 768px)");
    
    const updateMode = () => {
      setIsDesktop(media.matches);
    };

    updateMode();
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

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Grid configuration
    const DOT_SPACING = 32;
    const BASE_RADIUS = 0.85;
    const GLOW_RADIUS = 160;
    const PARALLAX = 6;
    const LERP_SPEED = 0.08;

    let width = window.innerWidth;
    let height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const mouse = { x: -1000, y: -1000, active: false };
    const smooth = { x: -1000, y: -1000 };
    let isRunning = false;
    let animId = 0;
    let idleFrames = 0;

    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
      ctx.beginPath();
      for (let x = DOT_SPACING / 2; x < width; x += DOT_SPACING) {
        for (let y = DOT_SPACING / 2; y < height; y += DOT_SPACING) {
          ctx.rect(x - BASE_RADIUS, y - BASE_RADIUS, BASE_RADIUS * 2, BASE_RADIUS * 2);
        }
      }
      ctx.fill();
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawStatic();
    };

    const loop = () => {
      if (!ctx) return;

      const targetX = mouse.active ? mouse.x : -1000;
      const targetY = mouse.active ? mouse.y : -1000;
      const dx = targetX - smooth.x;
      const dy = targetY - smooth.y;

      smooth.x += dx * LERP_SPEED;
      smooth.y += dy * LERP_SPEED;

      // Stop loop when mouse settles to save 100% CPU/GPU when idle
      if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
        idleFrames++;
      } else {
        idleFrames = 0;
      }

      if (idleFrames > 15) {
        isRunning = false;
        return;
      }

      ctx.clearRect(0, 0, width, height);

      const offsetX = ((smooth.x - width / 2) / width) * PARALLAX;
      const offsetY = ((smooth.y - height / 2) / height) * PARALLAX;

      const startX = Math.floor((-offsetX) / DOT_SPACING) * DOT_SPACING;
      const startY = Math.floor((-offsetY) / DOT_SPACING) * DOT_SPACING;

      // 1. Fast batch draw of base dots
      ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
      ctx.beginPath();
      for (let x = startX; x < width + DOT_SPACING; x += DOT_SPACING) {
        for (let y = startY; y < height + DOT_SPACING; y += DOT_SPACING) {
          const dotX = x + offsetX;
          const dotY = y + offsetY;
          ctx.rect(dotX - BASE_RADIUS, dotY - BASE_RADIUS, BASE_RADIUS * 2, BASE_RADIUS * 2);
        }
      }
      ctx.fill();

      // 2. Localized cursor reactive glow (only checks nearby dots)
      if (mouse.active && smooth.x > -500) {
        const minX = smooth.x - GLOW_RADIUS;
        const maxX = smooth.x + GLOW_RADIUS;
        const minY = smooth.y - GLOW_RADIUS;
        const maxY = smooth.y + GLOW_RADIUS;

        for (let x = startX; x < width + DOT_SPACING; x += DOT_SPACING) {
          const dotX = x + offsetX;
          if (dotX < minX || dotX > maxX) continue;

          for (let y = startY; y < height + DOT_SPACING; y += DOT_SPACING) {
            const dotY = y + offsetY;
            if (dotY < minY || dotY > maxY) continue;

            const distSq = (dotX - smooth.x) * (dotX - smooth.x) + (dotY - smooth.y) * (dotY - smooth.y);
            if (distSq < GLOW_RADIUS * GLOW_RADIUS) {
              const dist = Math.sqrt(distSq);
              const factor = 1 - dist / GLOW_RADIUS;
              const radius = BASE_RADIUS + factor * 1.5;
              const alpha = 0.08 + factor * 0.35;

              ctx.fillStyle = `rgba(200, 255, 0, ${alpha})`;
              ctx.beginPath();
              ctx.arc(dotX, dotY, radius, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }

      animId = requestAnimationFrame(loop);
    };

    const startLoop = () => {
      if (!isRunning) {
        isRunning = true;
        idleFrames = 0;
        animId = requestAnimationFrame(loop);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
      startLoop();
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      startLoop();
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isDesktop]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Mobile & Tablet: Ultra-lightweight native CSS pattern (0 canvas allocation, 0 JS loop, 0 crash) */}
      {!isDesktop && (
        <div
          className="w-full h-full"
          style={{
            backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            backgroundPosition: "center center",
          }}
        />
      )}

      {/* Desktop: Interactive Canvas with idle sleep and hardware batching */}
      {isDesktop && (
        <canvas
          ref={canvasRef}
          className="w-full h-full"
        />
      )}
    </div>
  );
}
