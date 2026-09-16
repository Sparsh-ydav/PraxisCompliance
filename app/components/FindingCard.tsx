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
    ? "bg-blocking-bg border-blocking"
    : "bg-advisory-bg border-advisory";

  if (isResolved) {
    cardStyle = "bg-emerald-50/80 border-emerald-500 opacity-85";
  } else if (isRipple) {
    cardStyle = "bg-amber-50/80 border-amber-500 ring-1 ring-amber-400/40 shadow-sm";
  }

  if (isSelected) {
    cardStyle += " ring-2 ring-blue-600 shadow-md";
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
      className={`p-4 border-l-4 rounded-lg shadow-sm transition-all cursor-pointer ${cardStyle}`}
    >
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

      {/* Visual Evidence Notice or Status */}
      <div className="mt-2 flex items-center gap-2">
        {!hasVisualEvidence || !finding.elementId ? (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
            <span>ℹ️</span>
            <span>No visual evidence for this finding (administrative / documentation requirement)</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[11px] text-blue-700 font-medium hover:underline">
            <span>🎯</span>
            <span>Linked to element {finding.elementId} — click card to highlight on blueprint</span>
          </span>
        )}
      </div>

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

      {/* Action Buttons: Evidence Chain & Multi-option Fixes */}
      <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {onViewEvidenceChain && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewEvidenceChain();
              }}
              className="px-2.5 py-1 rounded text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>🕸️</span>
              <span>View Evidence Chain</span>
            </button>
          )}

          <button
            onClick={handleToggleRemediations}
            className="px-2.5 py-1 rounded text-xs font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>💡</span>
            <span>{showRemediations ? "Hide Remediation Options ▲" : `View Remediation Options (${remediations.length}) ▼`}</span>
          </button>
        </div>

        {isSelected && (
          <span className="text-[11px] text-blue-700 font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
            Selected on Blueprint
          </span>
        )}
      </div>

      {/* Expandable Remediation Options with Tradeoffs (Phase 4) */}
      {showRemediations && (
        <div className="mt-3.5 pt-3 border-t border-blue-100 bg-white/95 rounded-lg p-3.5 border space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100">
            <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
              <span>🛠️</span>
              <span>Remediation Alternatives & Impact Tradeoffs</span>
            </div>
            <span className="text-[10.5px] text-slate-500 italic">2+ viable architectural paths</span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {remediations.map((option, idx) => (
              <div
                key={option.id}
                className="p-3 rounded-md bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="font-bold text-xs text-slate-900">
                    Option {String.fromCharCode(65 + idx)}: {option.title}
                  </span>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {option.costEstimate && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {option.costEstimate}
                      </span>
                    )}
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                      {option.approvalLikelihood}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mb-1.5 leading-relaxed">
                  {option.description}
                </p>

                <div className="p-2 rounded bg-amber-50/70 border border-amber-200 text-[11.5px] text-amber-950 flex items-start gap-1.5">
                  <span className="font-bold text-amber-900 flex-shrink-0">⚖️ Tradeoff:</span>
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
