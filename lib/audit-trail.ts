// In-memory session-level Audit Trail store and event logger.
// Fulfills Phase 6 (item 24 Audit Trail): append-only chronological log of all key actions.

export type AuditActor = "Applicant" | "Reviewer" | "System Pipeline";

export type AuditActionType =
  | "compliance_check_run"
  | "findings_generated"
  | "ripple_simulation_run"
  | "recheck_completed"
  | "remediation_viewed"
  | "reviewer_approved"
  | "reviewer_edited"
  | "reviewer_rejected"
  | "conflict_detected"
  | "plan_reset";

export interface AuditEntry {
  id: string;
  timestamp: string; // ISO string
  actionType: AuditActionType;
  actor: AuditActor;
  targetId: string; // e.g. blueprintId or caseNumber
  summary: string;
  metadata?: Record<string, unknown>;
}

// In-memory store (persists during the session)
const AUDIT_LOG_STORE: AuditEntry[] = [
  {
    id: "audit-init-01",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    actionType: "compliance_check_run",
    actor: "System Pipeline",
    targetId: "NBC-2016",
    summary: "Loaded 19 National Building Code of India (NBC 2016) clauses and 6 historical reviewer patterns for Municipal Town Planning Authority.",
  },
  {
    id: "audit-init-02",
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    actionType: "compliance_check_run",
    actor: "System Pipeline",
    targetId: "bp-blocking",
    summary: "Initial compliance check executed on Blueprint B: 4 NBC 2016 findings identified (3 blocking, 1 advisory).",
  },
];

export function logAuditEvent(
  actionType: AuditActionType,
  actor: AuditActor,
  targetId: string,
  summary: string,
  metadata?: Record<string, unknown>
): AuditEntry {
  const entry: AuditEntry = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    actionType,
    actor,
    targetId,
    summary,
    metadata,
  };

  AUDIT_LOG_STORE.unshift(entry); // Newest first
  return entry;
}

export function getAuditEvents(): AuditEntry[] {
  return [...AUDIT_LOG_STORE];
}

export function clearAuditEvents(): void {
  AUDIT_LOG_STORE.length = 0;
}
