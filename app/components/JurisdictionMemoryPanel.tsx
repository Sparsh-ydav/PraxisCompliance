"use client";

import React, { useState } from "react";
import { LEARNED_PATTERNS } from "@/fixtures/learned-patterns";

export default function JurisdictionMemoryPanel() {
  const [selectedPatternId, setSelectedPatternId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>("all");

  const filteredPatterns = LEARNED_PATTERNS.filter((p) => {
    if (filterType === "all") return true;
    return p.patternType === filterType;
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 my-6 transition-colors">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🏛️</span>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
              Jurisdiction Memory — Maplewood Township
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-950 text-purple-900 dark:text-purple-300 border border-purple-200 dark:border-purple-800 font-mono">
              {LEARNED_PATTERNS.length} Empirical Patterns
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Empirical enforcement patterns extracted from historical correction letters and reviewer actions.
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={() => setFilterType("all")}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              filterType === "all"
                ? "bg-slate-900 text-white dark:bg-blue-600 dark:text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            All ({LEARNED_PATTERNS.length})
          </button>
          <button
            onClick={() => setFilterType("stricter_than_code")}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              filterType === "stricter_than_code"
                ? "bg-rose-600 text-white"
                : "bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-900"
            }`}
          >
            Strict Enforcements
          </button>
          <button
            onClick={() => setFilterType("lenient_than_code")}
            className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
              filterType === "lenient_than_code"
                ? "bg-emerald-600 text-white"
                : "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-900"
            }`}
          >
            Administrative Waivers
          </button>
        </div>
      </div>

      {/* Critical Legal Distinction Banner */}
      <div className="my-3.5 p-3.5 rounded-lg bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900 flex items-start gap-2.5 text-xs text-purple-900 dark:text-purple-300">
        <span className="text-base flex-shrink-0">ℹ️</span>
        <div className="leading-relaxed">
          <span className="font-bold">Formal Separation of Sourcing:</span> These insights reflect
          <strong className="underline decoration-purple-400 decoration-2 ml-1">observed historical reviewer behavior</strong>, not statutory codified law. They are derived from analyzed historical permit files to predict reviewer interpretation, and are explicitly distinct from the statutory regulation retriever output.
        </div>
      </div>

      {/* Pattern Grid / List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
        {filteredPatterns.map((p) => {
          const isSelected = p.id === selectedPatternId;
          const isStricter = p.patternType === "stricter_than_code";
          const isLenient = p.patternType === "lenient_than_code";

          return (
            <div
              key={p.id}
              onClick={() => setSelectedPatternId(isSelected ? null : p.id)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? "bg-purple-50/60 dark:bg-purple-950/50 border-purple-500 ring-2 ring-purple-200 dark:ring-purple-900 shadow-sm"
                  : "bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-white dark:hover:bg-slate-800"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                  {p.title}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex-shrink-0 font-mono ${
                    isStricter
                      ? "bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900"
                      : isLenient
                      ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700"
                  }`}
                >
                  {isStricter
                    ? "Strict Enforcement"
                    : isLenient
                    ? "Routine Waiver"
                    : "Standard Alignment"}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 mb-2 leading-relaxed">
                {p.description}
              </p>

              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 gap-1.5">
                <span className="font-medium text-slate-700 dark:text-slate-300 font-mono">
                  Ref: {p.codeReference}
                </span>
                <div className="flex items-center gap-2">
                  <span className="bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 font-mono text-[10px]">
                    {p.evidenceCount} historical cases
                  </span>
                  <span className="font-semibold text-purple-700 dark:text-purple-400 font-mono">
                    {(p.confidenceLevel * 100).toFixed(0)}% confidence
                  </span>
                </div>
              </div>

              {isSelected && (
                <div className="mt-3 pt-2.5 border-t border-purple-200 dark:border-purple-900 text-xs bg-white dark:bg-slate-900 p-3 rounded-lg border border-purple-100 dark:border-purple-900 space-y-1.5">
                  <div className="font-semibold text-purple-950 dark:text-purple-300">Reviewer Behavior In Practice:</div>
                  <p className="text-slate-700 dark:text-slate-300 italic">"{p.enforcementBehavior}"</p>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                    Citing Historical Permits:{" "}
                    <span className="font-mono text-purple-900 dark:text-purple-300 font-medium">
                      {p.sourceCases.join(", ")}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
