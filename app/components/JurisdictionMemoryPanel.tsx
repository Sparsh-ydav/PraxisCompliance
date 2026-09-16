"use client";

import React, { useState } from "react";
import { LEARNED_PATTERNS } from "@/fixtures/learned-patterns";
import { REGULATIONS } from "@/fixtures/regulations";

export default function JurisdictionMemoryPanel() {
  const [selectedPatternId, setSelectedPatternId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>("all");

  const filteredPatterns = LEARNED_PATTERNS.filter((p) => {
    if (filterType === "all") return true;
    return p.patternType === filterType;
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 my-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🏛️</span>
            <h3 className="font-bold text-slate-900 text-base">
              Jurisdiction Memory — Maplewood Township
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-200">
              {LEARNED_PATTERNS.length} Empirical Patterns
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Empirical enforcement patterns extracted from historical correction letters and reviewer actions.
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={() => setFilterType("all")}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
              filterType === "all"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All ({LEARNED_PATTERNS.length})
          </button>
          <button
            onClick={() => setFilterType("stricter_than_code")}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
              filterType === "stricter_than_code"
                ? "bg-rose-600 text-white"
                : "bg-rose-50 text-rose-700 hover:bg-rose-100"
            }`}
          >
            Strict Enforcements
          </button>
          <button
            onClick={() => setFilterType("lenient_than_code")}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
              filterType === "lenient_than_code"
                ? "bg-emerald-600 text-white"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            }`}
          >
            Administrative Waivers
          </button>
        </div>
      </div>

      {/* Critical Legal Distinction Banner */}
      <div className="my-3.5 p-3 rounded-lg bg-purple-50/80 border border-purple-200 flex items-start gap-2.5 text-xs text-purple-900">
        <span className="text-base flex-shrink-0">ℹ️</span>
        <div>
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
              className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                isSelected
                  ? "bg-purple-50/50 border-purple-500 ring-2 ring-purple-200 shadow-sm"
                  : "bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className="font-bold text-xs text-slate-900">
                  {p.title}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex-shrink-0 ${
                    isStricter
                      ? "bg-rose-100 text-rose-800 border border-rose-200"
                      : isLenient
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {isStricter
                    ? "Strict Enforcement"
                    : isLenient
                    ? "Routine Waiver"
                    : "Standard Alignment"}
                </span>
              </div>

              <p className="text-xs text-slate-600 mb-2 leading-relaxed">
                {p.description}
              </p>

              <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-1.5">
                <span className="font-medium text-slate-700">
                  Ref: {p.codeReference}
                </span>
                <div className="flex items-center gap-2">
                  <span className="bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono text-[10px]">
                    {p.evidenceCount} historical cases
                  </span>
                  <span className="font-semibold text-purple-700">
                    {(p.confidenceLevel * 100).toFixed(0)}% confidence
                  </span>
                </div>
              </div>

              {isSelected && (
                <div className="mt-3 pt-2.5 border-t border-purple-200 text-xs bg-white p-2.5 rounded border border-purple-100 space-y-1.5">
                  <div className="font-semibold text-purple-950">Reviewer Behavior In Practice:</div>
                  <p className="text-slate-700 italic">"{p.enforcementBehavior}"</p>
                  <div className="text-[11px] text-slate-500 pt-1">
                    Citing Historical Permits:{" "}
                    <span className="font-mono text-purple-900 font-medium">
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
