// Queued applications for the Reviewer Dashboard (stretch goal — CP7)
// 8-10 synthetic applications, sorted by severity for the queue view.

export type ApplicationStatus = "pending_review" | "approved" | "rejected" | "revision_requested";

export interface QueuedApplication {
  id: string;
  caseNumber: string;
  applicantName: string;
  projectAddress: string;
  projectType: string;
  submittedDate: string;
  blueprintId: string; // links to one of the 3 sample blueprints for compliance result lookup
  blockingCount: number;
  advisoryCount: number;
  status: ApplicationStatus;
  reviewerNotes: string;
}

export const QUEUED_APPLICATIONS: QueuedApplication[] = [
  {
    id: "qa-001",
    caseNumber: "BPR-2025-0388",
    applicantName: "Johansson, R.",
    projectAddress: "45 Birchwood Lane",
    projectType: "Basement bedroom conversion",
    submittedDate: "2025-10-02",
    blueprintId: "bp-blocking",
    blockingCount: 4,
    advisoryCount: 0,
    status: "pending_review",
    reviewerNotes: "",
  },
  {
    id: "qa-002",
    caseNumber: "BPR-2025-0391",
    applicantName: "Nakamura, S.",
    projectAddress: "217 Elmwood Drive",
    projectType: "Basement bedroom conversion",
    submittedDate: "2025-10-03",
    blueprintId: "bp-blocking",
    blockingCount: 3,
    advisoryCount: 1,
    status: "pending_review",
    reviewerNotes: "",
  },
  {
    id: "qa-003",
    caseNumber: "BPR-2025-0402",
    applicantName: "Okonkwo, C.",
    projectAddress: "88 Maple Street",
    projectType: "Side-yard addition",
    submittedDate: "2025-10-04",
    blueprintId: "bp-advisory",
    blockingCount: 0,
    advisoryCount: 1,
    status: "pending_review",
    reviewerNotes: "",
  },
  {
    id: "qa-004",
    caseNumber: "BPR-2025-0407",
    applicantName: "Lindqvist, A.",
    projectAddress: "302 Cedar Court",
    projectType: "Rear bedroom addition",
    submittedDate: "2025-10-05",
    blueprintId: "bp-clean",
    blockingCount: 0,
    advisoryCount: 0,
    status: "pending_review",
    reviewerNotes: "",
  },
  {
    id: "qa-005",
    caseNumber: "BPR-2025-0413",
    applicantName: "Patel, D.",
    projectAddress: "590 Pinewood Way",
    projectType: "In-law suite addition",
    submittedDate: "2025-10-06",
    blueprintId: "bp-blocking",
    blockingCount: 2,
    advisoryCount: 2,
    status: "pending_review",
    reviewerNotes: "",
  },
  {
    id: "qa-006",
    caseNumber: "BPR-2025-0418",
    applicantName: "Ferreira, M.",
    projectAddress: "76 Oakdale Avenue",
    projectType: "Kitchen side addition",
    submittedDate: "2025-10-07",
    blueprintId: "bp-advisory",
    blockingCount: 0,
    advisoryCount: 1,
    status: "pending_review",
    reviewerNotes: "",
  },
  {
    id: "qa-007",
    caseNumber: "BPR-2025-0424",
    applicantName: "Kowalski, J.",
    projectAddress: "1120 Willowbrook Terrace",
    projectType: "Master suite addition",
    submittedDate: "2025-10-08",
    blueprintId: "bp-clean",
    blockingCount: 0,
    advisoryCount: 0,
    status: "pending_review",
    reviewerNotes: "",
  },
  {
    id: "qa-008",
    caseNumber: "BPR-2025-0429",
    applicantName: "Reardon, T.",
    projectAddress: "43 Ferndale Drive",
    projectType: "Garage conversion",
    submittedDate: "2025-10-09",
    blueprintId: "bp-blocking",
    blockingCount: 1,
    advisoryCount: 0,
    status: "pending_review",
    reviewerNotes: "",
  },
  {
    id: "qa-009",
    caseNumber: "BPR-2025-0433",
    applicantName: "Mwangi, E.",
    projectAddress: "267 Chestnut Boulevard",
    projectType: "Second-story addition",
    submittedDate: "2025-10-10",
    blueprintId: "bp-advisory",
    blockingCount: 0,
    advisoryCount: 2,
    status: "pending_review",
    reviewerNotes: "",
  },
  {
    id: "qa-010",
    caseNumber: "BPR-2025-0441",
    applicantName: "Vasquez, L.",
    projectAddress: "800 Laurelwood Circle",
    projectType: "Detached garage with loft",
    submittedDate: "2025-10-11",
    blueprintId: "bp-clean",
    blockingCount: 0,
    advisoryCount: 0,
    status: "pending_review",
    reviewerNotes: "",
  },
];
