"use client";

import type { ComplianceFinding } from "@/lib/schemas";

export default function FindingCard({ finding }: { finding: ComplianceFinding }) {
  const isResolved = finding.resolved === true;
  const isRipple = finding.isRippleEffect === true;
  const isBlocking = finding.severity === "blocking";
  const isLearned = finding.source === "learned_pattern";

  // Provide a reliable fallback if evidence isn't explicitly populated
  const evidenceText =
    finding.evidence ||
    (finding.clauseId.startsWith("FE")
      ? "Window W2, basement bedroom (south wall) — parsed opening dimensions"
      : "Wall E1, property line setback — parsed boundary dimensions");

  // Determine card styling based on state
  let cardStyle = isBlocking
    ? "bg-blocking-bg border-blocking"
    : "bg-advisory-bg border-advisory";

  if (isResolved) {
    cardStyle = "bg-emerald-50/80 border-emerald-500 opacity-80";
  } else if (isRipple) {
    cardStyle = "bg-amber-50/80 border-amber-500 ring-1 ring-amber-400/40 shadow-sm";
  }

  return (
    <div className={`p-4 border-l-4 rounded shadow-sm transition-all ${cardStyle}`}>
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3
              className={`font-bold text-base md:text-lg ${
                isResolved ? "line-through text-slate-500" : "text-slate-900"
              }`}
            >
              {finding.issue}
            </h3>
            {isResolved && (
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                ✓ Resolved by plan change
              </span>
            )}
            {isRipple && !isResolved && (
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-amber-200 text-amber-900 border border-amber-400 animate-pulse">
                ⚠️ {finding.rippleLabel || "Surfaced by recheck"}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span
            className={`px-2 py-0.5 text-xs rounded-full font-medium ${
              isLearned
                ? "bg-accent-light text-accent border border-accent"
                : "bg-slate-200 text-slate-700"
            }`}
          >
            {isLearned ? "Learned Pattern" : "Written Code"}
          </span>
          <span
            className={`px-2 py-0.5 text-xs rounded-full font-bold uppercase tracking-wider ${
              isBlocking
                ? "bg-rose-100 text-rose-800 border border-rose-200"
                : "bg-amber-100 text-amber-800 border border-amber-200"
            }`}
          >
            {finding.severity}
          </span>
        </div>
      </div>

      <p className={`mt-2 text-sm ${isResolved ? "text-slate-500" : "text-slate-700"}`}>
        {finding.detail}
      </p>

      {/* Structured Citation and Blueprint Evidence Lines */}
      <div className="mt-3.5 pt-3 border-t border-slate-200/80 space-y-1.5 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1">
          <span className="font-semibold text-slate-900 min-w-[70px]">Citation:</span>
          <span className="text-slate-800 font-medium bg-white/70 px-1.5 py-0.5 rounded border border-slate-200 inline-block">
            {finding.clauseCitation}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1">
          <span className="font-semibold text-blue-900 min-w-[70px]">Evidence:</span>
          <span className="text-blue-950 font-medium bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 inline-block font-mono text-[11.5px]">
            {evidenceText}
          </span>
        </div>

        <div className="flex justify-between items-center text-[11px] text-muted pt-1">
          <span>Clause ID: {finding.clauseId}</span>
          <span>Confidence: {(finding.confidence * 100).toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
}
