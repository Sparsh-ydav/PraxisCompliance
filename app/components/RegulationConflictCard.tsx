"use client";

import React, { useState } from "react";
import type { RegulationConflict } from "@/lib/conflict-detector";

export default function RegulationConflictCard({ conflict }: { conflict: RegulationConflict }) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <div className="p-4 rounded-xl border-2 border-purple-400 bg-gradient-to-r from-purple-50/90 to-indigo-50/70 shadow-sm transition-all my-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">⚖️</span>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-bold text-sm md:text-base text-purple-950">
                {conflict.title}
              </h4>
              <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider bg-purple-200 text-purple-900 border border-purple-300 animate-pulse">
                Regulation Conflict — Flagged for Human Review
              </span>
            </div>
            <p className="text-xs text-purple-900/80 mt-1">
              Statutory contradiction between <strong className="font-semibold">{conflict.clauseA.id}</strong> ({conflict.clauseA.section}) and <strong className="font-semibold">{conflict.clauseB.id}</strong> ({conflict.clauseB.section}). Applicant is not at fault.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-semibold text-purple-700 hover:text-purple-900 bg-purple-100 hover:bg-purple-200 px-3 py-1.5 rounded-md border border-purple-300 transition-colors flex-shrink-0 cursor-pointer"
        >
          {isExpanded ? "Hide Details ▲" : "View Contradiction ▼"}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-3.5 border-t border-purple-200/80 space-y-3 text-xs">
          {/* Conflicting clauses comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-white rounded-lg border border-purple-200 shadow-xs">
              <div className="font-bold text-slate-900 text-[11px] mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
                {conflict.clauseA.id} — {conflict.clauseA.section}
              </div>
              <p className="text-slate-700 leading-relaxed">{conflict.clauseA.requirement}</p>
            </div>

            <div className="p-3 bg-white rounded-lg border border-purple-200 shadow-xs">
              <div className="font-bold text-slate-900 text-[11px] mb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-600 inline-block" />
                {conflict.clauseB.id} — {conflict.clauseB.section}
              </div>
              <p className="text-slate-700 leading-relaxed">{conflict.clauseB.requirement}</p>
            </div>
          </div>

          <div className="p-3 bg-purple-100/60 rounded-lg border border-purple-200 text-purple-950">
            <div className="font-bold mb-1">Causal Impact Analysis:</div>
            <p className="leading-relaxed">{conflict.conflictDescription}</p>
          </div>

          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-300 text-emerald-950 flex items-start gap-2">
            <span className="text-base">🛡️</span>
            <div>
              <div className="font-bold text-emerald-900">Recommended Administrative Action:</div>
              <p className="mt-0.5 leading-relaxed">{conflict.recommendedResolution}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
