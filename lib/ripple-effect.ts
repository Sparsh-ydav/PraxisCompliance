// Ripple Effect Provider Abstraction for PraxisCompliance.
// Decouples UI actions (such as "Move window 300mm east") from underlying data sources.
// Provides interchangeable Mock and Live implementations with a single configuration toggle.

import type { ComplianceFinding } from "@/lib/schemas";

export type RippleEffectResult = {
  resolvedFindingIds: string[]; // findings from the "before" state that are now fixed
  newFindings: ComplianceFinding[]; // newly surfaced findings, each flagged as ripple-sourced
  updatedReadinessScore: number; // calculated readiness score for the updated plan state
  windowPosition: {
    before: { x: number; y: number; distanceToBoundaryFt: number };
    after: { x: number; y: number; distanceToBoundaryFt: number };
  };
};

export interface RippleEffectSource {
  runMoveWindowEast(blueprintId: string, offsetMm: number): Promise<RippleEffectResult>;
}

/**
 * MockRippleEffectSource
 * Returns deterministic RippleEffectResult for the basement bedroom demo blueprint (bp-blocking).
 * Simulates a multi-agent recheck with a realistic artificial delay (1.2s).
 */
export class MockRippleEffectSource implements RippleEffectSource {
  async runMoveWindowEast(blueprintId: string, offsetMm: number): Promise<RippleEffectResult> {
    // Artificial delay to emulate real agent retriever & compliance checker latency
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Hardcoded result for bp-blocking:
    // Resolves egress width (f-b-001) and height (f-b-002)
    // Surfaces new side setback encroachment (f-ripple-setback-01)
    const resolvedFindingIds = ["f-b-001", "f-b-002"];

    const newFindings: ComplianceFinding[] = [
      {
        id: "f-ripple-setback-01",
        issue: "Side setback encroachment: Window W2 relocated within 5.0 ft of east property line",
        detail: `Relocating Window W2 ${offsetMm}mm (~11.8 inches) east towards the lot boundary places the window and required 36-inch egress window well within 5.0 ft of the east side property line. Section 201.3 mandates a minimum 6.0 ft side yard setback in R-1 districts. The 1.0 ft encroachment exceeds the 6-inch administrative waiver limit under Section 201.8 and requires a formal variance.`,
        clauseId: "SB-203",
        clauseCitation: "Section 201.3 — Minimum side setback: 6 feet (R-1 Single Family Residential)",
        evidence: 'Window W2 & Window Well WW-02 (east exterior wall) — parsed side setback: 5.0 ft (min required: 6.0 ft)',
        severity: "blocking",
        source: "written_code",
        confidence: 0.98,
        isRippleEffect: true,
        rippleLabel: "Surfaced by recheck",
      },
    ];

    // Score calculation:
    // Original bp-blocking had 4 blocking findings (score = 100 - 4*20 = 20).
    // 2 egress findings resolved (f-b-001, f-b-002), leaving f-b-003, f-b-004 (2 blocking).
    // 1 new setback blocking finding added (f-ripple-setback-01).
    // Total remaining active blocking = 3.
    // Updated score = 100 - (3 * 20) = 40.
    const updatedReadinessScore = 40;

    return {
      resolvedFindingIds,
      newFindings,
      updatedReadinessScore,
      windowPosition: {
        before: { x: 120, y: 160, distanceToBoundaryFt: 6.0 },
        after: { x: 175, y: 160, distanceToBoundaryFt: 5.0 },
      },
    };
  }
}

/**
 * LiveRippleEffectSource (Stub)
 *
 * Future Pipeline Architecture:
 * 1. Geometric Mutation: Clone the current blueprint fixture and apply the spatial delta
 *    (+offsetMm along the X axis) to Window W2, recalculating exterior wall clearances and
 *    minimum window well projection coordinates.
 * 2. Targeted Retrieval: Re-derive affected topics (egress dimensions, side setbacks, lot coverage)
 *    and fetch applicable regulation clauses via Regulation Retriever.
 * 3. Multi-Agent Evaluation:
 *    - Compliance Checker validates new dimensions against FE-102, SB-203, and SB-208.
 *    - Historical Pattern Agent checks local waiver thresholds and reviewer precedents.
 * 4. Finding Diff Engine:
 *    - Intersects before and after finding sets.
 *    - Marks previously failed egress checks as resolvedFindingIds.
 *    - Flags newly triggered setback violations as newFindings (isRippleEffect: true).
 * 5. Readiness Metric: Recomputes the Approval Readiness Score from active findings.
 */
export class LiveRippleEffectSource implements RippleEffectSource {
  async runMoveWindowEast(blueprintId: string, offsetMm: number): Promise<RippleEffectResult> {
    console.warn(
      "[LiveRippleEffectSource] Live multi-agent geometry pipeline is not yet wired to live CAD engine. Falling back to MockRippleEffectSource."
    );
    // Currently delegates to mock implementation until CAD geometry engine is wired
    const mock = new MockRippleEffectSource();
    return mock.runMoveWindowEast(blueprintId, offsetMm);
  }
}

// Single configuration toggle to switch between mock and live implementation
export const USE_LIVE_RIPPLE = false;

export const rippleEffectSource: RippleEffectSource = USE_LIVE_RIPPLE
  ? new LiveRippleEffectSource()
  : new MockRippleEffectSource();
