"use client";

import { useState } from "react";
import type { ComplianceFinding } from "@/lib/schemas";

export default function FindingCard({ finding }: { finding: ComplianceFinding }) {
  const isBlocking = finding.severity === "blocking";
  const isLearned = finding.source === "learned_pattern";

  return (
    <div
      className={`p-4 border-l-4 rounded shadow-sm ${
        isBlocking
          ? "bg-blocking-bg border-blocking"
          : "bg-advisory-bg border-advisory"
      }`}
    >
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-lg">{finding.issue}</h3>
        <span
          className={`px-2 py-0.5 text-xs rounded-full ${
            isLearned ? "bg-accent-light text-accent border border-accent" : "bg-slate-200"
          }`}
        >
          {isLearned ? "Learned Pattern" : "Written Code"}
        </span>
      </div>
      <p className="mt-2 text-sm">{finding.detail}</p>
      <div className="mt-3 flex justify-between text-xs text-muted">
        <span>Citation: {finding.clauseCitation}</span>
        <span>Confidence: {(finding.confidence * 100).toFixed(0)}%</span>
      </div>
    </div>
  );
}
