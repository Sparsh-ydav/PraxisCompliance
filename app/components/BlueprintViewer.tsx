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
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 transition-colors">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between mb-3 pb-2.5 border-b border-slate-100 dark:border-slate-800 gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-wide uppercase font-mono">
            Spatial Blueprint Model — {blueprint.label.split("—")[1] || blueprint.label}
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-slate-700 dark:bg-slate-400 inline-block" /> Rooms & Walls
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-1.5 rounded-xs bg-sky-500 inline-block" /> Openings
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-b border-rose-500 border-dashed inline-block" /> Setback Line
          </span>
        </div>
      </div>

      {/* SVG Container */}
      <div className="relative overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950">
        <svg
          viewBox={viewBox}
          className="w-full h-auto text-slate-200 dark:text-slate-800"
          style={{ maxHeight: 260 }}
        >
          <defs>
            {/* Light grid pattern */}
            <pattern
              id={`grid-${blueprint.id}`}
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="opacity-70 dark:opacity-40"
              />
            </pattern>

            {/* Glow filters for active elements */}
            <filter id="glow-blocking" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#f43f5e" floodOpacity="0.8" />
            </filter>
            <filter id="glow-active" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#38bdf8" floodOpacity="0.9" />
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
                  />
                  <rect
                    x={bounds.x}
                    y={bounds.y}
                    width={bounds.width}
                    height={bounds.height}
                    fill={
                      isHighlight
                        ? "rgba(59, 130, 246, 0.12)"
                        : "rgba(248, 250, 252, 0.4)"
                    }
                    stroke={isHighlight ? "#3b82f6" : "#475569"}
                    strokeWidth={isHighlight ? "3" : "2.5"}
                    strokeDasharray={isHighlight ? "4,2" : "none"}
                    rx="3"
                    filter={isHighlight ? "url(#glow-active)" : undefined}
                    className="transition-all duration-300 dark:fill-slate-900/60 dark:stroke-slate-600"
                  />
                  <text
                    x={bounds.x + bounds.width / 2}
                    y={bounds.y + bounds.height / 2}
                    textAnchor="middle"
                    className="font-medium"
                    style={{
                      fontSize: 9,
                      fontFamily: "var(--font-sans), system-ui, sans-serif",
                      fill: isHighlight ? "#2563eb" : "#94a3b8",
                      fontWeight: isHighlight ? 700 : 600,
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
              style={{ fontSize: 7, fontFamily: "var(--font-mono), monospace", fill: "#94a3b8", fontWeight: 700 }}
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
                      fontFamily: "var(--font-mono), monospace",
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
                        ? "#d97706"
                        : isW2Moved
                        ? "#059669"
                        : isWindow
                        ? "#0284c7"
                        : "#7c3aed"
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
                      fontFamily: "var(--font-mono), monospace",
                      fill: isHighlight ? "#f59e0b" : "#94a3b8",
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
                      x={(wX + 30 + bX) / 2 - 34}
                      y={dY - 11}
                      width="68"
                      height="15"
                      fill={isViolated ? "#ffe4e6" : "#ffffff"}
                      stroke={isViolated ? "#f43f5e" : "#94a3b8"}
                      strokeWidth="0.8"
                      rx="2"
                      className="dark:fill-slate-900"
                    />
                    <text
                      x={(wX + 30 + bX) / 2}
                      y={dY}
                      textAnchor="middle"
                      style={{
                        fontSize: 7.5,
                        fontFamily: "var(--font-mono), monospace",
                        fill: isViolated ? "#e11d48" : "#64748b",
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
          <div className="absolute inset-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-[2px] flex items-center justify-center">
            <div className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 dark:bg-blue-600 text-white rounded-full text-xs font-semibold shadow-lg">
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
      <div className="mt-3 flex flex-wrap items-center justify-between text-xs px-1 gap-2">
        {highlightedElement ? (
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 font-semibold text-[11px] flex items-center gap-1">
              <span>🎯 Focused Element:</span>
              <span className="font-mono">{highlightedElement.elementId}</span>
            </span>
            <span className="text-slate-600 dark:text-slate-400 text-[11px]">{highlightedElement.label}</span>
          </div>
        ) : (
          <span className="text-slate-400 dark:text-slate-500 text-[11px] italic">
            Click any finding card below to highlight its source element on the blueprint.
          </span>
        )}

        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">Scale: 1/4″ = 1′-0″</span>
      </div>
    </div>
  );
}
