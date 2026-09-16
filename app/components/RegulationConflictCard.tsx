"use client";

import React, { useState } from "react";
import type { RegulationConflict } from "@/lib/conflict-detector";

export default function RegulationConflictCard({ conflict }: { conflict: RegulationConflict }) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <div className="p-4 rounded-xl border-2 border-purple-400 dark:border-purple-600 bg-gradient-to-r from-purple-50/90 to-indigo-50/70 dark:from-purple-950/40 dark:to-indigo-950/30 shadow-sm transition-all my-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">⚖️</span>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-bold text-sm md:text-base text-purple-950 dark:text-purple-200">
                {conflict.title}
              </h4>
              <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider bg-purple-200 dark:bg-purple-900/80 text-purple-900 dark:text-purple-200 border border-purple-300 dark:border-purple-700 animate-pulse font-mono">
                Regulation Conflict — Flagged for Human Review
              </span>
            </div>
            <p className="text-xs text-purple-900/80 dark:text-purple-300/80 mt-1 leading-relaxed">
              Statutory contradiction between <strong className="font-semibold font-mono">{conflict.clauseA.id}</strong> ({conflict.clauseA.section}) and <strong className="font-semibold font-mono">{conflict.clauseB.id}</strong> ({conflict.clauseB.section}). Applicant is not at fault.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-semibold text-purple-700 dark:text-purple-300 hover:text-purple-900 dark:hover:text-purple-100 bg-purple-100 dark:bg-purple-900/60 hover:bg-purple-200 dark:hover:bg-purple-800 px-3 py-1.5 rounded-lg border border-purple-300 dark:border-purple-700 transition-colors flex-shrink-0 cursor-pointer"
        >
          {isExpanded ? "Hide Details ▲" : "View Contradiction ▼"}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-3.5 border-t border-purple-200/80 dark:border-purple-800 space-y-3 text-xs">
          {/* Conflicting clauses comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-purple-200 dark:border-purple-900 shadow-xs">
              <div className="font-bold text-slate-900 dark:text-slate-100 text-[11px] mb-1 flex items-center gap-1.5 font-mono">
                <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
                {conflict.clauseA.id} — {conflict.clauseA.section}
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{conflict.clauseA.requirement}</p>
            </div>

            <div className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-purple-200 dark:border-purple-900 shadow-xs">
              <div className="font-bold text-slate-900 dark:text-slate-100 text-[11px] mb-1 flex items-center gap-1.5 font-mono">
                <span className="w-2 h-2 rounded-full bg-rose-600 inline-block" />
                {conflict.clauseB.id} — {conflict.clauseB.section}
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{conflict.clauseB.requirement}</p>
            </div>
          </div>

          <div className="p-3 bg-purple-100/60 dark:bg-purple-950/60 rounded-lg border border-purple-200 dark:border-purple-900 text-purple-950 dark:text-purple-200">
            <div className="font-bold mb-1">Causal Impact Analysis:</div>
            <p className="leading-relaxed">{conflict.conflictDescription}</p>
          </div>

          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 rounded-lg border border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200 flex items-start gap-2">
            <span className="text-base">🛡️</span>
            <div>
              <div className="font-bold text-emerald-900 dark:text-emerald-300">Recommended Administrative Action:</div>
              <p className="mt-0.5 leading-relaxed">{conflict.recommendedResolution}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
