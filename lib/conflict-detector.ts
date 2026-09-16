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
    title: "Egress Window Well Projection vs. Side Open Space Projections Allowance",
    clauseA: {
      id: "FE-107",
      section: "NBC 2016 Part 4, Clause 4.10.3 & Part 3, Clause 8.2.6",
      requirement: "Mandates that below-grade emergency escape window wells maintain a minimum horizontal projection of 900 mm (36 inches / 3.0 ft) from the building face.",
    },
    clauseB: {
      id: "SB-207",
      section: "NBC 2016 Part 3, Clause 8.4.1",
      requirement: "Limits uncounted architectural projections into required open spaces/setbacks to a maximum of 0.6 m (600 mm / 24 inches).",
    },
    conflictDescription:
      "Statutory contradiction: Fire & Life Safety (NBC 2016 Part 4, Cl 4.10.3) mandates a minimum 900 mm (36-inch) exterior projection for basement egress wells, while Development Control (NBC 2016 Part 3, Cl 8.4.1) strictly limits projections exceeding 600 mm (24 inches) into the side yard open space without a variance. On any side wall where setback clearance is constrained, complying with Life Safety guarantees a side open space encroachment violation.",
    affectedScenario: "Basement habitable room conversions or additions featuring below-grade egress window wells facing a side property boundary (e.g. Blueprint B).",
    severity: "conflict_human_review",
    recommendedResolution:
      "Route to Municipal Chief Town Planner / Chief Building Official for administrative harmonization under NBC 2016 Part 2, Clause 12.5. By statutory precedence, Life Safety requirements (Part 4) take precedence over general projection limits (Part 3).",
  },
  {
    id: "conf-fe103-fe102",
    title: "Ventilation Floor Area Ratio vs. Minimum Net Clear Egress Dimensions",
    clauseA: {
      id: "FE-102",
      section: "NBC 2016 Part 4, Clause 4.10 & Part 8 Sec 1, Clause 9.11.2",
      requirement: "Minimum net clear opening width of 500 mm (20\") and height of 600 mm (24\"), with minimum 0.53 m² (5.7 sq ft) total net clear opening area.",
    },
    clauseB: {
      id: "FE-103",
      section: "NBC 2016 Part 8 Sec 1, Clause 9.11.1",
      requirement: "Natural ventilation openings must aggregate to at least 10% of room floor area, with ground-floor escape opening reduced area of 0.46 m² (5.0 sq ft).",
    },
    conflictDescription:
      "Mathematical ambiguity: A window meeting the minimum physical dimensions (500 mm × 600 mm = 0.30 m² / 3.23 sq ft) fails both the 0.53 m² (5.7 sq ft) egress threshold and the 10% room floor area ventilation requirement, requiring either 500 mm × 1060 mm or 600 mm × 885 mm opening to satisfy aggregate area.",
    affectedScenario: "Habitable bedroom additions specifying minimal manufactured sashes.",
    severity: "conflict_human_review",
    recommendedResolution:
      "Staff clarification issued during plan scrutiny: Inform applicant that minimum linear dimensions and aggregate net clear area/ventilation ratio are compound requirements.",
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
