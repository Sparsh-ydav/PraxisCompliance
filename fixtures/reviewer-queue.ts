// Queued applications for the Reviewer Dashboard
// Mix of severities to demonstrate the sort-by-severity behavior

import type { ComplianceFinding } from "@/lib/schemas";

export type ApplicationStatus = "pending" | "approved" | "rejected";
export type SeverityLevel = "high" | "medium" | "low";

export interface QueuedApplication {
  id: string;
  caseNumber: string;
  applicantName: string;
  projectAddress: string;
  projectType: string;
  submittedDate: string;
  blueprintId: string; // links to one of the 3 sample blueprints for compliance lookup
  blockingCount: number;
  advisoryCount: number;
  severity: SeverityLevel;
  status: ApplicationStatus;
  findings: ComplianceFinding[];
}

// Import findings from fallbacks to reuse the same data structure
import { FALLBACK_CLEAN, FALLBACK_BLOCKING, FALLBACK_ADVISORY } from "./fallbacks";

export const QUEUED_APPLICATIONS: QueuedApplication[] = [
  // HIGH SEVERITY (blocking issues)
  {
    id: "qa-001",
    caseNumber: "BPR-2026-0412",
    applicantName: "Jennifer Martinez",
    projectAddress: "847 Oakwood Drive",
    projectType: "Basement bedroom conversion",
    submittedDate: "2026-09-08",
    blueprintId: "bp-blocking",
    blockingCount: 4,
    advisoryCount: 0,
    severity: "high",
    status: "pending",
    findings: FALLBACK_BLOCKING.findings,
  },
  {
    id: "qa-002",
    caseNumber: "BPR-2026-0419",
    applicantName: "David Chen",
    projectAddress: "1205 Maple Street",
    projectType: "Basement bedroom addition",
    submittedDate: "2026-09-09",
    blueprintId: "bp-blocking",
    blockingCount: 4,
    advisoryCount: 0,
    severity: "high",
    status: "pending",
    findings: FALLBACK_BLOCKING.findings,
  },
  {
    id: "qa-003",
    caseNumber: "BPR-2026-0423",
    applicantName: "Sarah Thompson",
    projectAddress: "632 Cedar Lane",
    projectType: "In-law suite conversion",
    submittedDate: "2026-09-10",
    blueprintId: "bp-blocking",
    blockingCount: 3,
    advisoryCount: 1,
    severity: "high",
    status: "pending",
    findings: FALLBACK_BLOCKING.findings.slice(0, 3), // First 3 blocking issues
  },

  // MEDIUM SEVERITY (advisory only)
  {
    id: "qa-004",
    caseNumber: "BPR-2026-0427",
    applicantName: "Michael Johnson",
    projectAddress: "423 Birchwood Circle",
    projectType: "Kitchen side addition",
    submittedDate: "2026-09-10",
    blueprintId: "bp-advisory",
    blockingCount: 0,
    advisoryCount: 1,
    severity: "medium",
    status: "pending",
    findings: FALLBACK_ADVISORY.findings,
  },
  {
    id: "qa-005",
    caseNumber: "BPR-2026-0431",
    applicantName: "Patricia O'Brien",
    projectAddress: "789 Elmwood Avenue",
    projectType: "Side-yard addition",
    submittedDate: "2026-09-11",
    blueprintId: "bp-advisory",
    blockingCount: 0,
    advisoryCount: 1,
    severity: "medium",
    status: "pending",
    findings: FALLBACK_ADVISORY.findings,
  },
  {
    id: "qa-006",
    caseNumber: "BPR-2026-0435",
    applicantName: "Robert Kim",
    projectAddress: "1567 Willow Lane",
    projectType: "Garage expansion",
    submittedDate: "2026-09-11",
    blueprintId: "bp-advisory",
    blockingCount: 0,
    advisoryCount: 1,
    severity: "medium",
    status: "pending",
    findings: FALLBACK_ADVISORY.findings,
  },

  // LOW SEVERITY (no issues)
  {
    id: "qa-007",
    caseNumber: "BPR-2026-0438",
    applicantName: "Lisa Anderson",
    projectAddress: "234 Pine Street",
    projectType: "Master bedroom addition",
    submittedDate: "2026-09-11",
    blueprintId: "bp-clean",
    blockingCount: 0,
    advisoryCount: 0,
    severity: "low",
    status: "pending",
    findings: [],
  },
  {
    id: "qa-008",
    caseNumber: "BPR-2026-0442",
    applicantName: "James Wilson",
    projectAddress: "956 Chestnut Boulevard",
    projectType: "Rear addition",
    submittedDate: "2026-09-12",
    blueprintId: "bp-clean",
    blockingCount: 0,
    advisoryCount: 0,
    severity: "low",
    status: "pending",
    findings: [],
  },
  {
    id: "qa-009",
    caseNumber: "BPR-2026-0445",
    applicantName: "Emily Rodriguez",
    projectAddress: "1842 Ferndale Drive",
    projectType: "Home office addition",
    submittedDate: "2026-09-12",
    blueprintId: "bp-clean",
    blockingCount: 0,
    advisoryCount: 0,
    severity: "low",
    status: "pending",
    findings: [],
  },
];

// Helper to get application by ID
export function getApplicationById(id: string): QueuedApplication | undefined {
  return QUEUED_APPLICATIONS.find((app) => app.id === id);
}

// Helper to sort by severity
export function sortBySeverity(apps: QueuedApplication[]): QueuedApplication[] {
  const severityOrder = { high: 0, medium: 1, low: 2 };
  return [...apps].sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
}
