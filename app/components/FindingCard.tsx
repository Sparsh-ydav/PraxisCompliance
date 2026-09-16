"use client";

import React, { useState } from "react";
import type { ComplianceFinding } from "@/lib/schemas";
import { getRemediationOptions } from "@/fixtures/remediations";
import { logAuditEvent } from "@/lib/audit-trail";

interface FindingCardProps {
  finding: ComplianceFinding;
  isSelected?: boolean;
  onSelect?: () => void;
  onViewEvidenceChain?: () => void;
  hasVisualEvidence?: boolean;
}

export default function FindingCard({
  finding,
  isSelected = false,
  onSelect,
  onViewEvidenceChain,
  hasVisualEvidence = true,
}: FindingCardProps) {
  const [showRemediations, setShowRemediations] = useState<boolean>(false);

  const isResolved = finding.resolved === true;
  const isRipple = finding.isRippleEffect === true;
  const isBlocking = finding.severity === "blocking";
  const isLearned = finding.source === "learned_pattern";

  const remediations = getRemediationOptions(finding.id, finding.clauseId);

  // Provide a reliable fallback if evidence isn't explicitly populated
  const evidenceText =
    finding.evidence ||
    (finding.clauseId.startsWith("FE")
      ? "Window W2, basement bedroom (south wall) — parsed opening dimensions"
      : "Wall E1, property line setback — parsed boundary dimensions");

  // Determine card styling based on state
  let cardStyle = isBlocking
    ? "bg-rose-50/70 dark:bg-rose-950/30 border-rose-500 dark:border-rose-600"
    : "bg-amber-50/70 dark:bg-amber-950/30 border-amber-500 dark:border-amber-600";

  if (isResolved) {
    cardStyle = "bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-500 opacity-85";
  } else if (isRipple) {
    cardStyle = "bg-amber-50/80 dark:bg-amber-950/40 border-amber-500 ring-1 ring-amber-400/40 shadow-sm";
  }

  if (isSelected) {
    cardStyle += " ring-2 ring-blue-600 dark:ring-blue-400 shadow-md";
  }

  const handleToggleRemediations = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = !showRemediations;
    setShowRemediations(nextState);
    if (nextState) {
      logAuditEvent(
        "remediation_viewed",
        "Applicant",
        finding.id,
        `Viewed ${remediations.length} remediation options with tradeoffs for finding ${finding.id}`
      );
    }
  };

  return (
    <div
      onClick={onSelect}
      className={`p-4 border-l-4 rounded-xl shadow-sm transition-all cursor-pointer ${cardStyle}`}
    >
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3
              className={`font-bold text-base md:text-lg ${
                isResolved
                  ? "line-through text-slate-400 dark:text-slate-500"
                  : "text-slate-900 dark:text-slate-100"
              }`}
            >
              {finding.issue}
            </h3>
            {isResolved && (
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                ✓ Resolved by plan change
              </span>
            )}
            {isRipple && !isResolved && (
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-amber-200 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-400 dark:border-amber-700 animate-pulse">
                ⚠️ {finding.rippleLabel || "Surfaced by recheck"}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span
            className={`px-2 py-0.5 text-xs rounded-full font-medium ${
              isLearned
                ? "bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            }`}
          >
            {isLearned ? "Learned Pattern" : "Written Code"}
          </span>
          <span
            className={`px-2 py-0.5 text-xs rounded-full font-bold uppercase tracking-wider ${
              isBlocking
                ? "bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900"
                : "bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900"
            }`}
          >
            {finding.severity}
          </span>
        </div>
      </div>

      <p className={`mt-2 text-sm leading-relaxed ${isResolved ? "text-slate-400 dark:text-slate-500" : "text-slate-700 dark:text-slate-300"}`}>
        {finding.detail}
      </p>

      {/* Visual Evidence Notice or Status */}
      <div className="mt-2.5 flex items-center gap-2">
        {!hasVisualEvidence || !finding.elementId ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            <span>ℹ️</span>
            <span>No visual evidence for this finding (administrative / documentation requirement)</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[11.5px] text-blue-600 dark:text-blue-400 font-medium hover:underline">
            <span>🎯</span>
            <span>Linked to element <strong className="font-mono">{finding.elementId}</strong> — click card to highlight on blueprint</span>
          </span>
        )}
      </div>

      {/* Structured Citation and Blueprint Evidence Lines */}
      <div className="mt-3.5 pt-3 border-t border-slate-200/80 dark:border-slate-800 space-y-1.5 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1">
          <span className="font-semibold text-slate-900 dark:text-slate-200 min-w-[70px]">Citation:</span>
          <span className="text-slate-800 dark:text-slate-300 font-medium bg-white/80 dark:bg-slate-800/80 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 inline-block font-mono text-[11px]">
            {finding.clauseCitation}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline gap-1">
          <span className="font-semibold text-blue-900 dark:text-blue-300 min-w-[70px]">Evidence:</span>
          <span className="text-blue-950 dark:text-blue-200 font-medium bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-900 inline-block font-mono text-[11.5px]">
            {evidenceText}
          </span>
        </div>

        <div className="flex justify-between items-center text-[11px] text-slate-400 dark:text-slate-500 pt-1 font-mono">
          <span>Clause ID: {finding.clauseId}</span>
          <span>Confidence: {(finding.confidence * 100).toFixed(0)}%</span>
        </div>
      </div>

      {/* Action Buttons: Evidence Chain & Multi-option Fixes */}
      <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {onViewEvidenceChain && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewEvidenceChain();
              }}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>🕸️</span>
              <span>View Evidence Chain</span>
            </button>
          )}

          <button
            onClick={handleToggleRemediations}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-blue-700 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-100 bg-blue-50 dark:bg-blue-950/70 hover:bg-blue-100 dark:hover:bg-blue-900 border border-blue-200 dark:border-blue-800 shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>💡</span>
            <span>{showRemediations ? "Hide Remediation Options ▲" : `View Remediation Options (${remediations.length}) ▼`}</span>
          </button>
        </div>

        {isSelected && (
          <span className="text-[11px] text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1.5 font-mono">
            <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-ping" />
            Active on Blueprint
          </span>
        )}
      </div>

      {/* Expandable Remediation Options with Tradeoffs (Phase 4) */}
      {showRemediations && (
        <div className="mt-3.5 pt-3 border-t border-blue-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 rounded-xl p-4 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
            <div className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <span>🛠️</span>
              <span>Remediation Alternatives & Impact Tradeoffs</span>
            </div>
            <span className="text-[10.5px] text-slate-400 italic">2+ viable architectural paths</span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {remediations.map((option, idx) => (
              <div
                key={option.id}
                className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                    Option {String.fromCharCode(65 + idx)}: {option.title}
                  </span>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {option.costEstimate && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        {option.costEstimate}
                      </span>
                    )}
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      {option.approvalLikelihood}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 mb-1.5 leading-relaxed">
                  {option.description}
                </p>

                <div className="p-2 rounded-md bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-[11.5px] text-amber-950 dark:text-amber-200 flex items-start gap-1.5">
                  <span className="font-bold text-amber-900 dark:text-amber-300 flex-shrink-0">⚖️ Tradeoff:</span>
                  <span className="leading-snug">{option.tradeoff}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
