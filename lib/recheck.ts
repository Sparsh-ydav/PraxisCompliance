// Recheck Loop — Generalized compliance re-evaluation after proposed changes.
// Accepts BlueprintChange[] and delegates to the Ripple Engine's runSimulatedChange().
// Aggregates results across multiple changes into a combined diff.

import { getBlueprintById } from "@/fixtures/blueprints";
import { FALLBACKS } from "@/fixtures/fallbacks";
import type { ComplianceFinding, BlueprintChange } from "@/lib/schemas";
import { rippleEffectSource, type RippleEffectResult } from "@/lib/ripple-effect";

export interface RecheckResult {
  blueprintId: string;
  changes: BlueprintChange[];
  results: RippleEffectResult[];
  allResolvedFindingIds: string[];
  allNewFindings: ComplianceFinding[];
  finalReadinessScore: number;
  originalFindings: ComplianceFinding[];
  finalFindings: ComplianceFinding[];
}

/**
 * Run the full recheck loop for one or more changes against a blueprint.
 * Each change is simulated independently through the Ripple Engine,
 * then results are aggregated into a combined before/after diff.
 */
export async function recheckCompliance(
  blueprintId: string,
  changes: BlueprintChange[]
): Promise<RecheckResult> {
  const blueprint = getBlueprintById(blueprintId);
  if (!blueprint) {
    throw new Error(`Blueprint '${blueprintId}' not found`);
  }

  const originalFindings = FALLBACKS[blueprintId]?.findings || [];

  // Run each change through the ripple engine
  const results: RippleEffectResult[] = [];
  for (const change of changes) {
    const result = await rippleEffectSource.runSimulatedChange(blueprintId, change);
    results.push(result);
  }

  // Aggregate resolved findings (union)
  const allResolvedIds = new Set<string>();
  for (const r of results) {
    for (const id of r.resolvedFindingIds) {
      allResolvedIds.add(id);
    }
  }

  // Aggregate new findings (deduplicate by clauseId + elementId)
  const seenNew = new Map<string, ComplianceFinding>();
  for (const r of results) {
    for (const f of r.newFindings) {
      const key = `${f.clauseId}:${f.elementId || f.id}`;
      if (!seenNew.has(key)) seenNew.set(key, f);
    }
  }
  const allNewFindings = Array.from(seenNew.values());

  // Build final findings list
  const remaining = originalFindings.filter((f) => !allResolvedIds.has(f.id));
  const finalFindings = [...remaining, ...allNewFindings];

  const blocking = finalFindings.filter((f) => f.severity === "blocking" && !f.resolved).length;
  const advisory = finalFindings.filter((f) => f.severity === "advisory" && !f.resolved).length;
  const finalReadinessScore = Math.max(0, 100 - blocking * 20 - advisory * 5);

  return {
    blueprintId,
    changes,
    results,
    allResolvedFindingIds: Array.from(allResolvedIds),
    allNewFindings,
    finalReadinessScore,
    originalFindings,
    finalFindings,
  };
}
