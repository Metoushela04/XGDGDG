"use client";

import { useEffect, useRef } from "react";

export function DotGridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Config
    const DOT_SPACING = 32;
    const DOT_RADIUS = 0.8;
    const DOT_COLOR = "rgba(255, 255, 255, 0.12)";
    const GLOW_RADIUS = 180;
    const GLOW_INTENSITY = 0.25;
    const PARALLAX_STRENGTH = 8;
    const LERP_SPEED = 0.06;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let smoothMouse = { x: -1000, y: -1000 };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    const draw = () => {
      if (!ctx) return;

      // Smooth mouse interpolation
      if (mouseRef.current.active) {
        smoothMouse.x += (mouseRef.current.x - smoothMouse.x) * LERP_SPEED;
        smoothMouse.y += (mouseRef.current.y - smoothMouse.y) * LERP_SPEED;
      } else {
        smoothMouse.x += (-1000 - smoothMouse.x) * LERP_SPEED;
        smoothMouse.y += (-1000 - smoothMouse.y) * LERP_SPEED;
      }

      ctx.clearRect(0, 0, width, height);

      const offsetX = ((smoothMouse.x - width / 2) / width) * PARALLAX_STRENGTH;
      const offsetY = ((smoothMouse.y - height / 2) / height) * PARALLAX_STRENGTH;

      const startX = Math.floor((-offsetX) / DOT_SPACING) * DOT_SPACING - DOT_SPACING;
      const startY = Math.floor((-offsetY) / DOT_SPACING) * DOT_SPACING - DOT_SPACING;

      for (let x = startX; x < width + DOT_SPACING; x += DOT_SPACING) {
        for (let y = startY; y < height + DOT_SPACING; y += DOT_SPACING) {
          const dotX = x + offsetX;
          const dotY = y + offsetY;

          const dx = dotX - smoothMouse.x;
          const dy = dotY - smoothMouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          let alpha = 0.12;
          let radius = DOT_RADIUS;

          if (dist < GLOW_RADIUS) {
            const intensity = 1 - dist / GLOW_RADIUS;
            alpha = 0.12 + intensity * GLOW_INTENSITY;
            radius = DOT_RADIUS + intensity * 1.2;
          }

          ctx.beginPath();
          ctx.arc(dotX, dotY, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.fill();
        }
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    animFrameRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
