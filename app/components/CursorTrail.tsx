"use client";

import { useEffect, useRef } from "react";

interface TrailDot {
  x: number;
  y: number;
  opacity: number;
  scale: number;
}

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const dotsRef = useRef<TrailDot[]>([]);
  const posRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const timeRef = useRef(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Start position
    posRef.current.x = canvas.width * 0.3;
    posRef.current.y = canvas.height * 0.4;
    posRef.current.targetX = canvas.width * 0.6;
    posRef.current.targetY = canvas.height * 0.3;

    const pickNewTarget = () => {
      const pad = 60;
      posRef.current.targetX = pad + Math.random() * (canvas.width - pad * 2);
      posRef.current.targetY = pad + Math.random() * (canvas.height - pad * 2);
    };

    const animate = (timestamp: number) => {
      const dt = timestamp - timeRef.current;
      timeRef.current = timestamp;

      const pos = posRef.current;
      const dx = pos.targetX - pos.x;
      const dy = pos.targetY - pos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 30) pickNewTarget();

      // Smooth easing toward target
      const speed = 0.008;
      pos.x += dx * speed * (dt / 16);
      pos.y += dy * speed * (dt / 16);

      // Emit trail dot every few frames
      if (dotsRef.current.length === 0 || dist > 2) {
        dotsRef.current.push({ x: pos.x, y: pos.y, opacity: 0.35, scale: 1 });
      }

      // Limit trail length
      if (dotsRef.current.length > 80) {
        dotsRef.current = dotsRef.current.slice(-80);
      }

      // Draw
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw trail dots (fading)
      for (let i = 0; i < dotsRef.current.length; i++) {
        const dot = dotsRef.current[i];
        dot.opacity *= 0.985;
        dot.scale *= 0.997;

        if (dot.opacity < 0.01) {
          dotsRef.current.splice(i, 1);
          i--;
          continue;
        }

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 3 * dot.scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(37, 99, 235, ${dot.opacity})`;
        ctx.fill();
      }

      // Draw cursor head
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(30, 58, 95, 0.5)";
      ctx.fill();

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}
