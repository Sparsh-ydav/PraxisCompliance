"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface RegulationCode {
  id: string;
  section: string;
  title: string;
  meaning: string;
  category: "Egress" | "Zoning" | "Fire Safety" | "Structure";
  severity: "Blocking" | "Advisory" | "Mandatory";
  enforcement: string;
  confidence: string;
}

const REGULATION_CODES: RegulationCode[] = [
  {
    id: "fe-102",
    section: "Section 101.2",
    title: "Emergency Escape & Rescue Openings",
    meaning: "Every sleeping room & habitable basement requires min. 5.7 sq ft net clear opening, min. 24″ height, and sill ≤ 44″ above floor.",
    category: "Egress",
    severity: "Blocking",
    enforcement: "Strictly enforced: reviewers flag 100% of non-compliant bedroom windows.",
    confidence: "95% confidence",
  },
  {
    id: "fe-105",
    section: "Section 101.5",
    title: "Egress Pathway & Corridor Width",
    meaning: "Hallways and corridors serving as required exit paths must maintain min. 36″ clear unobstructed width.",
    category: "Egress",
    severity: "Blocking",
    enforcement: "Frequently written correction on 1st-floor residential additions.",
    confidence: "94% confidence",
  },
  {
    id: "sb-203",
    section: "Section 201.3",
    title: "Side Setback Requirements (R-1)",
    meaning: "Minimum 6 ft side yard setback on each side; combined total must be not less than 15 ft across both side yards.",
    category: "Zoning",
    severity: "Advisory",
    enforcement: "Admin waiver granted if < 6″ encroachment with certified survey.",
    confidence: "92% confidence",
  },
  {
    id: "sb-204",
    section: "Section 201.4",
    title: "Rear Setback Requirements",
    meaning: "Primary additions must maintain at least 25 ft clear setback from the rear property boundary line.",
    category: "Zoning",
    severity: "Blocking",
    enforcement: "Automated pre-check flags setback clash before submission.",
    confidence: "90% confidence",
  },
  {
    id: "fe-109",
    section: "Section 101.9",
    title: "Smoke Alarm Integration",
    meaning: "Interconnected UL 217 smoke alarms required in all sleeping rooms and on each story of renovated dwelling units.",
    category: "Fire Safety",
    severity: "Mandatory",
    enforcement: "Mandatory municipal sign-off required prior to certificate of occupancy.",
    confidence: "99% confidence",
  },
  {
    id: "fe-104",
    section: "Section 101.4",
    title: "Primary Exit Door Dimensions",
    meaning: "Primary exit door must provide min. 32″ clear width and 78″ height; screen doors cannot reduce required width.",
    category: "Egress",
    severity: "Blocking",
    enforcement: "Learned pattern flags undersized 30″ doors in residential plans.",
    confidence: "93% confidence",
  },
  {
    id: "fe-106",
    section: "Section 101.6",
    title: "Stairway Clear Width & Handrails",
    meaning: "Interior stairs require min. 36″ clear width. Handrails cannot project more than 4.5″ into stairway path.",
    category: "Structure",
    severity: "Blocking",
    enforcement: "Common issue flagged during finished basement permit reviews.",
    confidence: "88% confidence",
  },
  {
    id: "fe-107",
    section: "Section 101.7",
    title: "Egress Window Well Requirements",
    meaning: "Below-grade escape openings require window wells with min. 36″ horizontal projection and full opening clearance.",
    category: "Egress",
    severity: "Blocking",
    enforcement: "Always inspected during on-site basement egress verification.",
    confidence: "91% confidence",
  },
  {
    id: "sb-202",
    section: "Section 201.2",
    title: "Front Setback — R-1 Single Family",
    meaning: "No addition shall be constructed closer than 25 feet from the front property line measured from the primary structure face.",
    category: "Zoning",
    severity: "Blocking",
    enforcement: "Zero informal tolerance; requires formal Zoning Board variance.",
    confidence: "96% confidence",
  },
  {
    id: "sb-206",
    section: "Section 201.6",
    title: "Accessory Structure Setbacks",
    meaning: "Detached garages and sheds require min. 5 ft setback from side and rear property lines; prohibited in front yards.",
    category: "Zoning",
    severity: "Advisory",
    enforcement: "Structures over 200 sq ft must follow primary structure setbacks.",
    confidence: "87% confidence",
  },
  {
    id: "sb-209",
    section: "Section 201.9",
    title: "Impervious Surface Coverage Limit",
    meaning: "Total impervious surface coverage for R-1 lots shall not exceed 40% of total lot area including driveways and patios.",
    category: "Zoning",
    severity: "Advisory",
    enforcement: "Additions exceeding 40% require a civil stormwater management plan.",
    confidence: "89% confidence",
  },
  {
    id: "fe-108",
    section: "Section 101.8",
    title: "Emergency Escape Window Operability",
    meaning: "Escape openings must be operable from inside without keys, tools, or special knowledge; latch releases must be standard.",
    category: "Fire Safety",
    severity: "Mandatory",
    enforcement: "Security bar releases strictly inspected for keyless single-motion exit.",
    confidence: "97% confidence",
  },
];

interface PointDefinition {
  id: string;
  ringIndex: number;
  angle: number;
  color: number;
}

const POINT_DEFINITIONS: PointDefinition[] = [
  { id: "pt-1", ringIndex: 0, angle: 0.9, color: 0x00f0ff },
  { id: "pt-2", ringIndex: 1, angle: 2.3, color: 0x3b82f6 },
  { id: "pt-3", ringIndex: 1, angle: 5.1, color: 0x2563eb },
  { id: "pt-4", ringIndex: 2, angle: 3.8, color: 0x0284c7 },
  { id: "pt-5", ringIndex: 3, angle: 1.4, color: 0x6366f1 },
  { id: "pt-6", ringIndex: 4, angle: 3.5, color: 0x059669 },
  { id: "pt-7", ringIndex: 2, angle: 0.4, color: 0x00d4ff },
];

export default function HeroOrb() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activePoint, setActivePoint] = useState<RegulationCode | null>(null);
  const [hoveredPointId, setHoveredPointId] = useState<string | null>(null);
  const lastCodeIndexRef = useRef<number>(-1);

  // Helper to get a fresh random code that isn't the same as the previous one
  const getRandomCode = () => {
    let nextIdx = Math.floor(Math.random() * REGULATION_CODES.length);
    if (nextIdx === lastCodeIndexRef.current) {
      nextIdx = (nextIdx + 1) % REGULATION_CODES.length;
    }
    lastCodeIndexRef.current = nextIdx;
    return REGULATION_CODES[nextIdx];
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ─── Three.js Scene Setup ─────────────────────────────────────
    const width = container.clientWidth || 460;
    const height = container.clientHeight || 460;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.4);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // ─── Central Luminous Core ────────────────────────────────────
    const coreGroup = new THREE.Group();
    rootGroup.add(coreGroup);

    const coreGeom = new THREE.SphereGeometry(0.5, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const coreMesh = new THREE.Mesh(coreGeom, coreMat);
    coreGroup.add(coreMesh);

    const plasmaGeom = new THREE.SphereGeometry(0.72, 32, 32);
    const plasmaMat = new THREE.MeshBasicMaterial({
      color: 0x00d4ff,
      transparent: true,
      opacity: 0.88,
    });
    const plasmaMesh = new THREE.Mesh(plasmaGeom, plasmaMat);
    coreGroup.add(plasmaMesh);

    const shellGeom = new THREE.SphereGeometry(0.95, 32, 32);
    const shellMat = new THREE.MeshBasicMaterial({
      color: 0x1d4ed8,
      transparent: true,
      opacity: 0.35,
    });
    const shellMesh = new THREE.Mesh(shellGeom, shellMat);
    coreGroup.add(shellMesh);

    const haloGeom = new THREE.SphereGeometry(1.24, 32, 32);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.18,
    });
    const haloMesh = new THREE.Mesh(haloGeom, haloMat);
    coreGroup.add(haloMesh);

    const cageGeom = new THREE.IcosahedronGeometry(1.12, 1);
    const cageMat = new THREE.MeshBasicMaterial({
      color: 0x1e3a5f,
      wireframe: true,
      transparent: true,
      opacity: 0.55,
    });
    const cageMesh = new THREE.Mesh(cageGeom, cageMat);
    coreGroup.add(cageMesh);

    // ─── Medium Pace Gyroscopic Rings ─────────────────────────────
    // Set to balanced medium speed: visible, fluid, elegant rotation
    interface RingItem {
      mesh: THREE.Mesh;
      baseTilt: THREE.Euler;
      rotSpeedX: number;
      rotSpeedY: number;
      radius: number;
    }

    const ringConfigs = [
      { radius: 1.48, tube: 0.016, color: 0x1e3a5f, opacity: 0.88, tilt: [0.65, 0.25, 0.45], spdX: 0.15, spdY: 0.32 },
      { radius: 1.82, tube: 0.014, color: 0x2563eb, opacity: 0.82, tilt: [-0.68, 0.78, -0.32], spdX: -0.18, spdY: -0.28 },
      { radius: 2.18, tube: 0.012, color: 0x0284c7, opacity: 0.76, tilt: [0.92, -0.42, 0.72], spdX: 0.14, spdY: 0.24 },
      { radius: 2.54, tube: 0.011, color: 0x6366f1, opacity: 0.70, tilt: [-0.38, -0.88, 0.52], spdX: -0.12, spdY: -0.20 },
      { radius: 2.90, tube: 0.009, color: 0x059669, opacity: 0.60, tilt: [0.32, 0.62, -0.72], spdX: 0.10, spdY: 0.16 },
    ];

    const rings: RingItem[] = ringConfigs.map((cfg) => {
      const geom = new THREE.TorusGeometry(cfg.radius, cfg.tube, 16, 120);
      const mat = new THREE.MeshBasicMaterial({
        color: cfg.color,
        transparent: true,
        opacity: cfg.opacity,
      });
      const mesh = new THREE.Mesh(geom, mat);
      const baseTilt = new THREE.Euler(cfg.tilt[0], cfg.tilt[1], cfg.tilt[2]);
      mesh.rotation.copy(baseTilt);
      rootGroup.add(mesh);

      return {
        mesh,
        baseTilt,
        rotSpeedX: cfg.spdX,
        rotSpeedY: cfg.spdY,
        radius: cfg.radius,
      };
    });

    // ─── Points on the Rings ──────────────────────────────────────
    interface PointMeshGroup {
      id: string;
      core: THREE.Mesh;
      halo: THREE.Mesh;
      hitMesh: THREE.Mesh;
      color: number;
      angle: number;
    }

    const interactiveHitMeshes: THREE.Mesh[] = [];
    const pointMeshGroups: PointMeshGroup[] = [];

    POINT_DEFINITIONS.forEach((pt) => {
      const ring = rings[pt.ringIndex];
      const px = Math.cos(pt.angle) * ring.radius;
      const py = Math.sin(pt.angle) * ring.radius;
      const pz = 0;

      // 1. Point Core
      const coreGeo = new THREE.SphereGeometry(0.065, 16, 16);
      const coreMaterial = new THREE.MeshBasicMaterial({
        color: pt.color,
      });
      const core = new THREE.Mesh(coreGeo, coreMaterial);
      core.position.set(px, py, pz);
      ring.mesh.add(core);

      // 2. Halo ring around point
      const haloGeo = new THREE.TorusGeometry(0.11, 0.012, 8, 32);
      const haloMaterial = new THREE.MeshBasicMaterial({
        color: pt.color,
        transparent: true,
        opacity: 0.6,
      });
      const halo = new THREE.Mesh(haloGeo, haloMaterial);
      halo.position.set(px, py, pz);
      ring.mesh.add(halo);

      // 3. Invisible enlarged hit sphere for comfortable hover targeting
      const hitGeo = new THREE.SphereGeometry(0.28, 8, 8);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      hitMesh.position.set(px, py, pz);
      hitMesh.userData = { pointId: pt.id };
      ring.mesh.add(hitMesh);

      interactiveHitMeshes.push(hitMesh);
      pointMeshGroups.push({
        id: pt.id,
        core,
        halo,
        hitMesh,
        color: pt.color,
        angle: pt.angle,
      });
    });

    // ─── Raycaster & Point Hover Interaction with Randomizing ────
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-1000, -1000);
    let targetParallaxX = 0;
    let targetParallaxY = 0;
    let currentHoverId: string | null = null;
    let randomizeTimer: NodeJS.Timeout | null = null;

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      mouse.x = x;
      mouse.y = y;

      // Gentle mouse parallax
      targetParallaxX = -y * 0.22;
      targetParallaxY = x * 0.30;

      // Raycast against point hit meshes
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveHitMeshes);

      if (intersects.length > 0) {
        const hit = intersects[0];
        const pointId = hit.object.userData.pointId as string;

        if (currentHoverId !== pointId) {
          currentHoverId = pointId;
          setHoveredPointId(pointId);

          // Randomize section code immediately on hover!
          setActivePoint(getRandomCode());
          container.style.cursor = "pointer";

          // Keep randomizing sections while maintaining hover (every 2.8s)
          if (randomizeTimer) clearInterval(randomizeTimer);
          randomizeTimer = setInterval(() => {
            setActivePoint(getRandomCode());
          }, 2800);
        }
      } else {
        if (currentHoverId !== null) {
          currentHoverId = null;
          setHoveredPointId(null);
          setActivePoint(null);
          container.style.cursor = "default";
          if (randomizeTimer) {
            clearInterval(randomizeTimer);
            randomizeTimer = null;
          }
        }
      }
    };

    const onPointerLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
      targetParallaxX = 0;
      targetParallaxY = 0;
      currentHoverId = null;
      setHoveredPointId(null);
      setActivePoint(null);
      container.style.cursor = "default";
      if (randomizeTimer) {
        clearInterval(randomizeTimer);
        randomizeTimer = null;
      }
    };

    container.addEventListener("mousemove", onPointerMove);
    container.addEventListener("mouseleave", onPointerLeave);

    // ─── Resize Observer ──────────────────────────────────────────
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 460;
      const h = container.clientHeight || 460;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // ─── Animation Loop (Medium Pace Rotation) ────────────────────
    let animationFrameId: number;
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = (performance.now() - startTime) * 0.001;

      // 1. Medium pace rotation on each ring
      rings.forEach((ring) => {
        ring.mesh.rotation.y = ring.baseTilt.y + time * ring.rotSpeedY;
        ring.mesh.rotation.x = ring.baseTilt.x + Math.sin(time * ring.rotSpeedX) * 0.35;
      });

      // 2. Central Core Breathing & core cage turn
      const corePulse = 1 + Math.sin(time * 2.4) * 0.04;
      coreMesh.scale.setScalar(corePulse);
      plasmaMesh.scale.setScalar(1 + Math.sin(time * 2.0 + 0.3) * 0.05);
      shellMesh.scale.setScalar(1 + Math.sin(time * 1.6 + 0.6) * 0.03);
      cageMesh.rotation.y = time * 0.22;

      // 3. Update Point visual highlights
      pointMeshGroups.forEach((ptGroup) => {
        const isHovered = currentHoverId === ptGroup.id;

        if (isHovered) {
          ptGroup.core.scale.setScalar(1.65);
          (ptGroup.core.material as THREE.MeshBasicMaterial).color.setHex(0xffffff);

          const haloPulse = 1.6 + Math.sin(time * 8) * 0.25;
          ptGroup.halo.scale.setScalar(haloPulse);
          (ptGroup.halo.material as THREE.MeshBasicMaterial).opacity = 0.95;
        } else {
          const ambientPulse = 1.0 + Math.sin(time * 3.0 + ptGroup.angle) * 0.12;
          ptGroup.core.scale.setScalar(ambientPulse);
          (ptGroup.core.material as THREE.MeshBasicMaterial).color.setHex(ptGroup.color);

          const haloAmbient = 1.0 + Math.sin(time * 2.4 + ptGroup.angle) * 0.15;
          ptGroup.halo.scale.setScalar(haloAmbient);
          (ptGroup.halo.material as THREE.MeshBasicMaterial).opacity = 0.5;
        }
      });

      // 4. Parallax tilt & subtle levitation
      rootGroup.rotation.x += (targetParallaxX - rootGroup.rotation.x) * 0.05;
      rootGroup.rotation.y += (targetParallaxY - rootGroup.rotation.y) * 0.05;
      rootGroup.position.y = Math.sin(time * 1.1) * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    // ─── Cleanup ──────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animationFrameId);
      if (randomizeTimer) clearInterval(randomizeTimer);
      resizeObserver.disconnect();
      container.removeEventListener("mousemove", onPointerMove);
      container.removeEventListener("mouseleave", onPointerLeave);

      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });

      renderer.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative flex items-center justify-center pointer-events-auto select-none"
      style={{ minHeight: "460px" }}
    >
      {/* Floating Section Code Callout — Randomizes upon point hover */}
      {activePoint && (
        <div
          key={activePoint.section}
          className="absolute z-30 pointer-events-none transition-all duration-300 ease-out"
          style={{
            right: "12px",
            bottom: "16px",
            maxWidth: "340px",
          }}
        >
          <div className="bg-white/95 border border-slate-200 rounded-xl p-4 shadow-xl backdrop-blur-md space-y-2 animate-in fade-in zoom-in-95 duration-200">
            {/* Header: Section Code, Category & Confidence */}
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-blue-50 text-blue-700 border border-blue-200/60">
                  {activePoint.section}
                </span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  {activePoint.category}
                </span>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  activePoint.severity === "Blocking"
                    ? "bg-red-50 text-red-600 border border-red-200"
                    : activePoint.severity === "Mandatory"
                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                    : "bg-blue-50 text-blue-600 border border-blue-200"
                }`}
              >
                {activePoint.severity}
              </span>
            </div>

            {/* Title */}
            <h4 className="text-sm font-bold text-municipal-blue leading-snug">
              {activePoint.title}
            </h4>

            {/* Meaning & Regulation Detail */}
            <p className="text-xs text-slate-600 leading-relaxed">
              {activePoint.meaning}
            </p>

            {/* Municipal Enforcement Pattern Hint */}
            <div className="pt-1.5 border-t border-slate-100 flex items-start justify-between gap-2 text-[11px] text-slate-500">
              <div className="flex items-start gap-1.5">
                <span className="text-blue-500 font-bold shrink-0">ℹ</span>
                <span className="italic leading-tight">{activePoint.enforcement}</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-600 font-semibold shrink-0 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60">
                {activePoint.confidence}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
