"use client";

import React, { useState, useEffect } from "react";
import type { AuditEntry } from "@/lib/audit-trail";
import { getAuditEvents } from "@/lib/audit-trail";

export default function AuditLog() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [filterActor, setFilterActor] = useState<string>("all");

  const refreshEntries = () => {
    setEntries(getAuditEvents());
  };

  useEffect(() => {
    refreshEntries();
    const interval = setInterval(refreshEntries, 3000);
    return () => clearInterval(interval);
  }, []);

  const filteredEntries = entries.filter((e) => {
    if (filterActor === "all") return true;
    return e.actor === filterActor;
  });

  const getActionBadge = (type: string) => {
    switch (type) {
      case "reviewer_approved":
        return { label: "APPROVED", color: "bg-emerald-100 text-emerald-800 border-emerald-300" };
      case "reviewer_rejected":
        return { label: "REJECTED", color: "bg-rose-100 text-rose-800 border-rose-300" };
      case "reviewer_edited":
        return { label: "LETTER EDITED", color: "bg-blue-100 text-blue-800 border-blue-300" };
      case "ripple_simulation_run":
        return { label: "RIPPLE SIMULATION", color: "bg-amber-100 text-amber-800 border-amber-300" };
      case "conflict_detected":
        return { label: "CONFLICT DETECTED", color: "bg-purple-100 text-purple-800 border-purple-300" };
      case "compliance_check_run":
        return { label: "COMPLIANCE CHECK", color: "bg-slate-100 text-slate-800 border-slate-300" };
      default:
        return { label: type.toUpperCase().replace(/_/g, " "), color: "bg-slate-100 text-slate-700 border-slate-200" };
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">📋</span>
            <h3 className="font-bold text-slate-900 text-base">
              System Audit Trail — Immutable Session Log
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
              {entries.length} Events Logged
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Chronological log of applicant submissions, ripple simulations, and reviewer approvals/rejections.
          </p>
        </div>

        {/* Actor Filter */}
        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={() => setFilterActor("all")}
            className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer ${
              filterActor === "all" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterActor("Reviewer")}
            className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer ${
              filterActor === "Reviewer" ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-700 hover:bg-blue-100"
            }`}
          >
            Reviewer
          </button>
          <button
            onClick={() => setFilterActor("Applicant")}
            className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer ${
              filterActor === "Applicant" ? "bg-amber-600 text-white" : "bg-amber-50 text-amber-700 hover:bg-amber-100"
            }`}
          >
            Applicant
          </button>
          <button
            onClick={() => setFilterActor("System Pipeline")}
            className={`px-2.5 py-1 rounded text-xs font-medium cursor-pointer ${
              filterActor === "System Pipeline" ? "bg-slate-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            System
          </button>
        </div>
      </div>

      {/* Audit Log Table / Stream */}
      <div className="mt-4 divide-y divide-slate-100 max-h-80 overflow-y-auto pr-1">
        {filteredEntries.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-400">
            No audit log entries matching filter.
          </div>
        ) : (
          filteredEntries.map((entry) => {
            const badge = getActionBadge(entry.actionType);
            const date = new Date(entry.timestamp);
            const timeFormatted = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

            return (
              <div key={entry.id} className="py-2.5 flex items-start justify-between gap-3 text-xs">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="font-mono text-[11px] text-slate-400">{timeFormatted}</span>
                    <span className="font-semibold text-slate-800">{entry.actor}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${badge.color}`}>
                      {badge.label}
                    </span>
                    {entry.targetId && (
                      <span className="font-mono text-[10.5px] bg-slate-100 text-slate-600 px-1 rounded">
                        {entry.targetId}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 text-[12px]">{entry.summary}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
