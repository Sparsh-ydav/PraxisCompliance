// Hardcoded fallback compliance results for each blueprint.
// These are returned when the LLM is unavailable or returns invalid JSON.
// This guarantees demo reliability — see lib/llm.ts for usage.

import type { ComplianceFinding, ComplianceResult } from "@/lib/schemas";

export const FALLBACK_CLEAN: ComplianceResult = {
  blueprintId: "bp-clean",
  clausesChecked: 19,
  findings: [],
  governanceNote:
    "No issues detected in automated check against 19 clauses — human reviewer sign-off required before permit issuance.",
  agentReasoning:
    "Blueprint A was checked against all fire egress clauses (FE-101 through FE-109) and all setback/zoning clauses (SB-201 through SB-210). All egress openings meet minimum dimensions. All setbacks are within required minimums. Primary exit door width is compliant. No sleeping rooms below grade. No issues found.",
};

export const FALLBACK_BLOCKING: ComplianceResult = {
  blueprintId: "bp-blocking",
  clausesChecked: 19,
  findings: [
    {
      id: "f-b-001",
      issue: "Basement bedroom egress window width is 16 inches — below the 20-inch minimum",
      detail:
        "The emergency escape and rescue opening for the basement bedroom has a net clear opening width of 16 inches. Section 101.2 requires a minimum net clear opening width of 20 inches for any sleeping room. This is a 4-inch deficit and does not qualify for any exception.",
      clauseId: "FE-102",
      clauseCitation: "Section 101.2 — Minimum net clear opening width: 20 inches",
      evidence: 'Window W2, basement bedroom (south wall) — parsed net clear opening: 16" × 22"',
      severity: "blocking",
      source: "written_code",
      confidence: 0.99,
    },
    {
      id: "f-b-002",
      issue: "Basement bedroom egress window height is 22 inches — below the 24-inch minimum",
      detail:
        "The same egress window also fails the height requirement. Net clear opening height is 22 inches; the minimum required by Section 101.2 is 24 inches.",
      clauseId: "FE-102",
      clauseCitation: "Section 101.2 — Minimum net clear opening height: 24 inches",
      evidence: 'Window W2, basement bedroom (south wall) — parsed net clear opening: 16" × 22"',
      severity: "blocking",
      source: "written_code",
      confidence: 0.99,
    },
    {
      id: "f-b-003",
      issue: "Basement egress window sill height is 50 inches — exceeds 44-inch maximum",
      detail:
        "The sill height above finished floor is 50 inches. Section 101.2 sets a maximum of 44 inches. Historical patterns confirm Maplewood reviewers flag sill exceedances of even 1 inch — this 6-inch exceedance will definitely be flagged.",
      clauseId: "FE-102",
      clauseCitation: "Section 101.2 — Maximum sill height: 44 inches above finished floor",
      evidence: 'Window W2, basement bedroom (south wall) — parsed sill height: 50" above finished floor',
      severity: "blocking",
      source: "written_code",
      confidence: 0.98,
    },
    {
      id: "f-b-004",
      issue: "New sleeping room created without smoke alarm documentation",
      detail:
        "The basement conversion creates a new sleeping room. Section 101.9 requires interconnected smoke alarms on all floors and in each new sleeping room. Based on historical patterns, Maplewood reviewers flag every new-sleeping-room application that lacks an explicit smoke alarm location plan.",
      clauseId: "FE-109",
      clauseCitation: "Section 101.9 — Interconnected smoke alarms required for new sleeping rooms",
      evidence: "Room rm-003, basement bedroom — new sleeping room created without interconnected smoke alarm plan",
      severity: "blocking",
      source: "learned_pattern",
      confidence: 0.85,
    },
  ],
  governanceNote:
    "4 issues detected (3 blocking, 1 blocking via learned pattern) in automated check against 19 clauses — human reviewer sign-off required before permit issuance.",
  agentReasoning:
    "Blueprint B was checked against all 19 clauses. The basement bedroom conversion triggers multiple egress failures: window width (16 in vs 20 in min), window height (22 in vs 24 in min), and sill height (50 in vs 44 in max). Additionally, historical Pattern lp-004 indicates Maplewood reviewers always flag missing smoke alarm plans for new sleeping rooms — no such plan is indicated in the submission.",
};

export const FALLBACK_ADVISORY: ComplianceResult = {
  blueprintId: "bp-advisory",
  clausesChecked: 19,
  findings: [
    {
      id: "f-a-001",
      issue: "Side setback is 5.67 ft — below the 6-ft minimum by 0.33 ft (3.96 inches)",
      detail:
        "The proposed kitchen addition has a side setback of 5 feet 8 inches (5.67 ft), which is 0.33 ft (approximately 4 inches) below the 6-foot minimum required by Section 201.3. However, historical Pattern lp-002 shows that Maplewood reviewers consistently grant administrative waivers for side setback encroachments under 6 inches, provided a certified survey is submitted. This encroachment of ~4 inches should qualify for an administrative waiver — but the applicant must proactively request it and include the survey.",
      clauseId: "SB-203",
      clauseCitation:
        "Section 201.3 — Minimum side setback: 6 feet (Section 201.8 admin waiver available for encroachments ≤ 6 inches)",
      evidence: 'Wall E1, Kitchen Extension (east wall) — parsed side setback: 5.67 ft (5\' 8") vs 6.0 ft min',
      severity: "advisory",
      source: "learned_pattern",
      confidence: 0.92,
    },
  ],
  governanceNote:
    "1 advisory issue detected in automated check against 19 clauses — human reviewer sign-off required before permit issuance. No blocking issues found.",
  agentReasoning:
    "Blueprint C was checked against all 19 clauses. All egress requirements are satisfied (no sleeping rooms in this addition). The only issue is a side setback of 5.67 ft vs. the 6-ft minimum. Pattern lp-002 (confidence: 0.92) indicates this jurisdiction's reviewers routinely grant administrative waivers for sub-6-inch encroachments. The 3.96-inch encroachment falls within the waiver threshold, so this is advisory rather than blocking — but applicant must include a certified survey and request the waiver explicitly at filing.",
};

export const FALLBACKS: Record<string, ComplianceResult> = {
  "bp-clean": FALLBACK_CLEAN,
  "bp-blocking": FALLBACK_BLOCKING,
  "bp-advisory": FALLBACK_ADVISORY,
};
