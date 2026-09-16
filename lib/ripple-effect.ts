// Generalized Ripple Effect Engine for PraxisCompliance.
// Accepts an arbitrary ProposedChange against any blueprint and returns
// which findings it resolves, which new findings it surfaces, and which clauses are affected.
//
// Provider abstraction: MockRippleEffectSource (rule-based) and LiveRippleEffectSource (stub).
// The Mock implementation clones the blueprint, applies the property change,
// re-evaluates affected compliance rules, and diffs before/after findings.

import type { Blueprint, EgressOpening } from "@/fixtures/blueprints";
import { getBlueprintById, BLUEPRINTS } from "@/fixtures/blueprints";
import { FALLBACKS } from "@/fixtures/fallbacks";
import type { ComplianceFinding, ProposedChange, RippleSimulationResult } from "@/lib/schemas";
import { getAffectedClauseIds, getAffectedFindings } from "@/lib/dependency-graph";
import { calculateReadinessScore } from "@/app/components/ApprovalReadinessGauge";

// ===== Provider Interface =====

export interface RippleEffectSource {
  /**
   * Simulate an arbitrary proposed change against a blueprint and return
   * the compliance impact: resolved findings, new findings, affected clauses.
   */
  simulateChange(change: ProposedChange): Promise<RippleSimulationResult>;

  /**
   * Legacy method for backward compatibility with the basement bedroom demo.
   * Delegates to simulateChange() internally.
   */
  runMoveWindowEast(blueprintId: string, offsetMm: number): Promise<RippleSimulationResult>;
}

// ===== Rule-Based Compliance Evaluation Helpers =====

/**
 * Evaluate egress opening dimensions against FE-102 requirements.
 * Returns any blocking findings that apply.
 */
function evaluateEgressCompliance(
  opening: EgressOpening,
  room: { id: string; name: string; floorLevel: string; isSleepingRoom: boolean }
): ComplianceFinding[] {
  if (!room.isSleepingRoom) return [];

  const findings: ComplianceFinding[] = [];
  const openingId = opening.id || `${room.id}-opening`;
  const isBasement = room.floorLevel === "basement";
  const minArea = isBasement ? 5.7 : 5.0;
  const wallLabel = opening.wall ? `(${opening.wall} wall)` : "";

  // Width check: minimum 20 inches
  if (opening.clearWidthInches < 20) {
    findings.push({
      id: `f-gen-width-${openingId}`,
      issue: `Egress window width is ${opening.clearWidthInches} inches — below the 20-inch minimum`,
      detail: `The emergency escape opening for ${room.name} has a net clear width of ${opening.clearWidthInches} inches. Section 101.2 requires a minimum of 20 inches.`,
      clauseId: "FE-102",
      clauseCitation: "Section 101.2 — Minimum net clear opening width: 20 inches",
      evidence: `${opening.type === "window" ? "Window" : "Door"} ${openingId}, ${room.name} ${wallLabel} — parsed net clear opening: ${opening.clearWidthInches}" × ${opening.clearHeightInches}"`,
      elementId: openingId,
      severity: "blocking",
      source: "written_code",
      confidence: 0.99,
    });
  }

  // Height check: minimum 24 inches
  if (opening.clearHeightInches < 24) {
    findings.push({
      id: `f-gen-height-${openingId}`,
      issue: `Egress window height is ${opening.clearHeightInches} inches — below the 24-inch minimum`,
      detail: `The emergency escape opening for ${room.name} has a net clear height of ${opening.clearHeightInches} inches. Section 101.2 requires a minimum of 24 inches.`,
      clauseId: "FE-102",
      clauseCitation: "Section 101.2 — Minimum net clear opening height: 24 inches",
      evidence: `${opening.type === "window" ? "Window" : "Door"} ${openingId}, ${room.name} ${wallLabel} — parsed net clear opening: ${opening.clearWidthInches}" × ${opening.clearHeightInches}"`,
      elementId: openingId,
      severity: "blocking",
      source: "written_code",
      confidence: 0.99,
    });
  }

  // Sill height check: maximum 44 inches
  if (opening.sillHeightFromFloorInches > 44) {
    findings.push({
      id: `f-gen-sill-${openingId}`,
      issue: `Egress window sill height is ${opening.sillHeightFromFloorInches} inches — exceeds 44-inch maximum`,
      detail: `The sill height above finished floor is ${opening.sillHeightFromFloorInches} inches. Section 101.2 sets a maximum of 44 inches.`,
      clauseId: "FE-102",
      clauseCitation: "Section 101.2 — Maximum sill height: 44 inches above finished floor",
      evidence: `${opening.type === "window" ? "Window" : "Door"} ${openingId}, ${room.name} ${wallLabel} — parsed sill height: ${opening.sillHeightFromFloorInches}" above finished floor`,
      elementId: openingId,
      severity: "blocking",
      source: "written_code",
      confidence: 0.98,
    });
  }

  // Area check
  const areaSqFt = (opening.clearWidthInches * opening.clearHeightInches) / 144;
  if (areaSqFt < minArea) {
    findings.push({
      id: `f-gen-area-${openingId}`,
      issue: `Egress opening area is ${areaSqFt.toFixed(1)} sq ft — below the ${minArea} sq ft minimum`,
      detail: `The net clear opening area for ${room.name} is ${areaSqFt.toFixed(1)} sq ft (${opening.clearWidthInches}" × ${opening.clearHeightInches}"). ${isBasement ? "Basement" : "Ground/upper floor"} sleeping rooms require a minimum of ${minArea} sq ft.`,
      clauseId: isBasement ? "FE-102" : "FE-103",
      clauseCitation: `${isBasement ? "Section 101.2" : "Section 101.3"} — Minimum net clear opening area: ${minArea} sq ft`,
      evidence: `${opening.type === "window" ? "Window" : "Door"} ${openingId}, ${room.name} ${wallLabel} — parsed area: ${areaSqFt.toFixed(1)} sq ft`,
      elementId: openingId,
      severity: "blocking",
      source: "written_code",
      confidence: 0.97,
    });
  }

  return findings;
}

/**
 * Evaluate setback compliance against SB-203 (side) and SB-202 (front) requirements.
 * Returns any findings that apply.
 */
function evaluateSetbackCompliance(
  blueprint: Blueprint
): ComplianceFinding[] {
  const findings: ComplianceFinding[] = [];
  const isR1 = blueprint.zoneDistrict === "R-1";

  // Side setback (R-1: min 6 ft, R-2: min 8 ft)
  const minSide = isR1 ? 6.0 : 8.0;
  if (blueprint.setbacks.side < minSide) {
    const deficit = minSide - blueprint.setbacks.side;
    const deficitInches = deficit * 12;
    const canWaive = deficitInches <= 6;
    findings.push({
      id: `f-gen-setback-side`,
      issue: `Side setback is ${blueprint.setbacks.side.toFixed(2)} ft — ${deficit.toFixed(2)} ft below the ${minSide}-ft minimum`,
      detail: canWaive
        ? `The side setback is ${(deficit * 12).toFixed(1)} inches below minimum. Section 201.8 allows an administrative waiver for encroachments ≤ 6 inches with a certified survey.`
        : `The side setback encroachment of ${(deficit * 12).toFixed(1)} inches exceeds the 6-inch administrative waiver threshold. A formal variance from the Zoning Board of Appeals is required.`,
      clauseId: isR1 ? "SB-203" : "SB-205",
      clauseCitation: `Section ${isR1 ? "201.3" : "201.5"} — Minimum side setback: ${minSide} feet`,
      elementId: "setback-side",
      severity: canWaive ? "advisory" : "blocking",
      source: canWaive ? "learned_pattern" : "written_code",
      confidence: canWaive ? 0.92 : 0.98,
    });
  }

  // Front setback (R-1: min 25 ft)
  if (isR1 && blueprint.setbacks.front < 25) {
    findings.push({
      id: `f-gen-setback-front`,
      issue: `Front setback is ${blueprint.setbacks.front} ft — below the 25-ft minimum`,
      detail: `The front setback is ${blueprint.setbacks.front} ft, which is below the 25-ft minimum required by Section 201.2.`,
      clauseId: "SB-202",
      clauseCitation: "Section 201.2 — Minimum front setback: 25 feet (R-1)",
      elementId: "setback-front",
      severity: "blocking",
      source: "written_code",
      confidence: 0.98,
    });
  }

  return findings;
}

/**
 * Deep clone a blueprint and apply a proposed change to it.
 */
function applyChangeToBlueprint(blueprint: Blueprint, change: ProposedChange): Blueprint {
  const clone: Blueprint = JSON.parse(JSON.stringify(blueprint));

  switch (change.elementType) {
    case "window":
    case "door": {
      // Find the opening by elementId across all rooms
      for (const room of clone.rooms) {
        for (const opening of room.egressOpenings) {
          if (opening.id === change.elementId) {
            // Apply the property change
            if (change.property === "clearWidthInches") {
              opening.clearWidthInches = Number(change.newValue);
            } else if (change.property === "clearHeightInches") {
              opening.clearHeightInches = Number(change.newValue);
            } else if (change.property === "sillHeightFromFloorInches") {
              opening.sillHeightFromFloorInches = Number(change.newValue);
            } else if (change.property === "position.x") {
              // Position change affects setbacks — simulate side setback reduction
              // For the demo: moving window east reduces side setback
              const offsetFt = (Number(change.newValue) - Number(change.currentValue)) / 304.8;
              clone.setbacks.side = Math.max(0, clone.setbacks.side - offsetFt);
            }
          }
        }
      }
      break;
    }
    case "setback": {
      const side = change.elementId.replace("setback-", "") || change.property;
      if (side in clone.setbacks) {
        (clone.setbacks as Record<string, number>)[side] = Number(change.newValue);
      }
      break;
    }
    case "room": {
      for (const room of clone.rooms) {
        if (room.id === change.elementId) {
          if (change.property === "dimensions.width") {
            room.dimensions.width = Number(change.newValue);
          } else if (change.property === "dimensions.length") {
            room.dimensions.length = Number(change.newValue);
          }
        }
      }
      break;
    }
    case "wall":
      // Wall changes could affect hallway width, setbacks, etc.
      if (change.property === "hallwayWidthInches") {
        clone.hallwayWidthInches = Number(change.newValue);
      }
      break;
  }

  return clone;
}

// ===== Mock Implementation =====

export class MockRippleEffectSource implements RippleEffectSource {
  async simulateChange(change: ProposedChange): Promise<RippleSimulationResult> {
    // Artificial delay to emulate real agent latency
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const blueprint = getBlueprintById(change.blueprintId);
    if (!blueprint) {
      throw new Error(`Blueprint '${change.blueprintId}' not found`);
    }

    // Get the original findings for this blueprint
    const originalFallback = FALLBACKS[change.blueprintId];
    const originalFindings = originalFallback?.findings || [];

    // Get affected clause IDs from the dependency graph
    const affectedClauseIds = getAffectedClauseIds(change.elementType, change.property);

    // Apply the change to get a modified blueprint
    const modifiedBlueprint = applyChangeToBlueprint(blueprint, change);

    // Re-evaluate compliance on the modified blueprint for affected areas
    const newEgressFindings: ComplianceFinding[] = [];
    for (const room of modifiedBlueprint.rooms) {
      for (const opening of room.egressOpenings) {
        const openingId = opening.id || `${room.id}-opening`;
        // Only re-evaluate if this opening or its element is affected
        if (change.elementId === openingId || affectedClauseIds.some(c => c.startsWith("FE-"))) {
          const evalFindings = evaluateEgressCompliance(opening, room);
          newEgressFindings.push(...evalFindings);
        }
      }
    }

    const newSetbackFindings = evaluateSetbackCompliance(modifiedBlueprint);

    // Determine which original findings are resolved
    // A finding is resolved if it was affected AND no corresponding new finding exists
    const resolvedFindingIds: string[] = [];
    const affectedOriginals = getAffectedFindings(originalFindings, affectedClauseIds);
    for (const original of affectedOriginals) {
      // Check if the same type of violation still exists in re-evaluation
      const stillFailing = [...newEgressFindings, ...newSetbackFindings].some(
        (nf) => nf.clauseId === original.clauseId && nf.elementId === original.elementId
      );
      if (!stillFailing) {
        resolvedFindingIds.push(original.id);
      }
    }

    // Determine genuinely NEW findings (not in original set)
    const allNewFindings = [...newEgressFindings, ...newSetbackFindings];
    const genuinelyNew: ComplianceFinding[] = allNewFindings
      .filter((nf) => {
        // Not a re-statement of an existing unresolved finding
        return !originalFindings.some(
          (of) => of.clauseId === nf.clauseId && of.elementId === nf.elementId && !resolvedFindingIds.includes(of.id)
        );
      })
      .map((f) => ({
        ...f,
        isRippleEffect: true,
        rippleLabel: "Surfaced by recheck",
      }));

    // Calculate updated readiness score
    const remainingOriginal = originalFindings.filter(
      (f) => !resolvedFindingIds.includes(f.id)
    );
    const allActiveFindings = [...remainingOriginal, ...genuinelyNew];
    const blockingCount = allActiveFindings.filter((f) => f.severity === "blocking").length;
    const advisoryCount = allActiveFindings.filter((f) => f.severity === "advisory").length;
    const updatedReadinessScore = calculateReadinessScore(blockingCount, advisoryCount);

    return {
      change,
      resolvedFindingIds,
      newFindings: genuinelyNew,
      affectedClauseIds,
      updatedReadinessScore,
      elementDelta: {
        elementId: change.elementId,
        before: { [change.property]: change.currentValue },
        after: { [change.property]: change.newValue },
      },
    };
  }

  /**
   * Legacy method — translates the old "move window east" demo call
   * into a ProposedChange and delegates to simulateChange().
   */
  async runMoveWindowEast(blueprintId: string, offsetMm: number): Promise<RippleSimulationResult> {
    const change: ProposedChange = {
      blueprintId,
      elementType: "window",
      elementId: "W2",
      property: "position.x",
      currentValue: 120,
      newValue: 120 + (offsetMm / 304.8) * 55, // Scale mm to SVG coords
      description: `Move Window W2 ${offsetMm}mm east`,
    };
    return this.simulateChange(change);
  }
}

// ===== Live Implementation (Stub) =====

export class LiveRippleEffectSource implements RippleEffectSource {
  async simulateChange(change: ProposedChange): Promise<RippleSimulationResult> {
    console.warn(
      "[LiveRippleEffectSource] Live multi-agent geometry pipeline is not yet wired. Falling back to MockRippleEffectSource."
    );
    const mock = new MockRippleEffectSource();
    return mock.simulateChange(change);
  }

  async runMoveWindowEast(blueprintId: string, offsetMm: number): Promise<RippleSimulationResult> {
    const mock = new MockRippleEffectSource();
    return mock.runMoveWindowEast(blueprintId, offsetMm);
  }
}

// ===== Configuration Toggle =====

export const USE_LIVE_RIPPLE = false;

export const rippleEffectSource: RippleEffectSource = USE_LIVE_RIPPLE
  ? new LiveRippleEffectSource()
  : new MockRippleEffectSource();
