"use client";

interface FloorPlanDiagramProps {
  isMoved: boolean;
  isRechecking: boolean;
}

/**
 * 2D top-down SVG floor-plan diagram for the basement bedroom.
 * Shows Window W2 on the south wall, the east property boundary,
 * and a dynamic dimension callout line between them.
 *
 * Animation sync: CSS transition 1.2s matches the recheck loading state.
 */
export default function FloorPlanDiagram({
  isMoved,
  isRechecking,
}: FloorPlanDiagramProps) {
  // Window positions from ripple-effect.ts data
  const windowBefore = { x: 120, y: 160, distanceToBoundaryFt: 6.0 };
  const windowAfter = { x: 175, y: 160, distanceToBoundaryFt: 5.0 };

  const activeWindowX = isMoved ? windowAfter.x : windowBefore.x;
  const activeDistance = isMoved
    ? windowAfter.distanceToBoundaryFt
    : windowBefore.distanceToBoundaryFt;
  const isViolation = activeDistance < 6.0;

  // Boundary line position (constant)
  const boundaryX = 230;

  // Dimension line endpoints
  const dimY = 195;

  return (
    <div className="relative">
      {/* Diagram label */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          Floor Plan — Basement Bedroom (11′ × 13′)
        </span>
        <div className="flex items-center gap-3 text-[10px] text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-slate-600 inline-block" />
            Walls
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-sky-500 inline-block" />
            Window W2
          </span>
          <span
            className={`flex items-center gap-1 ${
              isViolation ? "text-rose-500 font-semibold" : ""
            }`}
          >
            <span
              className={`w-2 h-0.5 inline-block ${
                isViolation
                  ? "bg-rose-500"
                  : "bg-slate-400"
              }`}
              style={{ borderBottom: isViolation ? "none" : "2px dashed" }}
            />
            Property Line
          </span>
        </div>
      </div>

      <svg
        viewBox="0 0 320 220"
        className="w-full h-auto bg-slate-50 rounded border border-slate-200"
        style={{ maxHeight: 220 }}
      >
        {/* Floor grid pattern */}
        <defs>
          <pattern
            id="grid"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>

        {/* Room fill with grid */}
        <rect
          x="40"
          y="40"
          width="190"
          height="140"
          fill="url(#grid)"
          rx="2"
        />

        {/* Room outline */}
        <rect
          x="40"
          y="40"
          width="190"
          height="140"
          fill="none"
          stroke="#334155"
          strokeWidth="3"
          rx="2"
        />

        {/* Room label */}
        <text
          x="135"
          y="115"
          textAnchor="middle"
          className="fill-slate-400 text-[10px]"
          style={{ fontSize: 10, fontFamily: "system-ui, sans-serif" }}
        >
          Basement Bedroom
        </text>
        <text
          x="135"
          y="128"
          textAnchor="middle"
          className="fill-slate-300"
          style={{ fontSize: 8, fontFamily: "system-ui, sans-serif" }}
        >
          11′ × 13′
        </text>

        {/* Compass indicator */}
        <g transform="translate(55, 55)">
          <line
            x1="0"
            y1="10"
            x2="0"
            y2="-5"
            stroke="#94a3b8"
            strokeWidth="1.5"
          />
          <polygon points="0,-8 -3,-2 3,-2" fill="#94a3b8" />
          <text
            x="0"
            y="-12"
            textAnchor="middle"
            style={{
              fontSize: 7,
              fontFamily: "system-ui, sans-serif",
              fill: "#94a3b8",
              fontWeight: 600,
            }}
          >
            N ↑
          </text>
        </g>

        {/* East property boundary line */}
        <line
          x1={boundaryX}
          y1="30"
          x2={boundaryX}
          y2="195"
          stroke={isViolation ? "#f43f5e" : "#94a3b8"}
          strokeWidth={isViolation ? 2 : 1.5}
          strokeDasharray={isViolation ? "none" : "5,4"}
          className="transition-all duration-500"
        />

        {/* Boundary label */}
        <text
          x={boundaryX}
          y="25"
          textAnchor="middle"
          style={{
            fontSize: 7,
            fontFamily: "system-ui, sans-serif",
            fill: isViolation ? "#f43f5e" : "#94a3b8",
            fontWeight: 600,
          }}
        >
          East Property Line
        </text>

        {/* Window W2 — animated rectangle on south wall */}
        <rect
          x={activeWindowX}
          y="175"
          width="30"
          height="8"
          fill={isViolation ? "#f97316" : "#0ea5e9"}
          stroke={isViolation ? "#ea580c" : "#0284c7"}
          strokeWidth="1.5"
          rx="1"
          style={{
            transition: "x 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />

        {/* Window label */}
        <text
          x={activeWindowX + 15}
          y="172"
          textAnchor="middle"
          style={{
            fontSize: 7,
            fontFamily: "system-ui, sans-serif",
            fill: "#475569",
            fontWeight: 600,
            transition: "all 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          W2
        </text>

        {/* Dimension callout line */}
        <g style={{ transition: "all 0.4s ease" }}>
          {/* Horizontal dimension line */}
          <line
            x1={activeWindowX + 30}
            y1={dimY}
            x2={boundaryX}
            y2={dimY}
            stroke={isViolation ? "#f43f5e" : "#64748b"}
            strokeWidth="1"
            className="transition-all duration-500"
          />

          {/* Left arrow */}
          <polygon
            points={`${activeWindowX + 30},${dimY - 3} ${activeWindowX + 30},${dimY + 3} ${activeWindowX + 34},${dimY}`}
            fill={isViolation ? "#f43f5e" : "#64748b"}
            className="transition-all duration-500"
            style={{
              transition: "all 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />

          {/* Right arrow */}
          <polygon
            points={`${boundaryX},${dimY - 3} ${boundaryX},${dimY + 3} ${boundaryX - 4},${dimY}`}
            fill={isViolation ? "#f43f5e" : "#64748b"}
            className="transition-all duration-500"
          />

          {/* Dimension text background */}
          <rect
            x={(activeWindowX + 30 + boundaryX) / 2 - 22}
            y={dimY - 12}
            width="44"
            height="14"
            fill="white"
            stroke={isViolation ? "#fda4af" : "#cbd5e1"}
            strokeWidth="0.5"
            rx="3"
            className="transition-all duration-500"
            style={{
              transition: "all 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />

          {/* Dimension text */}
          <text
            x={(activeWindowX + 30 + boundaryX) / 2}
            y={dimY - 2}
            textAnchor="middle"
            style={{
              fontSize: 9,
              fontFamily: "system-ui, sans-serif",
              fill: isViolation ? "#e11d48" : "#475569",
              fontWeight: 700,
              transition: "all 0.4s ease",
            }}
          >
            {activeDistance.toFixed(1)} ft
          </text>
        </g>

        {/* Violation badge */}
        {isViolation && (
          <g>
            <rect
              x={(activeWindowX + 30 + boundaryX) / 2 - 30}
              y={dimY + 6}
              width="60"
              height="14"
              fill="#fef2f2"
              stroke="#fca5a5"
              strokeWidth="0.75"
              rx="7"
            />
            <text
              x={(activeWindowX + 30 + boundaryX) / 2}
              y={dimY + 16}
              textAnchor="middle"
              style={{
                fontSize: 7,
                fontFamily: "system-ui, sans-serif",
                fill: "#dc2626",
                fontWeight: 700,
              }}
            >
              1.0 ft encroachment
            </text>
          </g>
        )}

        {/* Recheck spinner indicator */}
        {isRechecking && (
          <g>
            <circle
              cx="300"
              cy="40"
              r="6"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeDasharray="20 12"
              strokeLinecap="round"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 300 40"
                to="360 300 40"
                dur="1s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        )}
      </svg>
    </div>
  );
}
