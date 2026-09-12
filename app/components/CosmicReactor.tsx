"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import * as THREE from "three";

type ColorTheme = "cyan" | "gold" | "violet" | "emerald";

interface ThemeDef {
  primary: number;
  secondary: number;
  accent: number;
  core: number;
  aspect: string;
  label: string;
}

const THEMES: Record<ColorTheme, ThemeDef> = {
  cyan: {
    primary: 0x00f0ff,
    secondary: 0x3b82f6,
    accent: 0xa855f7,
    core: 0xffffff,
    aspect: "rgba(0, 240, 255, 0.4)",
    label: "Quantum Cyan",
  },
  gold: {
    primary: 0xfbbf24,
    secondary: 0xf59e0b,
    accent: 0xef4444,
    core: 0xffffff,
    aspect: "rgba(251, 191, 36, 0.4)",
    label: "Solar Gold",
  },
  violet: {
    primary: 0xa855f7,
    secondary: 0x8b5cf6,
    accent: 0xec4899,
    core: 0xffffff,
    aspect: "rgba(168, 85, 247, 0.4)",
    label: "Deep Violet",
  },
  emerald: {
    primary: 0x34d399,
    secondary: 0x10b981,
    accent: 0x06b6d4,
    core: 0xffffff,
    aspect: "rgba(52, 211, 153, 0.4)",
    label: "Emerald Fusion",
  },
};

export default function CosmicReactor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<ColorTheme>("cyan");
  const [showHUD, setShowHUD] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [particleDensity, setParticleDensity] = useState<"standard" | "high">("high");
  const [coreOutput, setCoreOutput] = useState(98.4);
  const [fps, setFps] = useState(60);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ---------------------------------------------------------------
    // Scene / Camera / Renderer
    // ---------------------------------------------------------------
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030712);

    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      4000
    );
    camera.position.set(0, 0, 620);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // ---------------------------------------------------------------
    // Lights
    // ---------------------------------------------------------------
    scene.add(new THREE.AmbientLight(0xffffff, 0.75));

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(150, 200, 300);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x00f0ff, 1.2);
    rimLight.position.set(-200, -50, -100);
    scene.add(rimLight);

    // ---------------------------------------------------------------
    // Helpers
    // ---------------------------------------------------------------
    const radius = Math.random;

    const particleTexture = (() => {
      const canvas = document.createElement("canvas");
      canvas.width = 64;
      canvas.height = 64;
      const c = canvas.getContext("2d");
      if (!c) return null;
      const grad = c.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, "rgba(255,255,255,1)");
      grad.addColorStop(0.25, "rgba(255,255,255,0.8)");
      grad.addColorStop(1, "rgba(255,255,255,0)");
      c.fillStyle = grad;
      c.fillRect(0, 0, 64, 64);
      const tex = new THREE.CanvasTexture(canvas);
      return tex;
    })();

    // ---------------------------------------------------------------
    // Central Glowing Sphere — layered so it reads as a luminous core
    // ---------------------------------------------------------------
    // Innermost white-hot core
    const coreSphere = new THREE.Mesh(
      new THREE.SphereGeometry(30, 64, 64),
      new THREE.MeshBasicMaterial({ color: THEMES[theme].core })
    );
    // Where the "reactor" blue-white glow comes from
    const coreGlow = new THREE.Mesh(
      new THREE.SphereGeometry(44, 64, 64),
      new THREE.MeshBasicMaterial({ color: THEMES[theme].primary, transparent: true, opacity: 0.9 })
    );
    // Outer volumetric haze (semi-transparent shell)
    const outerShell = new THREE.Mesh(
      new THREE.SphereGeometry(70, 64, 64),
      new THREE.MeshBasicMaterial({ color: THEMES[theme].secondary, transparent: true, opacity: 0.28 })
    );
    const reactorGroup = new THREE.Group();
    reactorGroup.add(coreSphere, coreGlow, outerShell);
    scene.add(reactorGroup);

    // Overlaid PointLight to make glow "irradiate" the particles subtly
    const coreLight = new THREE.PointLight(THEMES[theme].primary, 2.4, 900, 2);
    reactorGroup.add(coreLight);

    // ---------------------------------------------------------------
    // Rotating Gyroscope Rings — thin glowing torus loops at different tilts
    // ---------------------------------------------------------------
    const rings: { mesh: THREE.Mesh; rotSpeed: number }[] = [];
    const ringConfigs = [
      { radius: 140, tube: 0.6, color: 0x00f0ff, tilt: [0.3, 0.2, 0.1], speed: 0.35 },
      { radius: 195, tube: 0.5, color: 0x60a5fa, tilt: [-0.6, 0.5, -0.3], speed: -0.28 },
      { radius: 260, tube: 0.5, color: 0xc084fc, tilt: [0.8, -0.4, 0.6], speed: 0.22 },
      { radius: 330, tube: 0.4, color: 0x38bdf8, tilt: [-0.2, -0.8, 0.4], speed: -0.16 },
      { radius: 410, tube: 0.35, color: 0x93c5fd, tilt: [0.4, 0.7, -0.5], speed: 0.11 },
    ];

    for (const cfg of ringConfigs) {
      const torus = new THREE.Mesh(
        new THREE.TorusGeometry(cfg.radius, cfg.tube, 8, 96),
        new THREE.MeshBasicMaterial({
          color: new THREE.Color(cfg.color),
          transparent: true,
          opacity: 0.7,
        })
      );
      torus.rotation.x = cfg.tilt[0];
      torus.rotation.y = cfg.tilt[1];
      torus.rotation.z = cfg.tilt[2];
      rings.push({ mesh: torus, rotSpeed: cfg.speed });
      reactorGroup.add(torus);
    }

    // Glowing energy beads on each ring
    const beads: THREE.Mesh[] = [];
    const ringSegments = [96, 72, 90, 100, 120];
    rings.forEach((ring, index) => {
      const count = 3 + index % 3;
      for (let i = 0; i < count; i++) {
        const bead = new THREE.Mesh(
          new THREE.SphereGeometry(7, 16, 16),
          new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 1 })
        );
        bead.userData.destIndex = (i / count) * ringSegments[index];
        reactorGroup.add(bead);
        beads.push(bead);
      }
    });

    // ---------------------------------------------------------------
    // Orbital Particle System — hundreds of glowing dots with trails
    // ---------------------------------------------------------------
    const densities: Record<string, number> = { standard: 260, high: 420 };
    const particleCount = densities[particleDensity];

    const trailPositions = new Float32Array(particleCount * 3);
    const trailGeom = new THREE.BufferGeometry();
    trailGeom.setAttribute("position", new THREE.BufferAttribute(trailPositions, 3));
    const trailMat = new THREE.PointsMaterial({
      size: 1.8,
      color: THEMES[theme].primary,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const trailPoints = new THREE.Points(trailGeom, trailMat);
    scene.add(trailPoints);

    const orbitColors = new Float32Array(particleCount * 3);
    const orbitSize = new Float32Array(particleCount);
    const palette = [0x00f0ff, 0x38bdf8, 0x60a5fa, 0xa855f7, 0xffffff];

    const orbits = Array.from({ length: particleCount }, (_, i) => {
      const t = (i % 5) / 4;
      const col = new THREE.Color(palette[i % palette.length]);
      orbitColors[i * 3] = col.r;
      orbitColors[i * 3 + 1] = col.g;
      orbitColors[i * 3 + 2] = col.b;
      orbitSize[i] = 1.2 + radius() * 2.4;

      return {
        radius: 120 + radius() * 340,
        speed: (radius() * 0.4 + 0.18) * (radius() > 0.5 ? 1 : -1),
        phase: radius() * Math.PI * 2,
        inclination: (radius() - 0.5) * Math.PI,
        eccentricity: 0.8 + radius() * 0.22,
        wobble: radius() * 0.3,
        trail: t * 0.6 + 0.5,
      };
    });

    const particlesGeom = new THREE.BufferGeometry();
    particlesGeom.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(particleCount * 3), 3)
    );
    particlesGeom.setAttribute("color", new THREE.BufferAttribute(orbitColors, 3));
    particlesGeom.setAttribute(
      "size",
      new THREE.BufferAttribute(new Float32Array(particleCount), 1)
    );

    const particlesMat = new THREE.PointsMaterial({
      size: 3.2,
      map: particleTexture ?? undefined,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particlesGeom, particlesMat);
    scene.add(particles);

    // ---------------------------------------------------------------
    // Ambient 3D Starfield
    // ---------------------------------------------------------------
    const starCount = 1600;
    const starGeom = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (radius() - 0.5) * 2000;
      starPos[i * 3 + 1] = (radius() - 0.5) * 2000;
      starPos[i * 3 + 2] = (radius() - 0.5) * 2000;
    }
    starGeom.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.1,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
    });
    const starField = new THREE.Points(starGeom, starMat);
    scene.add(starField);

    // ---------------------------------------------------------------
    // Interaction — mouse slightly influences camera orbit
    // ---------------------------------------------------------------
    let pointerX = 0;
    let pointerY = 0;
    let dragging = false;
    let dragRotY = 0;

    const onPointerMove = (e: PointerEvent) => {
      pointerX = (e.clientX / window.innerWidth) * 2 - 1;
      pointerY = -(e.clientY / window.innerHeight) * 2 + 1;
      if (dragging) {
        dragRotY += e.movementX * 0.005;
      }
    };
    const onPointerDown = () => {
      dragging = true;
    };
    const onPointerUp = () => {
      dragging = false;
    };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);

    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    // ---------------------------------------------------------------
    // Animation Loop
    // ---------------------------------------------------------------
    let rafId: number;
    let last = performance.now();
    let frames = 0;
    let fpsAccum = 0;

    const animate = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      frames++;
      fpsAccum += dt;
      if (fpsAccum >= 0.5) {
        setFps(Math.round(frames / fpsAccum));
        frames = 0;
        fpsAccum = 0;
        setCoreOutput(Number((98.2 + Math.sin(now * 0.002) * 1.5).toFixed(1)));
      }

      const s = speedMultiplier;
      const t = now * 0.001;

      // Reactor breathing
      const pulse = 1 + Math.sin(t * 1.4) * 0.04;
      reactorGroup.scale.setScalar(pulse);
      const glowPulse = 0.85 + Math.sin(t * 1.4) * 0.15;
      (outerShell.material as THREE.MeshBasicMaterial).opacity = 0.22 + glowPulse * 0.1;

      // Rings rotate about their own axes
      for (const ring of rings) {
        ring.mesh.rotation.z += ring.rotSpeed * dt * s;
        ring.mesh.rotation.y += ring.rotSpeed * dt * s * 0.4;
      }

      // Energy beads ride their ring's path
      beads.forEach((bead, idx) => {
        const cfg = ringConfigs[idx % ringConfigs.length];
        const segments = ringSegments[idx % ringSegments.length];
        const destAngle = (bead.userData.destIndex / segments) * Math.PI * 2;
        const angle = destAngle + t * (idx % 2 === 0 ? 0.4 : -0.3) * s;
        const bx = Math.cos(angle) * cfg.radius;
        const by = Math.sin(angle) * cfg.radius;
        const bz = Math.sin(angle * 2) * 10 * Math.sin(t * 0.2);
        bead.position.set(bx, by, bz);
      });

      // Particle orbits along varied 3D trajectories
      const posAttr = particlesGeom.getAttribute("position") as THREE.BufferAttribute;
      const trailAttr = trailGeom.getAttribute("position") as THREE.BufferAttribute;
      const pos = posAttr.array as Float32Array;

      for (let i = 0; i < particleCount; i++) {
        const o = orbits[i];
        const ang = t * o.speed * s + o.phase;

        let x: number;
        let y: number;
        let z: number;

        const type = i % 5;
        if (type === 0) {
          // Ring-plane orbits
          x = Math.cos(ang) * o.radius * o.eccentricity;
          y = Math.sin(ang) * o.radius;
          z = Math.sin(ang * 3) * o.radius * 0.25;
        } else if (type === 1) {
          // Polar (ribbons in/out of plane)
          x = Math.sin(ang * 2) * o.radius * 0.35;
          y = Math.cos(ang) * o.radius;
          z = Math.sin(ang) * o.radius * o.eccentricity;
        } else if (type === 2) {
          // Elliptical spiral
          const wob = (1 + Math.sin(t * 0.9 + i) * 0.12) * o.radius;
          x = Math.cos(ang * 1.4) * wob;
          y = Math.sin(ang * 1.4) * wob;
          z = Math.cos(ang * 0.6) * wob * 0.7;
        } else if (type === 3) {
          // Spherical shell flow
          const incl = o.inclination;
          x = Math.cos(ang) * Math.sin(incl);
          y = Math.sin(ang) * Math.sin(incl);
          z = Math.cos(incl);
          const r = o.radius;
          x *= r;
          y *= r;
          z *= r;
        } else {
          // Inner ring, tight and fast
          const r = o.radius * 0.55;
          x = Math.cos(ang * 1.8) * r;
          y = Math.sin(ang * 1.8) * r;
          z = Math.cos(ang * 0.9) * r * 0.35;
        }

        // Keep particle within reactorGroup's "explosion" space by
        // applying bounding so they never fly through the very core:
        const dist = Math.sqrt(x * x + y * y + z * z);
        if (dist < 92) {
          const scale = 92 / dist;
          x *= scale;
          y *= scale;
          z *= scale;
        }

        pos[i * 3] = x;
        pos[i * 3 + 1] = y;
        pos[i * 3 + 2] = z;

        // Trail point lags behind — a shortened "leading tail"
        trailPositions[i * 3] = x * o.trail;
        trailPositions[i * 3 + 1] = y * o.trail;
        trailPositions[i * 3 + 2] = z * o.trail;
        trailAttr.needsUpdate = true;
      }
      posAttr.needsUpdate = true;

      // Continuous slow auto-rotation + mouse influence
      const targetRotY = t * 0.06 * s + dragRotY;
      const targetRotX = pointerY * 0.25;
      reactorGroup.rotation.y += (targetRotY - reactorGroup.rotation.y) * 0.05;
      reactorGroup.rotation.x += (targetRotX + 0.12 - reactorGroup.rotation.x) * 0.05;
      starField.rotation.y = reactorGroup.rotation.y * 0.08;
      starField.rotation.x = reactorGroup.rotation.x * 0.08;

      // Subtle camera drift
      camera.position.x += (pointerX * 22 - camera.position.x) * 0.03;
      camera.position.y += (-pointerY * 14 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    // Adapt theme colors live
    const applyTheme = () => {
      const th = THEMES[theme];
      (coreGlow.material as THREE.MeshBasicMaterial).color.setHex(th.primary);
      (outerShell.material as THREE.MeshBasicMaterial).color.setHex(th.secondary);
      (coreLight.color as THREE.Color).setHex(th.primary);
      (trailMat.color as THREE.Color).setHex(th.primary);
    };
    applyTheme();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("resize", onResize);
      scene.traverse((obj: THREE.Object3D) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          (obj.material as THREE.Material).dispose();
        }
      });
      trailGeom.dispose();
      particlesGeom.dispose();
      starGeom.dispose();
      trailMat.dispose();
      particlesMat.dispose();
      starMat.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [theme, speedMultiplier, particleDensity]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen bg-[#030712] overflow-hidden select-none"
    >
      {/* Top bar */}
      <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center pointer-events-none z-20">
        <div className="flex items-center gap-4 pointer-events-auto">
          <Link
            href="/"
            className="text-xs tracking-widest text-slate-400 hover:text-cyan-400 transition-colors uppercase flex items-center gap-2 border border-slate-800 bg-slate-950/80 backdrop-blur px-3 py-1.5 rounded"
          >
            <span>←</span> Back to Main
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <h1 className="text-sm font-semibold tracking-wider text-slate-100 uppercase">
              Quantum Energy Core <span className="text-cyan-400 font-mono">v4.8</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4 pointer-events-auto">
          <button
            onClick={() => setShowHUD(!showHUD)}
            className="text-xs tracking-wider uppercase border border-slate-800 bg-slate-950/80 hover:bg-slate-900 text-slate-300 px-3 py-1.5 rounded transition-colors backdrop-blur"
          >
            {showHUD ? "Hide Telemetry" : "Show Telemetry"}
          </button>
        </div>
      </header>

      {/* Telemetry HUD */}
      {showHUD && (
        <>
          <div className="absolute top-20 right-6 w-64 bg-slate-950/80 border border-cyan-500/20 rounded-lg p-4 backdrop-blur-md shadow-2xl pointer-events-auto z-20 text-xs font-mono space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-slate-400">REACTOR STATUS</span>
              <span className="text-emerald-400 font-bold tracking-wider">ONLINE</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-slate-300">
                <span>Core Output</span>
                <span className="text-cyan-300 font-bold">{coreOutput}%</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${coreOutput}%` }}
                ></div>
              </div>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Orbital Harmonics</span>
              <span className="text-slate-200">Synchronized</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Active Particles</span>
              <span className="text-cyan-400">
                {particleDensity === "high" ? "420 Units" : "260 Units"}
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Frame Rate</span>
              <span className="text-emerald-400">{fps} FPS</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Render Engine</span>
              <span className="text-slate-200">Three.js WebGL</span>
            </div>
          </div>

          {/* Control dock */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-950/85 border border-slate-800 rounded-full px-6 py-3 backdrop-blur-md flex items-center gap-6 pointer-events-auto z-20 shadow-2xl">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider mr-1">
                Spectrum
              </span>
              {(Object.keys(THEMES) as ColorTheme[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setTheme(key)}
                  title={THEMES[key].label}
                  className={`w-6 h-6 rounded-full transition-all ${
                    theme === key
                      ? "ring-2 ring-white scale-110"
                      : "opacity-60 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: `#${THEMES[key].primary.toString(16).padStart(6, "0")}` }}
                />
              ))}
            </div>
            <div className="w-px h-5 bg-slate-800"></div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider">
                Velocity
              </span>
              <div className="flex gap-1">
                {[0.5, 1, 2].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeedMultiplier(s)}
                    className={`px-2 py-0.5 text-xs font-mono rounded ${
                      speedMultiplier === s
                        ? "bg-cyan-500 text-slate-950 font-bold"
                        : "text-slate-400 hover:text-white bg-slate-900"
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>
            <div className="w-px h-5 bg-slate-800"></div>
            <button
              onClick={() => setParticleDensity(particleDensity === "high" ? "standard" : "high")}
              className="text-xs text-slate-300 hover:text-cyan-400 transition-colors uppercase tracking-wider font-mono"
            >
              Density: <span className="text-cyan-400">{particleDensity}</span>
            </button>
          </div>

          <div className="absolute bottom-6 left-6 text-xs text-slate-500 font-mono pointer-events-none z-20">
            <p>MOVE MOUSE TO STEER CAMERA</p>
            <p className="text-[10px] text-slate-600">60 FPS REACTOR CORE SIMULATION</p>
          </div>
        </>
      )}
    </div>
  );
}