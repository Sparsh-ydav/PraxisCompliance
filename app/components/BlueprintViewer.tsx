"use client";

import React from "react";
import type { Blueprint, SpatialElement } from "@/fixtures/blueprints";

interface BlueprintViewerProps {
  blueprint: Blueprint;
  highlightedElementId?: string | null;
  onElementClick?: (elementId: string) => void;
  // Backward compatibility for ripple move animation
  isMoved?: boolean;
  isRechecking?: boolean;
}

export default function BlueprintViewer({
  blueprint,
  highlightedElementId,
  onElementClick,
  isMoved = false,
  isRechecking = false,
}: BlueprintViewerProps) {
  const meta = blueprint.spatialMetadata || {
    viewBox: { width: 320, height: 240 },
    elements: [],
  };

  // For W2 in bp-blocking, apply offset if isMoved is true
  const getRenderBounds = (elem: SpatialElement) => {
    if (blueprint.id === "bp-blocking" && elem.elementId === "W2") {
      const x = isMoved ? 175 : elem.bounds.x;
      return { ...elem.bounds, x };
    }
    return elem.bounds;
  };

  const viewBox = `0 0 ${meta.viewBox.width} ${meta.viewBox.height}`;

  // Find the currently highlighted element object (if any)
  const highlightedElement = meta.elements.find(
    (e) => e.elementId === highlightedElementId
  );

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-3 transition-all">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
          <span className="text-xs font-bold text-slate-800 tracking-wide uppercase">
            Spatial Blueprint Model — {blueprint.label.split("—")[1] || blueprint.label}
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm bg-slate-700 inline-block" /> Rooms & Walls
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-1.5 rounded-sm bg-sky-500 inline-block" /> Openings
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-0.5 border-b border-rose-500 border-dashed inline-block" /> Setback
          </span>
        </div>
      </div>

      {/* SVG Container */}
      <div className="relative overflow-hidden rounded border border-slate-100 bg-slate-50/70">
        <svg
          viewBox={viewBox}
          className="w-full h-auto"
          style={{ maxHeight: 250 }}
        >
          <defs>
            {/* Grid background */}
            <pattern
              id={`grid-${blueprint.id}`}
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

            {/* Glow filters for active elements */}
            <filter id="glow-blocking" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#f43f5e" floodOpacity="0.8" />
            </filter>
            <filter id="glow-active" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#0284c7" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* Rooms (drawn first as backgrounds) */}
          {meta.elements
            .filter((e) => e.type === "room")
            .map((elem) => {
              const bounds = getRenderBounds(elem);
              const isHighlight = elem.elementId === highlightedElementId;

              return (
                <g
                  key={elem.elementId}
                  onClick={() => onElementClick?.(elem.elementId)}
                  className="cursor-pointer group"
                >
                  <rect
                    x={bounds.x}
                    y={bounds.y}
                    width={bounds.width}
                    height={bounds.height}
                    fill={`url(#grid-${blueprint.id})`}
                    className="transition-colors"
                  />
                  <rect
                    x={bounds.x}
                    y={bounds.y}
                    width={bounds.width}
                    height={bounds.height}
                    fill={isHighlight ? "rgba(59, 130, 246, 0.08)" : "rgba(248, 250, 252, 0.4)"}
                    stroke={isHighlight ? "#2563eb" : "#334155"}
                    strokeWidth={isHighlight ? "3" : "2.5"}
                    strokeDasharray={isHighlight ? "4,2" : "none"}
                    rx="2"
                    filter={isHighlight ? "url(#glow-active)" : undefined}
                    className="transition-all duration-300"
                  />
                  <text
                    x={bounds.x + bounds.width / 2}
                    y={bounds.y + bounds.height / 2}
                    textAnchor="middle"
                    className="font-medium"
                    style={{
                      fontSize: 9,
                      fontFamily: "system-ui, sans-serif",
                      fill: isHighlight ? "#1d4ed8" : "#64748b",
                      fontWeight: isHighlight ? 700 : 500,
                    }}
                  >
                    {elem.label}
                  </text>
                </g>
              );
            })}

          {/* Compass Rose */}
          <g transform="translate(25, 25)">
            <line x1="0" y1="10" x2="0" y2="-5" stroke="#94a3b8" strokeWidth="1.5" />
            <polygon points="0,-8 -3,-2 3,-2" fill="#94a3b8" />
            <text
              x="0"
              y="-12"
              textAnchor="middle"
              style={{ fontSize: 7, fontFamily: "system-ui, sans-serif", fill: "#94a3b8", fontWeight: 700 }}
            >
              N
            </text>
          </g>

          {/* Setback / Property boundary lines */}
          {meta.elements
            .filter((e) => e.type === "setback")
            .map((elem) => {
              const bounds = getRenderBounds(elem);
              const isHighlight = elem.elementId === highlightedElementId;
              const isViolatedInRipple =
                blueprint.id === "bp-blocking" && isMoved && elem.elementId === "setback-side";
              const strokeColor = isViolatedInRipple || isHighlight ? "#f43f5e" : "#94a3b8";

              return (
                <g key={elem.elementId} onClick={() => onElementClick?.(elem.elementId)} className="cursor-pointer">
                  <line
                    x1={bounds.x}
                    y1={bounds.y}
                    x2={bounds.x}
                    y2={bounds.y + bounds.height}
                    stroke={strokeColor}
                    strokeWidth={isHighlight || isViolatedInRipple ? "3" : "1.5"}
                    strokeDasharray={isViolatedInRipple ? "none" : "5,4"}
                    filter={isHighlight ? "url(#glow-blocking)" : undefined}
                    className="transition-all duration-500"
                  />
                  <text
                    x={bounds.x}
                    y={bounds.y - 8}
                    textAnchor="middle"
                    style={{
                      fontSize: 7.5,
                      fontFamily: "system-ui, sans-serif",
                      fill: strokeColor,
                      fontWeight: isHighlight || isViolatedInRipple ? 700 : 600,
                    }}
                  >
                    {elem.label} {isViolatedInRipple ? "(5.0′ — VIOLATION)" : ""}
                  </text>
                </g>
              );
            })}

          {/* Openings: Windows & Doors */}
          {meta.elements
            .filter((e) => e.type === "window" || e.type === "door")
            .map((elem) => {
              const bounds = getRenderBounds(elem);
              const isHighlight = elem.elementId === highlightedElementId;
              const isWindow = elem.type === "window";
              const isW2Moved = blueprint.id === "bp-blocking" && elem.elementId === "W2" && isMoved;

              return (
                <g
                  key={elem.elementId}
                  onClick={() => onElementClick?.(elem.elementId)}
                  className="cursor-pointer"
                >
                  <rect
                    x={bounds.x}
                    y={bounds.y}
                    width={bounds.width}
                    height={bounds.height}
                    fill={
                      isHighlight
                        ? "#f59e0b"
                        : isW2Moved
                        ? "#10b981"
                        : isWindow
                        ? "#0ea5e9"
                        : "#8b5cf6"
                    }
                    stroke={
                      isHighlight
                        ? "#b45309"
                        : isW2Moved
                        ? "#047857"
                        : isWindow
                        ? "#0284c7"
                        : "#6d28d9"
                    }
                    strokeWidth={isHighlight ? "2.5" : "1.5"}
                    rx="1.5"
                    filter={isHighlight ? "url(#glow-blocking)" : undefined}
                    style={{
                      transition: "all 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  />
                  <text
                    x={bounds.x + bounds.width / 2}
                    y={bounds.y < 50 ? bounds.y - 4 : bounds.y + bounds.height + 11}
                    textAnchor="middle"
                    style={{
                      fontSize: 8,
                      fontFamily: "system-ui, sans-serif",
                      fill: isHighlight ? "#b45309" : "#334155",
                      fontWeight: isHighlight ? 700 : 600,
                      transition: "all 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    {elem.elementId}
                  </text>
                </g>
              );
            })}

          {/* Dynamic dimension callout line if blueprint is bp-blocking and has W2 + setback */}
          {blueprint.id === "bp-blocking" && (
            <g style={{ transition: "all 0.5s ease" }}>
              {(() => {
                const wX = isMoved ? 175 : 120;
                const bX = 230;
                const dY = 195;
                const distanceFt = isMoved ? "5.0′ (Violation)" : "6.0′ (Compliant)";
                const isViolated = isMoved;

                return (
                  <>
                    <line
                      x1={wX + 30}
                      y1={dY}
                      x2={bX}
                      y2={dY}
                      stroke={isViolated ? "#f43f5e" : "#64748b"}
                      strokeWidth="1.5"
                      className="transition-all duration-500"
                    />
                    <polygon
                      points={`${wX + 30},${dY - 3} ${wX + 30},${dY + 3} ${wX + 34},${dY}`}
                      fill={isViolated ? "#f43f5e" : "#64748b"}
                    />
                    <polygon
                      points={`${bX},${dY - 3} ${bX},${dY + 3} ${bX - 4},${dY}`}
                      fill={isViolated ? "#f43f5e" : "#64748b"}
                    />
                    <rect
                      x={(wX + 30 + bX) / 2 - 32}
                      y={dY - 11}
                      width="64"
                      height="14"
                      fill={isViolated ? "#ffe4e6" : "#ffffff"}
                      stroke={isViolated ? "#f43f5e" : "#94a3b8"}
                      strokeWidth="0.8"
                      rx="2"
                    />
                    <text
                      x={(wX + 30 + bX) / 2}
                      y={dY - 1}
                      textAnchor="middle"
                      style={{
                        fontSize: 7.5,
                        fontFamily: "system-ui, sans-serif",
                        fill: isViolated ? "#e11d48" : "#475569",
                        fontWeight: 700,
                      }}
                    >
                      {distanceFt}
                    </text>
                  </>
                );
              })()}
            </g>
          )}
        </svg>

        {/* Loading overlay during recheck */}
        {isRechecking && (
          <div className="absolute inset-0 bg-white/75 backdrop-blur-[1px] flex items-center justify-center">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white rounded-full text-xs font-semibold shadow">
              <svg className="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Evaluating Spatial Constraints…</span>
            </div>
          </div>
        )}
      </div>

      {/* Selected element badge */}
      <div className="mt-2.5 flex items-center justify-between text-xs px-1">
        {highlightedElement ? (
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 font-semibold text-[11px] flex items-center gap-1">
              <span>🎯 Focused Element:</span>
              <span className="font-mono">{highlightedElement.elementId}</span>
            </span>
            <span className="text-slate-600 text-[11px]">{highlightedElement.label}</span>
          </div>
        ) : (
          <span className="text-slate-400 text-[11px] italic">
            Click any finding card below to highlight its source element on the blueprint.
          </span>
        )}

        <span className="text-[10px] text-slate-400">Scale: 1/4″ = 1′-0″</span>
      </div>
    </div>
  );
}
