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
          bg: "bg-rose-50 dark:bg-rose-950/40 border-rose-400 dark:border-rose-800 text-rose-900 dark:text-rose-200",
          pill: "bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-700",
          icon: "🔴",
        };
      case "advisory":
        return {
          bg: "bg-amber-50 dark:bg-amber-950/40 border-amber-400 dark:border-amber-800 text-amber-900 dark:text-amber-200",
          pill: "bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700",
          icon: "🟡",
        };
      case "resolved":
        return {
          bg: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200",
          pill: "bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700",
          icon: "🟢",
        };
      case "surfaced":
        return {
          bg: "bg-rose-50 dark:bg-rose-950/50 border-rose-500 dark:border-rose-700 text-rose-900 dark:text-rose-200 ring-2 ring-rose-300/50 dark:ring-rose-900/40",
          pill: "bg-rose-200 dark:bg-rose-900 text-rose-900 dark:text-rose-100 border-rose-400 dark:border-rose-600 font-bold",
          icon: "⚡",
        };
      default:
        if (node.type === "blueprintElement") {
          return {
            bg: "bg-sky-50 dark:bg-sky-950/40 border-sky-400 dark:border-sky-800 text-sky-950 dark:text-sky-200",
            pill: "bg-sky-100 dark:bg-sky-900/60 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-700",
            icon: "📐",
          };
        }
        if (node.type === "regulationClause") {
          return {
            bg: "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-400 dark:border-indigo-800 text-indigo-950 dark:text-indigo-200",
            pill: "bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700",
            icon: "📜",
          };
        }
        if (node.type === "historicalPattern") {
          return {
            bg: "bg-purple-50 dark:bg-purple-950/40 border-purple-400 dark:border-purple-800 text-purple-950 dark:text-purple-200",
            pill: "bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-700",
            icon: "🧠",
          };
        }
        return {
          bg: "bg-slate-50 dark:bg-slate-800/60 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100",
          pill: "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600",
          icon: "⚙️",
        };
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden my-4 transition-all">
      {/* Header bar */}
      <div className="bg-slate-900 dark:bg-slate-950 text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <span className="text-lg">🕸️</span>
          <div>
            <h3 className="font-bold text-sm md:text-base tracking-tight">
              Graph Analysis Engine — Causal Verification
            </h3>
            <p className="text-[11px] text-slate-300 dark:text-slate-400">
              {currentGraph?.description || "Directed graph connecting facts to regulations"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="inline-flex rounded-lg bg-slate-800 dark:bg-slate-900 p-1 border border-slate-700 dark:border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab("evidence")}
              disabled={!evidenceGraph}
              className={`px-3 py-1 rounded-md font-medium transition-all cursor-pointer ${
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
              className={`px-3 py-1 rounded-md font-medium transition-all cursor-pointer ${
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
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
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
      <div className="p-5 bg-slate-50/60 dark:bg-slate-950/60">
        {!currentGraph || currentGraph.nodes.length === 0 ? (
          <div className="text-center py-8 text-sm text-slate-500 dark:text-slate-400">
            No graph data available for current selection.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pb-2 border-b border-slate-200 dark:border-slate-800">
              <span className="font-semibold text-slate-700 dark:text-slate-200">{currentGraph.title}</span>
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
                      className={`w-full max-w-xl p-3.5 rounded-xl border shadow-xs transition-all ${color.bg}`}
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
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border font-mono ${color.pill}`}
                          >
                            {node.badge}
                          </span>
                        )}
                      </div>

                      {node.subtitle && (
                        <p className="text-xs text-slate-600 dark:text-slate-300 pl-6 mt-0.5 leading-relaxed">
                          {node.subtitle}
                        </p>
                      )}
                    </div>

                    {/* Edge Connector */}
                    {!isLast && (
                      <div className="flex flex-col items-center my-1.5">
                        <div className="h-4 w-0.5 bg-slate-300 dark:bg-slate-700" />
                        <div className="bg-white dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-300 dark:border-slate-700 text-[10px] text-slate-600 dark:text-slate-300 font-mono shadow-xs -my-1 z-10">
                          ↓ {edgeOut?.relation || "connects to"}
                        </div>
                        <div className="h-4 w-0.5 bg-slate-300 dark:bg-slate-700" />
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
      <div className="bg-slate-100 dark:bg-slate-900 px-5 py-2.5 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">📐 Blueprint Element</span>
          <span className="flex items-center gap-1">📜 Regulation Clause</span>
          <span className="flex items-center gap-1">🧠 Observed Pattern</span>
        </div>
        <span className="font-medium text-slate-600 dark:text-slate-300 font-mono">
          Source: Deterministic Regulatory Dependency Graph
        </span>
      </div>
    </div>
  );
}
