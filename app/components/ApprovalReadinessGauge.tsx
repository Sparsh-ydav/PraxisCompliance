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
  let scoreColor = "text-rose-600";
  let barColor = "bg-rose-500";
  let badgeBg = "bg-rose-50 border-rose-200 text-rose-800";
  let readinessTier = "Low Readiness (Major Blocking Deficits)";

  if (score >= 80) {
    scoreColor = "text-emerald-600";
    barColor = "bg-emerald-500";
    badgeBg = "bg-emerald-50 border-emerald-200 text-emerald-800";
    readinessTier = "High Readiness (Review Ready)";
  } else if (score >= 50) {
    scoreColor = "text-amber-600";
    barColor = "bg-amber-500";
    badgeBg = "bg-amber-50 border-amber-200 text-amber-800";
    readinessTier = "Moderate Readiness (Advisory / Conditional Items)";
  }

  return (
    <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Approval Readiness Score
            </h3>
            <span
              className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${badgeBg}`}
            >
              {readinessTier}
            </span>
          </div>

          <p className="mt-1 text-xs text-slate-500 max-w-xl leading-relaxed">
            Indicates how prepared this submission is for review — not an approval decision. Final
            determination is made by a human reviewer.
          </p>
        </div>

        <div className="flex items-baseline gap-2 sm:text-right">
          {previousScore !== undefined && previousScore !== null && previousScore !== score && (
            <span className="text-sm font-semibold text-slate-400 line-through">
              {previousScore}
            </span>
          )}
          <span className={`text-4xl font-extrabold ${scoreColor}`}>{score}</span>
          <span className="text-slate-400 text-sm font-bold">/ 100</span>
          {previousScore !== undefined && previousScore !== null && previousScore !== score && (
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded ${
                score > previousScore
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-rose-100 text-rose-800"
              }`}
            >
              {score > previousScore ? `+${score - previousScore}` : `${score - previousScore}`} pts
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar Meter */}
      <div className="mt-3.5 w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} transition-all duration-500 ease-out`}
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Score Deduction Breakdown */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
            <strong className="text-slate-800">{blockingCount}</strong> blocking (
            {blockingCount * 20 > 0 ? `-${blockingCount * 20}` : "0"} pts)
          </span>
          <span className="text-slate-300">•</span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
            <strong className="text-slate-800">{advisoryCount}</strong> advisory (
            {advisoryCount * 5 > 0 ? `-${advisoryCount * 5}` : "0"} pts)
          </span>
        </div>

        {statusNote && (
          <span className="text-slate-600 font-medium italic bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
            {statusNote}
          </span>
        )}
      </div>
    </div>
  );
}
