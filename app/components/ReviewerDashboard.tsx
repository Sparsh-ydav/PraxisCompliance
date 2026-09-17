"use client";

import { useState } from "react";
import type { QueuedApplication, ApplicationStatus } from "@/fixtures/reviewer-queue";
import { QUEUED_APPLICATIONS, sortBySeverity } from "@/fixtures/reviewer-queue";
import FindingCard from "@/app/components/FindingCard";
import ApprovalReadinessGauge, { calculateReadinessScore } from "@/app/components/ApprovalReadinessGauge";
import AuditLog from "@/app/components/AuditLog";
import JurisdictionMemoryPanel from "@/app/components/JurisdictionMemoryPanel";
import { logAuditEvent } from "@/lib/audit-trail";

export default function ReviewerDashboard() {
  const [activeSubTab, setActiveSubTab] = useState<"queue" | "audit" | "jurisdiction">("queue");
  const [applications, setApplications] = useState<QueuedApplication[]>(sortBySeverity(QUEUED_APPLICATIONS));
  const [selectedApp, setSelectedApp] = useState<QueuedApplication | null>(null);
  const [draftLetter, setDraftLetter] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Session counters
  const [approvedAsIs, setApprovedAsIs] = useState(0);
  const [editedBeforeApproval, setEditedBeforeApproval] = useState(0);
  const [rejected, setRejected] = useState(0);

  async function loadApplication(app: QueuedApplication) {
    setSelectedApp(app);
    setIsEditing(false);
    setLoading(true);

    const res = await fetch("/api/correction-drafter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicationId: app.id, mode: "reviewer" }),
    });

    const data = await res.json();
    setDraftLetter(data.letterText || "Error loading letter");
    setLoading(false);
  }

  function updateStatus(appId: string, newStatus: ApplicationStatus, wasEdited: boolean = false) {
    const targetApp = applications.find((a) => a.id === appId);
    const targetName = targetApp ? `${targetApp.applicantName} (${targetApp.caseNumber})` : appId;

    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status: newStatus } : app))
    );

    if (newStatus === "approved") {
      if (wasEdited) {
        setEditedBeforeApproval((prev) => prev + 1);
        logAuditEvent(
          "reviewer_approved",
          "Reviewer",
          targetName,
          `Approved application after editing draft correction letter.`
        );
      } else {
        setApprovedAsIs((prev) => prev + 1);
        logAuditEvent(
          "reviewer_approved",
          "Reviewer",
          targetName,
          `Signed off and issued approval without edits.`
        );
      }
    } else if (newStatus === "rejected") {
      setRejected((prev) => prev + 1);
      logAuditEvent(
        "reviewer_rejected",
        "Reviewer",
        targetName,
        `Application rejected by municipal plan reviewer.`
      );
    }

    setSelectedApp(null);
  }

  const pendingApps = applications.filter((app) => app.status === "pending");

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-municipal-blue dark:text-slate-100">Reviewer Dashboard</h1>
          <p className="text-xs md:text-sm text-muted dark:text-slate-400 mt-1">
            Municipal Corporation — Department of Town Planning &amp; Building Sanction (NBC 2016)
          </p>
        </div>
        <div className="text-xs bg-card dark:bg-slate-900 px-4 py-2.5 rounded-xl border border-card-border dark:border-slate-800 shadow-xs">
          <span className="font-semibold text-slate-700 dark:text-slate-300">Session Actions:</span>{" "}
          <span className="text-emerald-700 dark:text-emerald-400 font-bold">{approvedAsIs}</span> approved as-is,{" "}
          <span className="text-blue-700 dark:text-blue-400 font-bold">{editedBeforeApproval}</span> edited &amp; approved,{" "}
          <span className="text-rose-700 dark:text-rose-400 font-bold">{rejected}</span> rejected
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => {
            setActiveSubTab("queue");
            setSelectedApp(null);
          }}
          className={`pb-3 px-4 font-semibold text-sm transition-all border-b-2 cursor-pointer ${
            activeSubTab === "queue"
              ? "border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400"
              : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          Application Queue ({pendingApps.length})
        </button>
        <button
          onClick={() => {
            setActiveSubTab("audit");
            setSelectedApp(null);
          }}
          className={`pb-3 px-4 font-semibold text-sm transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === "audit"
              ? "border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400"
              : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <span>📋</span>
          <span>Audit Trail</span>
        </button>
        <button
          onClick={() => {
            setActiveSubTab("jurisdiction");
            setSelectedApp(null);
          }}
          className={`pb-3 px-4 font-semibold text-sm transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === "jurisdiction"
              ? "border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400"
              : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <span>🏛️</span>
          <span>Jurisdiction Memory</span>
        </button>
      </div>

      {/* Tab 1: Audit Trail */}
      {activeSubTab === "audit" && <AuditLog />}

      {/* Tab 2: Jurisdiction Memory */}
      {activeSubTab === "jurisdiction" && <JurisdictionMemoryPanel />}

      {/* Tab 3: Application Queue & Letter Drafting */}
      {activeSubTab === "queue" && (
        <>
          {!selectedApp ? (
            <div>
              <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200">
                Pending Plan Submissions ({pendingApps.length})
              </h2>

              <div className="space-y-3">
                {pendingApps.map((app) => (
                  <div
                    key={app.id}
                    onClick={() => loadApplication(app)}
                    className="bg-card dark:bg-slate-900 p-4 border border-card-border dark:border-slate-800 rounded-xl shadow-xs hover:shadow-md cursor-pointer transition-all hover:border-signature-ink dark:hover:border-slate-700"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">{app.applicantName}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{app.projectAddress}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-mono">
                          {app.projectType} • Case #{app.caseNumber} • Filed {app.submittedDate}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-bold font-mono ${
                            app.severity === "high"
                              ? "bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900"
                              : app.severity === "medium"
                              ? "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900"
                              : "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900"
                          }`}
                        >
                          {app.severity.toUpperCase()} RISK
                        </span>
                        <p className="text-xs mt-2 text-slate-500 dark:text-slate-400">
                          {app.blockingCount > 0 && `${app.blockingCount} blocking`}
                          {app.blockingCount > 0 && app.advisoryCount > 0 && ", "}
                          {app.advisoryCount > 0 && `${app.advisoryCount} advisory`}
                          {app.blockingCount === 0 && app.advisoryCount === 0 && "No issues"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <button
                onClick={() => setSelectedApp(null)}
                className="mb-4 text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer text-sm"
              >
                ← Back to Queue
              </button>

              <div className="bg-card dark:bg-slate-900 p-6 rounded-xl border border-card-border dark:border-slate-800 shadow-xs mb-6 transition-colors">
                <h2 className="text-2xl font-bold mb-1 text-municipal-blue dark:text-slate-100">{selectedApp.applicantName}</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 font-mono">
                  {selectedApp.projectAddress} • Case #{selectedApp.caseNumber}
                </p>

                {/* Approval Readiness Score Gauge */}
                <ApprovalReadinessGauge
                  score={calculateReadinessScore(selectedApp.blockingCount, selectedApp.advisoryCount)}
                  blockingCount={selectedApp.blockingCount}
                  advisoryCount={selectedApp.advisoryCount}
                />

                <h3 className="font-semibold text-lg mb-3 mt-6 text-slate-900 dark:text-slate-100">
                  Findings ({selectedApp.findings.length})
                </h3>
                {selectedApp.findings.length > 0 ? (
                  <div className="space-y-3 mb-6">
                    {selectedApp.findings.map((finding) => (
                      <FindingCard key={finding.id} finding={finding} />
                    ))}
                  </div>
                ) : (
                  <p className="text-emerald-700 dark:text-emerald-300 font-bold mb-6 bg-emerald-50 dark:bg-emerald-950/50 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    ✓ No issues detected — Application complies with all requirements.
                  </p>
                )}

                <h3 className="font-semibold text-lg mb-3 text-slate-900 dark:text-slate-100">Draft Correction Letter</h3>
                {loading ? (
                  <div className="p-8 text-center text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
                    Generating official correction letter draft…
                  </div>
                ) : isEditing ? (
                  <textarea
                    value={draftLetter}
                    onChange={(e) => setDraftLetter(e.target.value)}
                    className="w-full h-96 p-4 border border-slate-300 dark:border-slate-700 rounded-lg font-mono text-sm bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                ) : (
                  <pre className="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800 text-sm whitespace-pre-wrap font-mono text-slate-800 dark:text-slate-200 leading-relaxed">
                    {draftLetter}
                  </pre>
                )}

                <div className="mt-6 flex flex-wrap gap-3">
                  {!isEditing ? (
                    <>
                      <button
                        onClick={() => updateStatus(selectedApp.id, "approved", false)}
                        className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-colors shadow-sm cursor-pointer"
                      >
                        Sign Off &amp; Issue
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(true);
                          logAuditEvent(
                            "reviewer_edited",
                            "Reviewer",
                            selectedApp.caseNumber,
                            "Reviewer opened draft correction letter for manual edits."
                          );
                        }}
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
                      >
                        Edit Letter
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("Reject this application?")) {
                            updateStatus(selectedApp.id, "rejected");
                          }
                        }}
                        className="px-6 py-2.5 bg-rose-600 text-white rounded-lg font-bold hover:bg-rose-700 transition-colors shadow-sm cursor-pointer"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          updateStatus(selectedApp.id, "approved", true);
                        }}
                        className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-colors shadow-sm cursor-pointer"
                      >
                        Sign Off Edited Letter
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-2.5 bg-slate-400 dark:bg-slate-700 text-white rounded-lg font-bold hover:bg-slate-500 dark:hover:bg-slate-600 transition-colors shadow-sm cursor-pointer"
                      >
                        Cancel Edit
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
