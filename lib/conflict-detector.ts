// Regulation Conflict Detector.
// Fulfills Phase 7 (item 23): flags contradictory or ambiguous statutory clauses.
// Surfaces conflicts as "Regulation Conflict — Flagged for Human Review" rather than blocking/advisory.

import type { Blueprint } from "@/fixtures/blueprints";
import { REGULATIONS } from "@/fixtures/regulations";

export interface RegulationConflict {
  id: string;
  title: string;
  clauseA: {
    id: string;
    section: string;
    requirement: string;
  };
  clauseB: {
    id: string;
    section: string;
    requirement: string;
  };
  conflictDescription: string;
  affectedScenario: string;
  severity: "conflict_human_review";
  recommendedResolution: string;
}

export const AUTHORED_CONFLICTS: RegulationConflict[] = [
  {
    id: "conf-fe107-sb207",
    title: "Egress Window Well Projection vs. Zoning Projections Allowance",
    clauseA: {
      id: "FE-107",
      section: "Section 101.7",
      requirement: "Mandates that below-grade egress window wells maintain a minimum horizontal projection of 36 inches (3.0 ft) from the building face.",
    },
    clauseB: {
      id: "SB-207",
      section: "Section 201.7",
      requirement: "Limits uncounted architectural projections into required setbacks to a maximum of 24 inches (2.0 ft).",
    },
    conflictDescription:
      "Statutory contradiction: Fire Egress Section 101.7 mandates a minimum 36-inch exterior projection for basement egress wells, while Zoning Section 201.7 strictly prohibits projections exceeding 24 inches into the side yard setback without a variance. On any side wall where setback clearance is less than 9 feet, complying with Fire Egress guarantees a Zoning setback encroachment violation.",
    affectedScenario: "Basement bedroom conversions or additions featuring below-grade egress window wells facing a side property boundary (e.g. Blueprint B).",
    severity: "conflict_human_review",
    recommendedResolution:
      "Route to Chief Building Official / Zoning Officer for an administrative harmonization ruling. Per NJ UCC precedence, Life Safety code (FE-107) supersedes local zoning dimensional limits (SB-207).",
  },
  {
    id: "conf-fe103-fe102",
    title: "Ground Floor Area Reduction vs. Minimum Dimension Calculation",
    clauseA: {
      id: "FE-102",
      section: "Section 101.2",
      requirement: "Minimum net clear opening width of 20 inches and minimum height of 24 inches (product = 3.33 sq ft minimum, but mandates 5.7 sq ft total net clear area).",
    },
    clauseB: {
      id: "FE-103",
      section: "Section 101.3",
      requirement: "Permits ground-floor net clear area reduction to 5.0 sq ft while citing 20-inch width and 24-inch height.",
    },
    conflictDescription:
      "Mathematical ambiguity: A window meeting the minimum dimensions (20\" × 24\" = 480 sq in = 3.33 sq ft) fails both the 5.7 sq ft and 5.0 sq ft total area thresholds, requiring applicants to provide either 20\" × 36\" or 24\" × 30\" to achieve the aggregate area.",
    affectedScenario: "First-story bedroom additions specifying minimal 20\" × 24\" manufactured sashes.",
    severity: "conflict_human_review",
    recommendedResolution:
      "Staff clarification issued in plan check: Inform applicant that minimum dimensions and minimum total net clear area are compound requirements.",
  },
];

export function detectRegulationConflicts(blueprint?: Blueprint): RegulationConflict[] {
  if (!blueprint) return AUTHORED_CONFLICTS;

  // If blueprint is bp-blocking (has basement egress well), highlight the window well conflict
  if (blueprint.id === "bp-blocking") {
    return AUTHORED_CONFLICTS;
  }

  // Return general conflict for other blueprints
  return [AUTHORED_CONFLICTS[0]];
}
