"use client";

import { useState } from "react";
import type { QueuedApplication, ApplicationStatus } from "@/fixtures/reviewer-queue";
import { QUEUED_APPLICATIONS, sortBySeverity } from "@/fixtures/reviewer-queue";
import FindingCard from "@/app/components/FindingCard";
import ApprovalReadinessGauge, { calculateReadinessScore } from "@/app/components/ApprovalReadinessGauge";

export default function ReviewerDashboard() {
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
    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status: newStatus } : app))
    );

    if (newStatus === "approved") {
      if (wasEdited) {
        setEditedBeforeApproval((prev) => prev + 1);
      } else {
        setApprovedAsIs((prev) => prev + 1);
      }
    } else if (newStatus === "rejected") {
      setRejected((prev) => prev + 1);
    }

    setSelectedApp(null);
  }

  const pendingApps = applications.filter((app) => app.status === "pending");

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Reviewer Dashboard</h1>
        <div className="text-sm bg-slate-100 px-4 py-2 rounded">
          <span className="font-semibold">Session Stats:</span> {approvedAsIs} signed off as-is, {editedBeforeApproval} edited before sign-off, {rejected} rejected
        </div>
      </div>

      {!selectedApp ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Pending Applications ({pendingApps.length})
          </h2>

          <div className="space-y-3">
            {pendingApps.map((app) => (
              <div
                key={app.id}
                onClick={() => loadApplication(app)}
                className="bg-white p-4 border rounded shadow-sm hover:shadow-md cursor-pointer transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{app.applicantName}</h3>
                    <p className="text-sm text-muted">{app.projectAddress}</p>
                    <p className="text-xs text-muted mt-1">
                      {app.projectType} • Filed {app.submittedDate}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        app.severity === "high"
                          ? "bg-blocking text-white"
                          : app.severity === "medium"
                          ? "bg-advisory text-white"
                          : "bg-success text-white"
                      }`}
                    >
                      {app.severity.toUpperCase()}
                    </span>
                    <p className="text-xs mt-2 text-muted">
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
            className="mb-4 text-accent hover:underline"
          >
            ← Back to Queue
          </button>

          <div className="bg-white p-6 rounded shadow mb-6">
            <h2 className="text-2xl font-bold mb-2">{selectedApp.applicantName}</h2>
            <p className="text-muted mb-4">
              {selectedApp.projectAddress} • Case #{selectedApp.caseNumber}
            </p>

            {/* Approval Readiness Score Gauge */}
            <ApprovalReadinessGauge
              score={calculateReadinessScore(selectedApp.blockingCount, selectedApp.advisoryCount)}
              blockingCount={selectedApp.blockingCount}
              advisoryCount={selectedApp.advisoryCount}
            />

            <h3 className="font-semibold text-lg mb-3">Findings ({selectedApp.findings.length})</h3>
            {selectedApp.findings.length > 0 ? (
              <div className="space-y-3 mb-6">
                {selectedApp.findings.map((finding) => (
                  <FindingCard key={finding.id} finding={finding} />
                ))}
              </div>
            ) : (
              <p className="text-success font-bold mb-6">✓ No issues detected - Application complies with all requirements.</p>
            )}

            <h3 className="font-semibold text-lg mb-3">Draft Correction Letter</h3>
            {loading ? (
              <p>Loading draft letter...</p>
            ) : isEditing ? (
              <textarea
                value={draftLetter}
                onChange={(e) => setDraftLetter(e.target.value)}
                className="w-full h-96 p-4 border rounded font-mono text-sm"
              />
            ) : (
              <pre className="bg-slate-50 p-4 rounded border text-sm whitespace-pre-wrap font-mono">
                {draftLetter}
              </pre>
            )}

            <div className="mt-6 flex gap-3">
              {!isEditing ? (
                <>
                  <button
                    onClick={() => updateStatus(selectedApp.id, "approved", false)}
                    className="px-6 py-2 bg-success text-white rounded font-bold hover:bg-green-700 cursor-pointer"
                  >
                    Sign Off &amp; Issue
                  </button>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2 bg-accent text-white rounded font-bold hover:bg-blue-700 cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Reject this application?")) {
                        updateStatus(selectedApp.id, "rejected");
                      }
                    }}
                    className="px-6 py-2 bg-blocking text-white rounded font-bold hover:bg-rose-700 cursor-pointer"
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
                    className="px-6 py-2 bg-success text-white rounded font-bold hover:bg-green-700 cursor-pointer"
                  >
                    Sign Off Edited Letter
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2 bg-slate-400 text-white rounded font-bold hover:bg-slate-500 cursor-pointer"
                  >
                    Cancel Edit
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
