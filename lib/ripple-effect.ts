// Ripple Effect Provider Abstraction for PraxisCompliance.
// Generalized beyond the original "move window east" hardcoded demo.
//
// Provider interface:
//   - runMoveWindowEast()       — keeps the existing demo button working
//   - runSimulatedChange()      — general method for any BlueprintChange
//
// Implementations:
//   - MockRippleEffectSource    — deterministic rule-based engine (offline demo)
//   - LiveRippleEffectSource    — clones blueprint → re-runs retriever → compliance checker
//                                 with Zod-validate → retry → fallback to mock

import type { Blueprint, EgressOpening } from "@/fixtures/blueprints";
import { getBlueprintById } from "@/fixtures/blueprints";
import { FALLBACKS } from "@/fixtures/fallbacks";
import type { ComplianceFinding, BlueprintChange, ComplianceResult } from "@/lib/schemas";
import { ComplianceResultSchema } from "@/lib/schemas";
import { retrieveRegulations, deriveTopics } from "@/lib/retriever";
import { LEARNED_PATTERNS } from "@/fixtures/learned-patterns";
import { calculateReadinessScore } from "@/app/components/ApprovalReadinessGauge";

// ===== Result Type (unchanged shape from original, plus affectedClauseIds) =====

export type RippleEffectResult = {
  resolvedFindingIds: string[];
  newFindings: ComplianceFinding[];
  updatedReadinessScore: number;
  affectedClauseIds: string[];
  change: BlueprintChange;
  windowPosition?: {
    before: { x: number; y: number; distanceToBoundaryFt: number };
    after: { x: number; y: number; distanceToBoundaryFt: number };
  };
};

// ===== Provider Interface =====

export interface RippleEffectSource {
  /** General method: simulate any BlueprintChange against any blueprint. */
  runSimulatedChange(blueprintId: string, change: BlueprintChange): Promise<RippleEffectResult>;

  /** Legacy method: keeps the existing "Move window 300mm east" button working. */
  runMoveWindowEast(blueprintId: string, offsetMm: number): Promise<RippleEffectResult>;
}

// ===== Helpers: apply a BlueprintChange to a cloned blueprint =====

function convertDelta(delta: number, unit: "mm" | "in" | "ft", targetUnit: "in"): number {
  if (unit === "in") return delta;
  if (unit === "mm") return delta / 25.4;
  if (unit === "ft") return delta * 12;
  return delta;
}

function convertDeltaToFt(delta: number, unit: "mm" | "in" | "ft"): number {
  if (unit === "ft") return delta;
  if (unit === "in") return delta / 12;
  if (unit === "mm") return delta / 304.8;
  return delta;
}

function applyChange(blueprint: Blueprint, change: BlueprintChange): Blueprint {
  const clone: Blueprint = JSON.parse(JSON.stringify(blueprint));
  const deltaIn = convertDelta(change.delta, change.unit, "in");
  const deltaFt = convertDeltaToFt(change.delta, change.unit);

  // Try to find the element across rooms
  for (const room of clone.rooms) {
    for (const opening of room.egressOpenings) {
      if (opening.id === change.elementId) {
        switch (change.property) {
          case "width":
            opening.clearWidthInches = Math.max(0, opening.clearWidthInches + deltaIn);
            break;
          case "height":
            opening.clearHeightInches = Math.max(0, opening.clearHeightInches + deltaIn);
            break;
          case "sillHeight":
            opening.sillHeightFromFloorInches = Math.max(0, opening.sillHeightFromFloorInches + deltaIn);
            break;
          case "position":
            // Moving an element toward a boundary reduces the setback.
            // Convention: positive delta = toward the nearest side boundary.
            clone.setbacks.side = Math.max(0, clone.setbacks.side - Math.abs(deltaFt));
            break;
        }
        return clone;
      }
    }
  }

  // Maybe it's a room-level or setback-level element
  if (change.elementId.startsWith("setback-") || change.elementId === "side" || change.elementId === "front") {
    const key = change.elementId.replace("setback-", "") as keyof typeof clone.setbacks;
    if (key in clone.setbacks) {
      (clone.setbacks as Record<string, number>)[key] += deltaFt;
    }
  }

  return clone;
}

// ===== Compliance Evaluation Engine =====

function evaluateEgress(opening: EgressOpening, room: { id: string; name: string; floorLevel: string; isSleepingRoom: boolean }): ComplianceFinding[] {
  if (!room.isSleepingRoom) return [];
  const findings: ComplianceFinding[] = [];
  const eid = opening.id || `${room.id}-opening`;
  const isBasement = room.floorLevel === "basement";
  const wallLabel = opening.wall ? `(${opening.wall} wall)` : "";
  const minArea = isBasement ? 5.7 : 5.0;

  if (opening.clearWidthInches < 20) {
    findings.push({
      id: `f-re-width-${eid}`, issue: `Egress window width is ${opening.clearWidthInches} inches — below the 20-inch minimum`,
      detail: `The emergency escape opening for ${room.name} has a net clear width of ${opening.clearWidthInches} inches. Section 101.2 requires a minimum of 20 inches.`,
      clauseId: "FE-102", clauseCitation: "Section 101.2 — Minimum net clear opening width: 20 inches",
      evidence: `Window ${eid}, ${room.name} ${wallLabel} — parsed net clear opening: ${opening.clearWidthInches}" × ${opening.clearHeightInches}"`,
      elementId: eid, severity: "blocking", source: "written_code", confidence: 0.99,
    });
  }
  if (opening.clearHeightInches < 24) {
    findings.push({
      id: `f-re-height-${eid}`, issue: `Egress window height is ${opening.clearHeightInches} inches — below the 24-inch minimum`,
      detail: `The emergency escape opening for ${room.name} has a net clear height of ${opening.clearHeightInches} inches. Section 101.2 requires a minimum of 24 inches.`,
      clauseId: "FE-102", clauseCitation: "Section 101.2 — Minimum net clear opening height: 24 inches",
      evidence: `Window ${eid}, ${room.name} ${wallLabel} — parsed net clear opening: ${opening.clearWidthInches}" × ${opening.clearHeightInches}"`,
      elementId: eid, severity: "blocking", source: "written_code", confidence: 0.99,
    });
  }
  if (opening.sillHeightFromFloorInches > 44) {
    findings.push({
      id: `f-re-sill-${eid}`, issue: `Egress window sill height is ${opening.sillHeightFromFloorInches} inches — exceeds 44-inch maximum`,
      detail: `The sill height above finished floor is ${opening.sillHeightFromFloorInches} inches. Section 101.2 sets a maximum of 44 inches.`,
      clauseId: "FE-102", clauseCitation: "Section 101.2 — Maximum sill height: 44 inches above finished floor",
      evidence: `Window ${eid}, ${room.name} ${wallLabel} — parsed sill height: ${opening.sillHeightFromFloorInches}" above finished floor`,
      elementId: eid, severity: "blocking", source: "written_code", confidence: 0.98,
    });
  }
  const area = (opening.clearWidthInches * opening.clearHeightInches) / 144;
  if (area < minArea) {
    findings.push({
      id: `f-re-area-${eid}`, issue: `Egress opening area is ${area.toFixed(1)} sq ft — below the ${minArea} sq ft minimum`,
      detail: `The net clear opening area for ${room.name} is ${area.toFixed(1)} sq ft. ${isBasement ? "Basement" : "Ground/upper"} sleeping rooms require ${minArea} sq ft.`,
      clauseId: isBasement ? "FE-102" : "FE-103",
      clauseCitation: `Section ${isBasement ? "101.2" : "101.3"} — Minimum net clear opening area: ${minArea} sq ft`,
      evidence: `Window ${eid}, ${room.name} ${wallLabel} — parsed area: ${area.toFixed(1)} sq ft`,
      elementId: eid, severity: "blocking", source: "written_code", confidence: 0.97,
    });
  }
  return findings;
}

function evaluateSetbacks(bp: Blueprint): ComplianceFinding[] {
  const findings: ComplianceFinding[] = [];
  const isR1 = bp.zoneDistrict === "R-1";
  const minSide = isR1 ? 6.0 : 8.0;

  if (bp.setbacks.side < minSide) {
    const deficit = minSide - bp.setbacks.side;
    const deficitIn = deficit * 12;
    const canWaive = deficitIn <= 6;
    findings.push({
      id: "f-re-setback-side",
      issue: `Side setback is ${bp.setbacks.side.toFixed(2)} ft — ${deficit.toFixed(2)} ft below the ${minSide}-ft minimum`,
      detail: canWaive
        ? `The side setback encroachment of ${deficitIn.toFixed(1)} inches is within the 6-inch administrative waiver threshold (Section 201.8).`
        : `The side setback encroachment of ${deficitIn.toFixed(1)} inches exceeds the 6-inch waiver limit. A formal variance is required.`,
      clauseId: isR1 ? "SB-203" : "SB-205",
      clauseCitation: `Section ${isR1 ? "201.3" : "201.5"} — Minimum side setback: ${minSide} feet`,
      elementId: "setback-side",
      severity: canWaive ? "advisory" : "blocking",
      source: canWaive ? "learned_pattern" : "written_code",
      confidence: canWaive ? 0.92 : 0.98,
      isRippleEffect: true,
      rippleLabel: "Surfaced by recheck",
    });
  }

  if (isR1 && bp.setbacks.front < 25) {
    findings.push({
      id: "f-re-setback-front",
      issue: `Front setback is ${bp.setbacks.front} ft — below the 25-ft minimum`,
      detail: `Front setback of ${bp.setbacks.front} ft violates the 25-ft minimum per Section 201.2.`,
      clauseId: "SB-202", clauseCitation: "Section 201.2 — Minimum front setback: 25 feet (R-1)",
      elementId: "setback-front", severity: "blocking", source: "written_code", confidence: 0.98,
      isRippleEffect: true, rippleLabel: "Surfaced by recheck",
    });
  }

  return findings;
}

/** Run the full compliance evaluation on a (possibly modified) blueprint.
 *  Returns the same ComplianceFinding[] shape as the Compliance Checker API. */
function evaluateBlueprint(blueprint: Blueprint): ComplianceFinding[] {
  const findings: ComplianceFinding[] = [];
  for (const room of blueprint.rooms) {
    for (const opening of room.egressOpenings) {
      findings.push(...evaluateEgress(opening, room));
    }
  }
  findings.push(...evaluateSetbacks(blueprint));
  return findings;
}

/** Diff before and after finding sets to identify resolved + new findings. */
function diffFindings(
  originalFindings: ComplianceFinding[],
  reEvalFindings: ComplianceFinding[]
): { resolvedFindingIds: string[]; newFindings: ComplianceFinding[] } {
  const resolvedFindingIds: string[] = [];

  // An original finding is resolved if no re-eval finding covers the same clause + element
  for (const orig of originalFindings) {
    const stillFailing = reEvalFindings.some(
      (nf) => nf.clauseId === orig.clauseId && nf.elementId === orig.elementId
    );
    if (!stillFailing) {
      resolvedFindingIds.push(orig.id);
    }
  }

  // A re-eval finding is new if no unresolved original covers the same clause + element
  const genuinelyNew = reEvalFindings
    .filter((nf) => !originalFindings.some(
      (orig) => orig.clauseId === nf.clauseId && orig.elementId === nf.elementId
        && !resolvedFindingIds.includes(orig.id)
    ))
    .map((f) => ({ ...f, isRippleEffect: true, rippleLabel: "Surfaced by recheck" }));

  return { resolvedFindingIds, newFindings: genuinelyNew };
}

/** Identify which clause IDs are affected by the change. */
function getAffectedClauseIds(change: BlueprintChange): string[] {
  // Map property types to potentially affected clause families
  const clauseMap: Record<string, string[]> = {
    width: ["FE-102", "FE-103"],
    height: ["FE-102", "FE-103"],
    sillHeight: ["FE-102"],
    position: ["SB-203", "SB-205", "SB-207", "SB-208", "FE-107"],
  };
  return clauseMap[change.property] || [];
}

// ===== MockRippleEffectSource =====

export class MockRippleEffectSource implements RippleEffectSource {
  async runSimulatedChange(blueprintId: string, change: BlueprintChange): Promise<RippleEffectResult> {
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const blueprint = getBlueprintById(blueprintId);
    if (!blueprint) throw new Error(`Blueprint '${blueprintId}' not found`);

    const originalFindings = FALLBACKS[blueprintId]?.findings || [];
    const modified = applyChange(blueprint, change);
    const reEvalFindings = evaluateBlueprint(modified);
    const { resolvedFindingIds, newFindings } = diffFindings(originalFindings, reEvalFindings);

    const remaining = originalFindings.filter((f) => !resolvedFindingIds.includes(f.id));
    const allActive = [...remaining, ...newFindings];
    const blocking = allActive.filter((f) => f.severity === "blocking").length;
    const advisory = allActive.filter((f) => f.severity === "advisory").length;

    const affectedClauseIds = getAffectedClauseIds(change);

    // For the "move window east" scenario, include windowPosition for the floor plan
    let windowPosition: RippleEffectResult["windowPosition"] = undefined;
    if (change.property === "position" && change.elementId === "W2") {
      const deltaFt = convertDeltaToFt(change.delta, change.unit);
      windowPosition = {
        before: { x: 120, y: 160, distanceToBoundaryFt: blueprint.setbacks.side },
        after: { x: 175, y: 160, distanceToBoundaryFt: modified.setbacks.side },
      };
    }

    return {
      resolvedFindingIds,
      newFindings,
      updatedReadinessScore: calculateReadinessScore(blocking, advisory),
      affectedClauseIds,
      change,
      windowPosition,
    };
  }

  async runMoveWindowEast(blueprintId: string, offsetMm: number): Promise<RippleEffectResult> {
    return this.runSimulatedChange(blueprintId, {
      elementId: "W2",
      property: "position",
      delta: offsetMm,
      unit: "mm",
    });
  }
}

// ===== LiveRippleEffectSource =====
// Actual recheck pipeline:
// 1. Clone blueprint and apply the change
// 2. Re-run Regulation Retriever on modified blueprint
// 3. Re-run Compliance Checker (LLM call with Zod-validate → retry → fallback to mock)
// 4. Diff findings
// 5. Return RippleEffectResult

export class LiveRippleEffectSource implements RippleEffectSource {
  async runSimulatedChange(blueprintId: string, change: BlueprintChange): Promise<RippleEffectResult> {
    const blueprint = getBlueprintById(blueprintId);
    if (!blueprint) throw new Error(`Blueprint '${blueprintId}' not found`);

    const originalFindings = FALLBACKS[blueprintId]?.findings || [];
    const modified = applyChange(blueprint, change);

    // Step 1: Re-run the Regulation Retriever on the modified blueprint
    const topics = deriveTopics(modified);
    const clauses = retrieveRegulations(topics);

    // Step 2: Attempt the live compliance check via the API
    //         Uses the same Zod-validate → retry → fallback pattern as lib/llm.ts
    let liveResult: ComplianceResult | null = null;
    try {
      const res = await fetch("/api/compliance-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blueprintId, _modifiedBlueprint: modified }),
      });
      if (res.ok) {
        const data = await res.json();
        const parsed = ComplianceResultSchema.safeParse(data);
        if (parsed.success) {
          liveResult = parsed.data;
        }
      }
    } catch {
      console.warn("[LiveRippleEffectSource] Live compliance check failed, falling back to mock.");
    }

    // Step 3: If live check succeeded, diff the live findings against originals
    if (liveResult) {
      const { resolvedFindingIds, newFindings } = diffFindings(originalFindings, liveResult.findings);
      const remaining = originalFindings.filter((f) => !resolvedFindingIds.includes(f.id));
      const allActive = [...remaining, ...newFindings];
      const blocking = allActive.filter((f) => f.severity === "blocking").length;
      const advisory = allActive.filter((f) => f.severity === "advisory").length;

      return {
        resolvedFindingIds,
        newFindings,
        updatedReadinessScore: calculateReadinessScore(blocking, advisory),
        affectedClauseIds: getAffectedClauseIds(change),
        change,
      };
    }

    // Fallback to mock result (Zod-validate → retry → fallback pattern)
    console.log("[LiveRippleEffectSource] Using mock fallback for this interaction.");
    const mock = new MockRippleEffectSource();
    return mock.runSimulatedChange(blueprintId, change);
  }

  async runMoveWindowEast(blueprintId: string, offsetMm: number): Promise<RippleEffectResult> {
    return this.runSimulatedChange(blueprintId, {
      elementId: "W2",
      property: "position",
      delta: offsetMm,
      unit: "mm",
    });
  }
}

// ===== Configuration Toggle =====
export const USE_LIVE_RIPPLE = false;

export const rippleEffectSource: RippleEffectSource = USE_LIVE_RIPPLE
  ? new LiveRippleEffectSource()
  : new MockRippleEffectSource();
