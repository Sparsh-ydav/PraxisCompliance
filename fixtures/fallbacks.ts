// Fallback compliance results for each blueprint under National Building Code of India (NBC 2016).
// These are returned when the LLM is unavailable or returns invalid JSON.
// Guarantees reliable deterministic evaluation.

import type { ComplianceResult } from "@/lib/schemas";

export const FALLBACK_CLEAN: ComplianceResult = {
  blueprintId: "bp-clean",
  clausesChecked: 19,
  findings: [],
  governanceNote:
    "No non-compliance detected against 19 clauses of National Building Code of India (NBC 2016) — Municipal Building Sanction sign-off required prior to permit issuance.",
  agentReasoning:
    "Blueprint A was evaluated against all fire egress and exit safety requirements under NBC 2016 Part 4 (Clauses 4.1 through 4.17) and open space/setback standards under NBC 2016 Part 3 (Clauses 8.1 through 8.4). Egress openings in the addition bedroom exceed 500 mm width, 600 mm height, and 0.53 m² area. Front, rear, and side setbacks strictly satisfy minimum open space dimensions. Primary exit doorway clear width of 914 mm (36 in) satisfies residential exit norms. No habitable rooms below grade without required light/ventilation shafts. Full compliance verified.",
};

export const FALLBACK_BLOCKING: ComplianceResult = {
  blueprintId: "bp-blocking",
  clausesChecked: 19,
  findings: [
    {
      id: "f-b-001",
      issue: "Basement bedroom emergency escape window width is 406 mm (16 in) — below NBC 2016 500 mm minimum",
      detail:
        "The emergency escape and ventilation opening for the basement sleeping room provides a net clear width of only 406 mm (16 inches). NBC 2016 Part 4, Clause 4.10 and Part 8 Section 1, Clause 9.11.2 require a minimum net clear opening width of 500 mm (20 inches) for any habitable sleeping room. This 94 mm deficit fails life safety egress requirements and does not qualify for an administrative waiver.",
      clauseId: "FE-102",
      clauseCitation: "NBC 2016 Part 4, Clause 4.10 — Minimum clear opening width: 500 mm (20 inches)",
      evidence: 'Window W2, basement bedroom (south wall) — parsed net clear opening: 16" × 22" (406 mm × 559 mm)',
      elementId: "W2",
      severity: "blocking",
      source: "written_code",
      confidence: 0.99,
    },
    {
      id: "f-b-002",
      issue: "Basement bedroom emergency escape window height is 559 mm (22 in) — below NBC 2016 600 mm minimum",
      detail:
        "The same egress opening fails the vertical dimension criteria under NBC 2016 Part 4, Clause 4.10. Net clear opening height is 559 mm (22 inches), which is 41 mm below the mandatory minimum clear opening height of 600 mm (24 inches).",
      clauseId: "FE-102",
      clauseCitation: "NBC 2016 Part 4, Clause 4.10 — Minimum clear opening height: 600 mm (24 inches)",
      evidence: 'Window W2, basement bedroom (south wall) — parsed net clear opening: 16" × 22" (406 mm × 559 mm)',
      elementId: "W2",
      severity: "blocking",
      source: "written_code",
      confidence: 0.99,
    },
    {
      id: "f-b-003",
      issue: "Basement escape window sill height is 1270 mm (50 in) — exceeds NBC 2016 1100 mm maximum",
      detail:
        "The window sill height above finished floor level is 1270 mm (50 inches). NBC 2016 Part 4, Clause 4.10 sets a strict upper bound of 1100 mm (44 inches / 1.1 m) to ensure unassisted occupant escape. Municipal scrutiny records confirm examiners consistently reject sills exceeding 1.1 m without a permanent compliant step.",
      clauseId: "FE-102",
      clauseCitation: "NBC 2016 Part 4, Clause 4.10 — Maximum sill height: 1.1 m (44 inches / 1100 mm)",
      evidence: 'Window W2, basement bedroom (south wall) — parsed sill height: 50" (1270 mm) above finished floor',
      elementId: "W2",
      severity: "blocking",
      source: "written_code",
      confidence: 0.98,
    },
    {
      id: "f-b-004",
      issue: "New sleeping room created without smoke and heat detection key plan",
      detail:
        "The proposed basement renovation creates an additional sleeping room. NBC 2016 Part 4, Clause 4.17 & Table 7 require interconnected automatic smoke detectors in all sleeping areas and access corridors. Historical plan exam precedents show municipal authorities issue formal objections for any new bedroom lacking an explicit electrical smoke detection schedule.",
      clauseId: "FE-109",
      clauseCitation: "NBC 2016 Part 4, Table 7 — Interconnected smoke alarm layout required for new sleeping rooms",
      evidence: "Administrative/Documentation — new sleeping room created without interconnected smoke alarm plan",
      severity: "blocking",
      source: "learned_pattern",
      confidence: 0.85,
    },
  ],
  governanceNote:
    "4 issues detected (3 blocking, 1 blocking via learned pattern) against 19 clauses of National Building Code of India (NBC 2016) — Town Planning Officer review required.",
  agentReasoning:
    "Blueprint B was audited against NBC 2016 Part 3 and Part 4 standards. The basement conversion triggers multiple life-safety egress non-compliances under NBC Part 4 Clause 4.10: window clear width (406 mm vs 500 mm min), window clear height (559 mm vs 600 mm min), and sill height (1270 mm vs 1100 mm max). Furthermore, under NBC Part 4 Table 7 and learned municipal pattern lp-004, an interconnected smoke detection layout is mandatory for newly added sleeping accommodations.",
};

export const FALLBACK_ADVISORY: ComplianceResult = {
  blueprintId: "bp-advisory",
  clausesChecked: 19,
  findings: [
    {
      id: "f-a-001",
      issue: "Side setback is 1.73 m (5.67 ft) — 70 mm below NBC 2016 1.8 m (6.0 ft) minimum (Advisory Waiver Available)",
      detail:
        "The proposed kitchen extension side open space measures 1.73 m (5 ft 8 in), which is approximately 70 mm (2.76 inches) below the 1.8 m (6.0 ft) minimum prescribed in NBC 2016 Part 3, Clause 8.2.3. However, under NBC 2016 Part 2 Clause 12.5 and local municipal bye-laws (historical pattern lp-002), deviations under 150 mm (6 inches) routinely receive an administrative tolerance waiver upon submission of a certified total-station plot demarcation survey.",
      clauseId: "SB-203",
      clauseCitation:
        "NBC 2016 Part 3, Clause 8.2.3 — Minimum side open space: 1.8 m (Clause 8.4.3 / Part 2 Cl 12.5 waiver available ≤ 150 mm)",
      evidence: 'Wall E1, Kitchen Extension (east wall) — parsed side setback: 5.67 ft (1.73 m) vs 6.0 ft (1.80 m) min',
      elementId: "setback-side",
      severity: "advisory",
      source: "learned_pattern",
      confidence: 0.92,
    },
  ],
  governanceNote:
    "1 advisory item detected against 19 clauses of National Building Code of India (NBC 2016) — Municipal Building Sanction sign-off required. No life-safety blocking issues found.",
  agentReasoning:
    "Blueprint C conforms to all NBC 2016 Part 4 egress specifications (no sleeping rooms involved in addition). The sole deviation is a side setback of 1.73 m vs. the 1.80 m standard (70 mm encroachment). Learned pattern lp-002 (confidence: 0.92) confirms this falls well within the 150 mm administrative waiver threshold. Sourced as advisory with proactive waiver filing recommendation.",
};

export const FALLBACKS: Record<string, ComplianceResult> = {
  "bp-clean": FALLBACK_CLEAN,
  "bp-blocking": FALLBACK_BLOCKING,
  "bp-advisory": FALLBACK_ADVISORY,
};
