"use client";

interface ApprovalReadinessGaugeProps {
  score: number;
  blockingCount: number;
  advisoryCount: number;
  previousScore?: number | null;
  statusNote?: string | null;
}

export function calculateReadinessScore(blockingCount: number, advisoryCount: number): number {
  return Math.max(0, 100 - blockingCount * 20 - advisoryCount * 5);
}

export default function ApprovalReadinessGauge({
  score,
  blockingCount,
  advisoryCount,
  previousScore,
  statusNote,
}: ApprovalReadinessGaugeProps) {
  // Determine color scheme based on score
  let scoreColor = "text-rose-600 dark:text-rose-400";
  let barColor = "bg-rose-500";
  let badgeBg = "bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300";
  let readinessTier = "Low Readiness (Major Blocking Deficits)";

  if (score >= 80) {
    scoreColor = "text-emerald-600 dark:text-emerald-400";
    barColor = "bg-emerald-500";
    badgeBg = "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300";
    readinessTier = "High Readiness (Review Ready)";
  } else if (score >= 50) {
    scoreColor = "text-amber-600 dark:text-amber-400";
    barColor = "bg-amber-500";
    badgeBg = "bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300";
    readinessTier = "Moderate Readiness (Advisory / Conditional Items)";
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Approval Readiness Score
            </h3>
            <span
              className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${badgeBg}`}
            >
              {readinessTier}
            </span>
          </div>

          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
            Indicates how prepared this submission is for review — not an approval decision. Final
            determination is made by a municipal plan reviewer.
          </p>
        </div>

        <div className="flex items-baseline gap-2 sm:text-right">
          {previousScore !== undefined && previousScore !== null && previousScore !== score && (
            <span className="text-sm font-semibold text-slate-400 dark:text-slate-600 line-through">
              {previousScore}
            </span>
          )}
          <span className={`text-4xl font-extrabold font-mono ${scoreColor}`}>{score}</span>
          <span className="text-slate-400 dark:text-slate-500 text-sm font-bold">/ 100</span>
          {previousScore !== undefined && previousScore !== null && previousScore !== score && (
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded ${
                score > previousScore
                  ? "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                  : "bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800"
              }`}
            >
              {score > previousScore ? `+${score - previousScore}` : `${score - previousScore}`} pts
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar Meter */}
      <div className="mt-3.5 w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} transition-all duration-500 ease-out`}
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Score Deduction Breakdown */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
            <strong className="text-slate-800 dark:text-slate-200">{blockingCount}</strong> blocking (
            {blockingCount * 20 > 0 ? `-${blockingCount * 20}` : "0"} pts)
          </span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
            <strong className="text-slate-800 dark:text-slate-200">{advisoryCount}</strong> advisory (
            {advisoryCount * 5 > 0 ? `-${advisoryCount * 5}` : "0"} pts)
          </span>
        </div>

        <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
          Formula: 100 - (blocking × 20) - (advisory × 5)
        </span>
      </div>

      {/* Dynamic Simulation / Status Note */}
      {statusNote && (
        <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
          <span className="text-blue-600 dark:text-blue-400 font-semibold">⚡ Impact Note:</span>
          <span>{statusNote}</span>
        </div>
      )}
    </div>
  );
}
