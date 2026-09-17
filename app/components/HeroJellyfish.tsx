"use client";

import { useState, useRef } from "react";

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
    section: "NBC 2016 Part 4, Clause 4.10",
    title: "Emergency Escape Openings & Ventilation",
    meaning: "Every sleeping room & habitable basement requires min. 500 mm (20″) clear width, 600 mm (24″) height, and sill ≤ 1100 mm (44″) above floor.",
    category: "Egress",
    severity: "Blocking",
    enforcement: "Strictly enforced: municipal reviewers flag non-compliant bedroom openings.",
    confidence: "95% confidence",
  },
  {
    id: "fe-105",
    section: "NBC 2016 Part 4, Clause 4.5.1",
    title: "Corridor & Passageway Width",
    meaning: "Residential corridors and exit access passageways must maintain min. 1000 mm (1.0 m / 3.3 ft) clear unobstructed width.",
    category: "Egress",
    severity: "Blocking",
    enforcement: "Mandatory check on residential floor plans and additions.",
    confidence: "94% confidence",
  },
  {
    id: "sb-203",
    section: "NBC 2016 Part 3, Clause 8.2.3",
    title: "Side Open Space Requirements",
    meaning: "Minimum 1.8 m (6.0 ft) clear side open space on each side to ensure natural light, ventilation, and fire access.",
    category: "Zoning",
    severity: "Advisory",
    enforcement: "Admin waiver granted if < 150 mm (6″) encroachment with registered survey.",
    confidence: "92% confidence",
  },
  {
    id: "sb-204",
    section: "NBC 2016 Part 3, Clause 8.2.2",
    title: "Rear Open Space Requirements",
    meaning: "Primary additions must maintain at least 7.5 m (25 ft) clear setback from the rear property boundary line.",
    category: "Zoning",
    severity: "Blocking",
    enforcement: "Automated pre-check flags open space clash before municipal scrutiny.",
    confidence: "90% confidence",
  },
  {
    id: "fe-109",
    section: "NBC 2016 Part 4, Clause 4.17",
    title: "Smoke & Heat Detection System",
    meaning: "Interconnected automatic smoke/heat detection schedule under Table 7 required in all habitable rooms.",
    category: "Fire Safety",
    severity: "Mandatory",
    enforcement: "Mandatory municipal sign-off required prior to building completion certificate.",
    confidence: "99% confidence",
  },
  {
    id: "fe-104",
    section: "NBC 2016 Part 4, Clause 4.4.2",
    title: "Primary Exit Door Dimensions",
    meaning: "Primary exit doorway must provide min. 1000 mm (1.0 m) clear width and 2000 mm (2.0 m) clear height.",
    category: "Egress",
    severity: "Blocking",
    enforcement: "Reviewers flag undersized 750 mm doorways in residential plans.",
    confidence: "93% confidence",
  },
  {
    id: "fe-106",
    section: "NBC 2016 Part 4, Clause 4.6.1",
    title: "Staircase Width, Tread & Riser",
    meaning: "Residential interior stairs require min. 1000 mm clear width, min. 250 mm tread, and max. 190 mm riser per Table 6.",
    category: "Structure",
    severity: "Blocking",
    enforcement: "Strictly scrutinized during multi-story and basement permit reviews.",
    confidence: "88% confidence",
  },
  {
    id: "fe-107",
    section: "NBC 2016 Part 4, Clause 4.10.3",
    title: "Basement Window Well Clearance",
    meaning: "Below-grade escape openings require window wells with min. 900 mm (36″) horizontal projection from wall face.",
    category: "Egress",
    severity: "Blocking",
    enforcement: "Always inspected during on-site basement egress verification.",
    confidence: "91% confidence",
  },
  {
    id: "sb-202",
    section: "NBC 2016 Part 3, Clause 8.2.1",
    title: "Front Open Space — Residential",
    meaning: "No addition shall be constructed closer than 7.5 m (25 ft) from front property line measured from primary structure face.",
    category: "Zoning",
    severity: "Blocking",
    enforcement: "Zero informal tolerance; requires formal Planning Authority variance.",
    confidence: "96% confidence",
  },
];

interface RingNode {
  id: string;
  cx: number;
  cy: number;
  color: string;
  label: string;
}

const RING_NODES: RingNode[] = [
  { id: "fe-102", cx: 108, cy: 195, color: "#00f0ff", label: "NBC 4.10" },
  { id: "fe-105", cx: 395, cy: 175, color: "#38bdf8", label: "NBC 4.5.1" },
  { id: "sb-203", cx: 80, cy: 260, color: "#60a5fa", label: "NBC 8.2.3" },
  { id: "sb-204", cx: 425, cy: 245, color: "#818cf8", label: "NBC 8.2.2" },
  { id: "fe-109", cx: 135, cy: 340, color: "#f59e0b", label: "NBC 4.17" },
  { id: "fe-106", cx: 370, cy: 330, color: "#ec4899", label: "NBC 4.6.1" },
  { id: "sb-202", cx: 250, cy: 78, color: "#10b981", label: "NBC 8.2.1" },
];

export default function HeroJellyfish() {
  const [activePoint, setActivePoint] = useState<RegulationCode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<RingNode | null>(null);
  const lastCodeIndexRef = useRef<number>(-1);
  const randomizeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const getRandomCode = () => {
    let nextIdx = Math.floor(Math.random() * REGULATION_CODES.length);
    if (nextIdx === lastCodeIndexRef.current) {
      nextIdx = (nextIdx + 1) % REGULATION_CODES.length;
    }
    lastCodeIndexRef.current = nextIdx;
    return REGULATION_CODES[nextIdx];
  };

  const handleNodeEnter = (node: RingNode) => {
    setHoveredNode(node);
    setActivePoint(getRandomCode());

    if (randomizeTimerRef.current) clearInterval(randomizeTimerRef.current);
    randomizeTimerRef.current = setInterval(() => {
      setActivePoint(getRandomCode());
    }, 2800);
  };

  const handleNodeLeave = () => {
    setHoveredNode(null);
    setActivePoint(null);
    if (randomizeTimerRef.current) {
      clearInterval(randomizeTimerRef.current);
      randomizeTimerRef.current = null;
    }
  };

  return (
    <div className="w-full h-full relative flex items-center justify-center pointer-events-auto select-none overflow-visible">
      
      <svg
        viewBox="0 0 500 520"
        className="w-full h-full max-w-[500px] max-h-[520px] overflow-visible drop-shadow-[0_12px_40px_rgba(236,72,153,0.25)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* ─── FILTERS FOR HYPER-REALISM ─── */}
          <filter id="heavyBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur" />
          </filter>
          
          <filter id="mediumBlur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          </filter>
          
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* SVG Displacement Map to make tentacles ripple fluidly like water */}
          <filter id="waterRipple" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.015 0.025" numOctaves="2" result="noise">
              <animate attributeName="baseFrequency" values="0.015 0.025; 0.02 0.03; 0.015 0.025" dur="8s" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="12" xChannelSelector="R" yChannelSelector="G" />
          </filter>

          <filter id="tentacleRipple" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence type="fractalNoise" baseFrequency="0.01 0.02" numOctaves="2" result="noise">
              <animate attributeName="baseFrequency" values="0.01 0.02; 0.015 0.025; 0.01 0.02" dur="6s" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="25" xChannelSelector="R" yChannelSelector="G" />
          </filter>

          {/* ─── MULTI-LAYERED GRADIENTS ─── */}
          
          {/* Back Wall of the Bell (adds volume) */}
          <linearGradient id="bellBackGrad" x1="250" y1="70" x2="250" y2="220" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4c1d95" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#701a75" stopOpacity="0.6" />
          </linearGradient>

          {/* Core Body Glow (The fleshy center) */}
          <radialGradient id="coreGlowGrad" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#fbcfe8" stopOpacity="0.9" />
            <stop offset="30%" stopColor="#c084fc" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#4c1d95" stopOpacity="0" />
          </radialGradient>

          {/* Intense Internal Blue Patches */}
          <radialGradient id="bluePatch1" cx="35%" cy="35%" r="45%">
            <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#0284c7" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="bluePatch2" cx="65%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#2563eb" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#172554" stopOpacity="0" />
          </radialGradient>

          {/* Front Translucent Glassy Dome */}
          <linearGradient id="bellFrontGrad" x1="250" y1="65" x2="250" y2="230" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f472b6" stopOpacity="0.65" />
            <stop offset="25%" stopColor="#e879f9" stopOpacity="0.5" />
            <stop offset="60%" stopColor="#d946ef" stopOpacity="0.35" />
            <stop offset="90%" stopColor="#a21caf" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#701a75" stopOpacity="0.8" />
          </linearGradient>

          {/* Glossy Specular Highlights */}
          <linearGradient id="specularRim" x1="130" y1="210" x2="370" y2="210" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fdf4ff" stopOpacity="0.1" />
            <stop offset="20%" stopColor="#e0f2fe" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="80%" stopColor="#e0f2fe" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#fdf4ff" stopOpacity="0.1" />
          </linearGradient>

          {/* Dark Speckled Rim Material */}
          <linearGradient id="darkRimGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2d0a1e" />
            <stop offset="50%" stopColor="#4a0e4e" />
            <stop offset="100%" stopColor="#2d0a1e" />
          </linearGradient>

          {/* Volumetric Oral Arms (Frills) */}
          <linearGradient id="frillGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fdf4ff" stopOpacity="0.8" />
            <stop offset="30%" stopColor="#e879f9" stopOpacity="0.6" />
            <stop offset="80%" stopColor="#86198f" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3b0764" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="frillGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.7" />
            <stop offset="40%" stopColor="#c084fc" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#4c1d95" stopOpacity="0" />
          </linearGradient>

          {/* Fine Tentacles */}
          <linearGradient id="tentacleGradBase" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f472b6" stopOpacity="0.8" />
            <stop offset="30%" stopColor="#c084fc" stopOpacity="0.6" />
            <stop offset="70%" stopColor="#38bdf8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="tentacleGradDark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a21caf" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#6366f1" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.1" />
          </linearGradient>

          {/* Ring Gradients */}
          <linearGradient id="ringGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.65" />
            <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#1e3a5f" stopOpacity="0.15" />
          </linearGradient>

          <linearGradient id="ringGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ec4899" stopOpacity="0.60" />
            <stop offset="60%" stopColor="#8b5cf6" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        <style>{`
          /* ─── Realistic Breathing & Propulsion ─── */
          @keyframes jellySwim {
            0% { transform: translateY(0px) scale(1, 1); }
            20% { transform: translateY(4px) scale(1.02, 0.98); } /* Anticipation dip */
            35% { transform: translateY(-26px) scale(0.85, 1.15); } /* Power stroke */
            55% { transform: translateY(-32px) scale(0.92, 1.08); } /* Glide */
            80% { transform: translateY(-12px) scale(1.04, 0.96); } /* Relaxation */
            100% { transform: translateY(0px) scale(1, 1); }
          }

          /* ─── Internal Glow Pulsation ─── */
          @keyframes intenseGlow {
            0%, 100% { opacity: 0.65; transform: scale(0.95); }
            35% { opacity: 1; transform: scale(1.05); } /* Flare on power stroke */
            70% { opacity: 0.75; transform: scale(1); }
          }

          /* ─── Volumetric Oral Arms (Frills) Sway ─── */
          @keyframes frillSway1 {
            0%, 100% { transform: rotate(0deg) skewX(0deg); }
            40% { transform: rotate(-3deg) skewX(-2deg) scaleY(0.95); }
            75% { transform: rotate(4deg) skewX(3deg) scaleY(1.05); }
          }
          @keyframes frillSway2 {
            0%, 100% { transform: rotate(0deg) skewX(0deg); }
            30% { transform: rotate(5deg) skewX(4deg) scaleY(0.92); }
            70% { transform: rotate(-4deg) skewX(-3deg) scaleY(1.08); }
          }

          /* ─── Orbital Ring Rotation ─── */
          @keyframes ringDrift1 {
            0%, 100% { transform: rotate(-22deg) scale(1); }
            50% { transform: rotate(-18deg) scale(1.02); }
          }
          @keyframes ringDrift2 {
            0%, 100% { transform: rotate(32deg) scale(1); }
            50% { transform: rotate(36deg) scale(0.98); }
          }

          /* ─── Apply Animations ─── */
          .anim-jelly {
            transform-origin: 250px 140px;
            animation: jellySwim 4.2s cubic-bezier(0.35, 0.05, 0.25, 0.95) infinite;
          }
          
          .anim-glow {
            transform-origin: 250px 130px;
            animation: intenseGlow 4.2s ease-in-out infinite;
          }

          /* 
             Instead of rigid CSS rotations for tentacles, we use the SVG feTurbulence displacement map!
             This gives a hyper-realistic, fluid, underwater rippling effect perfectly matching the image.
             We just apply the filter to the tentacle groups.
          */
          .fluid-tentacles {
            filter: url(#tentacleRipple);
          }
          .fluid-frills {
            filter: url(#waterRipple);
          }

          .frill-1 { transform-origin: 250px 200px; animation: frillSway1 4.5s ease-in-out infinite; }
          .frill-2 { transform-origin: 250px 200px; animation: frillSway2 5.2s ease-in-out infinite -1s; }
          
          .ring-1 { transform-origin: 250px 230px; animation: ringDrift1 12s ease-in-out infinite; }
          .ring-2 { transform-origin: 250px 230px; animation: ringDrift2 15s ease-in-out infinite; }
        `}</style>

        {/* ─── 1. GYROSCOPIC RINGS (Back Arcs) ─── */}
        <g className="opacity-70 dark:opacity-85">
          <ellipse cx="250" cy="230" rx="230" ry="90" className="ring-1" stroke="url(#ringGrad1)" strokeWidth="1.2" strokeDasharray="8 4 2 4" fill="none" />
          <ellipse cx="250" cy="230" rx="195" ry="76" className="ring-2" stroke="url(#ringGrad2)" strokeWidth="1.5" fill="none" />
          <ellipse cx="250" cy="230" rx="160" ry="62" transform="rotate(-60 250 230)" stroke="#0284c7" strokeOpacity="0.4" strokeWidth="1" strokeDasharray="4 4" fill="none" />
        </g>

        {/* ─── 2. THE HYPER-REALISTIC JELLYFISH ─── */}
        <g className="anim-jelly">
          
          {/* (A) Background Tentacles (Darker, thinner, pushed back in depth) */}
          <g className="fluid-tentacles" opacity="0.5">
            <path d="M 140,210 Q 110,300 130,420 T 110,550" stroke="url(#tentacleGradDark)" strokeWidth="1" fill="none" strokeLinecap="round" />
            <path d="M 170,215 Q 160,320 190,440 T 180,560" stroke="url(#tentacleGradDark)" strokeWidth="0.8" fill="none" />
            <path d="M 200,220 Q 210,300 190,400 T 210,540" stroke="url(#tentacleGradDark)" strokeWidth="1.2" fill="none" />
            <path d="M 280,220 Q 270,330 300,430 T 280,530" stroke="url(#tentacleGradDark)" strokeWidth="1" fill="none" />
            <path d="M 320,215 Q 340,300 310,410 T 330,550" stroke="url(#tentacleGradDark)" strokeWidth="0.8" fill="none" />
            <path d="M 360,210 Q 390,300 370,420 T 390,560" stroke="url(#tentacleGradDark)" strokeWidth="1.2" fill="none" />
          </g>

          {/* (B) Back Wall of the Bell (Volume) */}
          <path
            d="M 120,210 C 115,130 160,70 250,70 C 340,70 385,130 380,210 C 350,225 300,230 250,230 C 200,230 150,225 120,210 Z"
            fill="url(#bellBackGrad)"
          />

          {/* (C) Intense Internal Glows & Organs (The Blue Patches from the photo!) */}
          <g className="anim-glow">
            {/* Soft pink/purple core fleshy mass */}
            <circle cx="250" cy="140" r="60" fill="url(#coreGlowGrad)" filter="url(#heavyBlur)" />
            
            {/* The striking bright blue patches visible through the top */}
            <ellipse cx="190" cy="130" rx="45" ry="30" transform="rotate(-20 190 130)" fill="url(#bluePatch1)" filter="url(#mediumBlur)" />
            <ellipse cx="310" cy="125" rx="50" ry="35" transform="rotate(25 310 125)" fill="url(#bluePatch2)" filter="url(#mediumBlur)" />
            <circle cx="250" cy="115" r="35" fill="#00f0ff" opacity="0.6" filter="url(#mediumBlur)" />
          </g>

          {/* (D) Volumetric Oral Arms (Ruffled Central Frills) */}
          <g className="fluid-frills">
            {/* Back Frill */}
            <path d="M 210,215 C 190,260 250,320 220,380 C 190,440 240,490 225,540 C 240,490 210,430 240,370 C 270,310 210,250 230,215 Z" fill="url(#frillGrad2)" className="frill-2" />
            {/* Right Frill */}
            <path d="M 280,215 C 310,270 240,330 275,390 C 310,450 250,500 270,550 C 250,500 290,440 260,380 C 230,320 295,260 260,215 Z" fill="url(#frillGrad2)" className="frill-1" />
            {/* Center Thick Frill */}
            <path d="M 240,218 C 220,280 280,350 240,420 C 200,490 270,540 250,580 C 270,530 220,470 260,400 C 300,330 230,260 260,218 Z" fill="url(#frillGrad1)" className="frill-2" />
            
            {/* Ruffled edge highlights */}
            <path d="M 240,218 C 220,280 280,350 240,420 C 200,490 270,540 250,580" stroke="#fbcfe8" strokeWidth="1.5" strokeOpacity="0.8" fill="none" className="frill-2" />
            <path d="M 280,215 C 310,270 240,330 275,390 C 310,450 250,500 270,550" stroke="#bae6fd" strokeWidth="1" strokeOpacity="0.7" fill="none" className="frill-1" />
          </g>

          {/* (E) Front Translucent Glassy Dome */}
          <path
            d="M 120,210 C 115,130 160,65 250,65 C 340,65 385,130 380,210 C 350,235 300,245 250,245 C 200,245 150,235 120,210 Z"
            fill="url(#bellFrontGrad)"
            filter="url(#softGlow)"
          />

          {/* High-fidelity surface details (Ribs & Refractions) */}
          <g opacity="0.6">
            <path d="M 250,65 Q 250,150 250,245" stroke="#fbcfe8" strokeWidth="1.5" fill="none" />
            <path d="M 250,65 Q 210,150 190,238" stroke="#fbcfe8" strokeWidth="1.2" fill="none" />
            <path d="M 250,65 Q 290,150 310,238" stroke="#fbcfe8" strokeWidth="1.2" fill="none" />
            <path d="M 250,65 Q 160,140 145,220" stroke="#fbcfe8" strokeWidth="0.8" fill="none" />
            <path d="M 250,65 Q 340,140 355,220" stroke="#fbcfe8" strokeWidth="0.8" fill="none" />
          </g>

          {/* Crisp Specular Highlights (The 'Wet Glass' Look) */}
          <path d="M 160,105 C 200,75 300,75 340,105" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.9" filter="url(#softGlow)" fill="none" />
          <path d="M 165,110 C 205,82 295,82 335,110" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="1" fill="none" />
          <ellipse cx="320" cy="115" rx="10" ry="4" transform="rotate(-15 320 115)" fill="#ffffff" opacity="0.9" />
          <ellipse cx="175" cy="125" rx="6" ry="2" transform="rotate(25 175 125)" fill="#ffffff" opacity="0.8" />

          {/* (F) Dark Speckled Jagged Rim Markings (Hyper-detailed reference match) */}
          <g>
            {/* Base glowing rim shelf */}
            <path d="M 120,210 C 150,235 200,245 250,245 C 300,245 350,235 380,210" stroke="url(#specularRim)" strokeWidth="5" fill="none" filter="url(#softGlow)" opacity="0.8" />
            
            {/* Intricate, jagged, scalloped dark markings */}
            <path
              d="M 120,210 
                 C 130,195 135,215 145,218 
                 C 155,198 160,222 170,225 
                 C 180,202 185,228 195,231 
                 C 205,206 210,234 220,237 
                 C 230,210 235,240 245,242 
                 C 255,212 260,240 270,241 
                 C 280,210 285,236 295,236 
                 C 305,206 310,230 320,229 
                 C 330,202 335,222 345,220 
                 C 355,196 360,212 370,213 
                 C 375,195 378,210 380,210 
                 C 350,235 300,245 250,245 
                 C 200,245 150,235 120,210 Z"
              fill="url(#darkRimGrad)"
              opacity="0.95"
            />

            {/* Organic pigment speckles clustered near the jagged edges */}
            {[
              { x: 135, y: 210, r: 2.5 }, { x: 140, y: 205, r: 1.5 }, { x: 148, y: 212, r: 3 },
              { x: 160, y: 215, r: 2 }, { x: 165, y: 208, r: 1.8 }, { x: 172, y: 220, r: 3.5 },
              { x: 185, y: 222, r: 2.2 }, { x: 190, y: 212, r: 1.5 }, { x: 198, y: 226, r: 3 },
              { x: 210, y: 228, r: 2.8 }, { x: 215, y: 218, r: 2 }, { x: 222, y: 232, r: 4 },
              { x: 235, y: 234, r: 3 }, { x: 240, y: 224, r: 2.2 }, { x: 248, y: 238, r: 3.5 },
              { x: 260, y: 236, r: 2.5 }, { x: 265, y: 225, r: 1.8 }, { x: 272, y: 235, r: 4 },
              { x: 285, y: 230, r: 3 }, { x: 290, y: 220, r: 2 }, { x: 298, y: 230, r: 3.2 },
              { x: 310, y: 224, r: 2.5 }, { x: 315, y: 214, r: 1.5 }, { x: 322, y: 222, r: 2.8 },
              { x: 335, y: 215, r: 2 }, { x: 340, y: 208, r: 1.2 }, { x: 348, y: 214, r: 2.5 },
              { x: 360, y: 210, r: 1.8 }, { x: 365, y: 202, r: 1 }, { x: 372, y: 210, r: 2 },
            ].map((dot, i) => (
              <circle key={i} cx={dot.x} cy={dot.y} r={dot.r} fill="#1a0413" opacity={0.8 + Math.random() * 0.2} />
            ))}

            {/* Crisp lower specular line over the dark rim */}
            <path d="M 120,210 C 150,235 200,245 250,245 C 300,245 350,235 380,210" stroke="#ffffff" strokeWidth="1" opacity="0.6" fill="none" />
          </g>

          {/* (G) Front Foreground Tentacles (Bright, High Detail) */}
          <g className="fluid-tentacles">
            {/* The sweeping, wide arching tentacles from the image sides */}
            <path d="M 125,213 C 80,230 40,300 70,390 C 100,480 80,550 50,600" stroke="url(#tentacleGradBase)" strokeWidth="1.8" fill="none" strokeLinecap="round" filter="url(#softGlow)" />
            <path d="M 135,217 C 100,250 80,340 120,420 C 160,500 130,570 100,620" stroke="url(#tentacleGradBase)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            
            <path d="M 375,213 C 420,230 460,300 430,390 C 400,480 420,550 450,600" stroke="url(#tentacleGradBase)" strokeWidth="1.8" fill="none" strokeLinecap="round" filter="url(#softGlow)" />
            <path d="M 365,217 C 400,250 420,340 380,420 C 340,500 370,570 400,620" stroke="url(#tentacleGradBase)" strokeWidth="1.2" fill="none" strokeLinecap="round" />

            {/* Central falling fine tentacles */}
            <path d="M 150,222 Q 130,350 170,480 T 160,630" stroke="url(#tentacleGradBase)" strokeWidth="1.5" fill="none" />
            <path d="M 180,230 Q 190,320 160,450 T 190,610" stroke="url(#tentacleGradBase)" strokeWidth="1" fill="none" />
            <path d="M 210,238 Q 230,340 200,470 T 220,640" stroke="url(#tentacleGradBase)" strokeWidth="1.6" fill="none" />
            <path d="M 230,242 Q 220,360 250,490 T 240,650" stroke="url(#tentacleGradBase)" strokeWidth="1" fill="none" />
            <path d="M 270,242 Q 280,360 250,490 T 260,650" stroke="url(#tentacleGradBase)" strokeWidth="1" fill="none" />
            <path d="M 290,238 Q 270,340 300,470 T 280,640" stroke="url(#tentacleGradBase)" strokeWidth="1.6" fill="none" />
            <path d="M 320,230 Q 310,320 340,450 T 310,610" stroke="url(#tentacleGradBase)" strokeWidth="1" fill="none" />
            <path d="M 350,222 Q 370,350 330,480 T 340,630" stroke="url(#tentacleGradBase)" strokeWidth="1.5" fill="none" />
            
            {/* Shimmering bioluminescent photophores along tentacles */}
            <circle cx="70" cy="390" r="2.5" fill="#ffffff" filter="url(#softGlow)" />
            <circle cx="120" cy="420" r="2" fill="#00f0ff" filter="url(#softGlow)" />
            <circle cx="430" cy="390" r="2.5" fill="#ffffff" filter="url(#softGlow)" />
            <circle cx="380" cy="420" r="2" fill="#00f0ff" filter="url(#softGlow)" />
            <circle cx="170" cy="480" r="2" fill="#e879f9" />
            <circle cx="200" cy="470" r="2.2" fill="#00f0ff" />
            <circle cx="250" cy="490" r="1.8" fill="#e879f9" />
            <circle cx="300" cy="470" r="2.2" fill="#00f0ff" />
            <circle cx="330" cy="480" r="2" fill="#e879f9" />
          </g>
        </g>

        {/* ─── 3. INTERACTIVE GYROSCOPIC REGULATION NODES & BIO-ARCS ─── */}
        <g className="interactive-ring-nodes">
          {RING_NODES.map((node) => {
            const isHovered = hoveredNode?.id === node.id;
            return (
              <g
                key={node.id}
                className="cursor-pointer transition-transform duration-200"
                onMouseEnter={() => handleNodeEnter(node)}
                onMouseLeave={handleNodeLeave}
              >
                {/* Connecting Bioluminescent Neural Arc */}
                {isHovered && (
                  <path
                    d={`M ${node.cx},${node.cy} Q 250,${(node.cy + 220) / 2 - 30} 250,220`}
                    stroke={node.color}
                    strokeWidth="3"
                    strokeDasharray="5 4"
                    strokeLinecap="round"
                    fill="none"
                    filter="url(#softGlow)"
                    className="animate-pulse"
                  />
                )}

                {/* Pulsing Halo Ring */}
                <circle
                  cx={node.cx}
                  cy={node.cy}
                  r={isHovered ? 16 : 9}
                  stroke={node.color}
                  strokeWidth={isHovered ? 3 : 1.2}
                  strokeOpacity={isHovered ? 0.95 : 0.6}
                  fill={isHovered ? `${node.color}33` : "none"}
                  className="transition-all duration-300"
                />

                {/* Inner Luminous Core */}
                <circle
                  cx={node.cx}
                  cy={node.cy}
                  r={isHovered ? 7 : 4}
                  fill={isHovered ? "#ffffff" : node.color}
                  filter="url(#softGlow)"
                  className="transition-all duration-200"
                />

                {/* Node Pill Tag */}
                <g transform={`translate(${node.cx > 250 ? node.cx + 14 : node.cx - 72}, ${node.cy - 10})`}>
                  <rect
                    width="58"
                    height="20"
                    rx="10"
                    fill="rgba(15, 23, 42, 0.85)"
                    stroke={node.color}
                    strokeWidth="1.2"
                    strokeOpacity={isHovered ? "1" : "0.4"}
                    className="backdrop-blur-sm"
                  />
                  <text
                    x="29"
                    y="13.5"
                    textAnchor="middle"
                    fill={isHovered ? "#ffffff" : "#cbd5e1"}
                    fontSize="9.5"
                    fontWeight="700"
                    fontFamily="ui-monospace, monospace"
                    letterSpacing="0.05em"
                  >
                    {node.label}
                  </text>
                </g>
              </g>
            );
          })}
        </g>
      </svg>

      {/* ─── FLOATING REGULATION CODE CALLOUT CARD ON HOVER ─── */}
      {activePoint && (
        <div
          key={activePoint.section}
          className="absolute z-40 pointer-events-none transition-all duration-300 ease-out"
          style={{
            right: "10px",
            bottom: "12px",
            maxWidth: "340px",
          }}
        >
          <div className="bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-md space-y-2 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-fuchsia-50 dark:bg-fuchsia-950/80 text-fuchsia-700 dark:text-fuchsia-300 border border-fuchsia-200/60 dark:border-fuchsia-800">
                  {activePoint.section}
                </span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  {activePoint.category}
                </span>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  activePoint.severity === "Blocking"
                    ? "bg-red-50 dark:bg-red-950/70 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800"
                    : activePoint.severity === "Mandatory"
                    ? "bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                    : "bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                }`}
              >
                {activePoint.severity}
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-pink-300 leading-snug">
              {activePoint.title}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {activePoint.meaning}
            </p>
            <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800 flex items-start justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
              <div className="flex items-start gap-1.5">
                <span className="text-pink-500 dark:text-pink-400 font-bold shrink-0">🏛️</span>
                <span className="italic leading-tight">{activePoint.enforcement}</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold shrink-0 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200/60 dark:border-emerald-800">
                {activePoint.confidence}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
