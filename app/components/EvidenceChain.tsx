"use client";

import React, { useState } from "react";
import type { GraphData, EvidenceGraphNode } from "@/lib/evidence-graph";
import type { ComplianceFinding } from "@/lib/schemas";
import type { Blueprint } from "@/fixtures/blueprints";
import type { RippleEffectResult } from "@/lib/ripple-effect";
import { buildEvidenceGraph, buildChangeImpactGraph } from "@/lib/evidence-graph";

interface EvidenceChainProps {
  finding?: ComplianceFinding | null;
  rippleResult?: RippleEffectResult | null;
  blueprint?: Blueprint;
  onClose?: () => void;
}

export default function EvidenceChain({
  finding,
  rippleResult,
  blueprint,
  onClose,
}: EvidenceChainProps) {
  const [activeTab, setActiveTab] = useState<"evidence" | "impact">(
    rippleResult ? "impact" : "evidence"
  );

  const evidenceGraph = finding ? buildEvidenceGraph(finding, blueprint) : null;
  const impactGraph = rippleResult ? buildChangeImpactGraph(rippleResult, blueprint) : null;

  const currentGraph: GraphData | null =
    activeTab === "evidence"
      ? evidenceGraph || impactGraph
      : impactGraph || evidenceGraph;

  const getNodeColor = (node: EvidenceGraphNode) => {
    switch (node.severity) {
      case "blocking":
        return {
          bg: "bg-rose-50 border-rose-400 text-rose-900",
          pill: "bg-rose-100 text-rose-800 border-rose-300",
          icon: "🔴",
        };
      case "advisory":
        return {
          bg: "bg-amber-50 border-amber-400 text-amber-900",
          pill: "bg-amber-100 text-amber-800 border-amber-300",
          icon: "🟡",
        };
      case "resolved":
        return {
          bg: "bg-emerald-50 border-emerald-400 text-emerald-900",
          pill: "bg-emerald-100 text-emerald-800 border-emerald-300",
          icon: "🟢",
        };
      case "surfaced":
        return {
          bg: "bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-300/50",
          pill: "bg-rose-200 text-rose-900 border-rose-400 font-bold",
          icon: "⚡",
        };
      default:
        if (node.type === "blueprintElement") {
          return {
            bg: "bg-sky-50 border-sky-400 text-sky-950",
            pill: "bg-sky-100 text-sky-800 border-sky-300",
            icon: "📐",
          };
        }
        if (node.type === "regulationClause") {
          return {
            bg: "bg-indigo-50 border-indigo-400 text-indigo-950",
            pill: "bg-indigo-100 text-indigo-800 border-indigo-300",
            icon: "📜",
          };
        }
        if (node.type === "historicalPattern") {
          return {
            bg: "bg-purple-50 border-purple-400 text-purple-950",
            pill: "bg-purple-100 text-purple-800 border-purple-300",
            icon: "🧠",
          };
        }
        return {
          bg: "bg-slate-50 border-slate-300 text-slate-900",
          pill: "bg-slate-200 text-slate-700 border-slate-300",
          icon: "⚙️",
        };
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden my-4 transition-all">
      {/* Header bar */}
      <div className="bg-slate-900 text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="text-lg">🕸️</span>
          <div>
            <h3 className="font-bold text-sm md:text-base tracking-tight">
              Graph Analysis Engine — Causal Verification
            </h3>
            <p className="text-[11px] text-slate-300">
              {currentGraph?.description || "Directed graph connecting facts to regulations"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="inline-flex rounded-lg bg-slate-800 p-1 border border-slate-700 text-xs">
            <button
              onClick={() => setActiveTab("evidence")}
              disabled={!evidenceGraph}
              className={`px-3 py-1 rounded font-medium transition-all cursor-pointer ${
                activeTab === "evidence"
                  ? "bg-blue-600 text-white shadow-sm font-semibold"
                  : "text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
              }`}
            >
              Evidence Graph
            </button>
            <button
              onClick={() => setActiveTab("impact")}
              disabled={!impactGraph}
              className={`px-3 py-1 rounded font-medium transition-all cursor-pointer ${
                activeTab === "impact"
                  ? "bg-blue-600 text-white shadow-sm font-semibold"
                  : "text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
              }`}
            >
              Change Impact Graph
            </button>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close graph view"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Graph Visualizer Content */}
      <div className="p-5 bg-slate-50/60">
        {!currentGraph || currentGraph.nodes.length === 0 ? (
          <div className="text-center py-8 text-sm text-slate-500">
            No graph data available for current selection.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-200">
              <span className="font-semibold text-slate-700">{currentGraph.title}</span>
              <span className="font-mono text-[11px]">
                {currentGraph.nodes.length} Nodes • {currentGraph.edges.length} Directed Relationships
              </span>
            </div>

            {/* Directed Chain Layout */}
            <div className="relative flex flex-col gap-3 max-w-2xl mx-auto py-2">
              {currentGraph.nodes.map((node, index) => {
                const color = getNodeColor(node);
                const isLast = index === currentGraph.nodes.length - 1;
                const edgeOut = currentGraph.edges.find((e) => e.from === node.id);

                return (
                  <div key={node.id} className="relative flex flex-col items-center">
                    {/* Node Card */}
                    <div
                      className={`w-full max-w-xl p-3.5 rounded-lg border shadow-xs transition-all ${color.bg}`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{color.icon}</span>
                          <span className="font-bold text-xs uppercase tracking-wide">
                            {node.label}
                          </span>
                        </div>
                        {node.badge && (
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${color.pill}`}
                          >
                            {node.badge}
                          </span>
                        )}
                      </div>

                      {node.subtitle && (
                        <p className="text-xs text-slate-600 pl-6 mt-0.5">
                          {node.subtitle}
                        </p>
                      )}
                    </div>

                    {/* Edge Connector */}
                    {!isLast && (
                      <div className="flex flex-col items-center my-1.5">
                        <div className="h-4 w-0.5 bg-slate-300" />
                        <div className="bg-white px-2 py-0.5 rounded-full border border-slate-300 text-[10px] text-slate-600 font-mono shadow-xs -my-1 z-10">
                          ↓ {edgeOut?.relation || "connects to"}
                        </div>
                        <div className="h-4 w-0.5 bg-slate-300" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Graph Footer / Legend */}
      <div className="bg-slate-100 px-5 py-2.5 border-t border-slate-200 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">📐 Blueprint Element</span>
          <span className="flex items-center gap-1">📜 Regulation Clause</span>
          <span className="flex items-center gap-1">🧠 Observed Pattern</span>
        </div>
        <span className="font-medium text-slate-600">
          Source: Deterministic Regulatory Dependency Graph
        </span>
      </div>
    </div>
  );
}
