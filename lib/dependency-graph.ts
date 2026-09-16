// Dependency Graph — shared element → clause → finding mapping for PraxisCompliance.
// Used by: Ripple Engine (A), Evidence Graph (#2), Change Impact Graph (#9).
// This is a static rule-based graph, not a learned model.

import type { Blueprint, EgressOpening, Room } from "@/fixtures/blueprints";
import type { RegulationClause } from "@/fixtures/regulations";
import type { ComplianceFinding } from "@/lib/schemas";

// --- Dependency Graph Types ---

export interface DependencyNode {
  id: string;
  type: "blueprint_element" | "regulation_clause" | "finding";
  label: string;
}

export interface DependencyEdge {
  from: string; // node id
  to: string;   // node id
  relation: "governed_by" | "produces" | "affects";
}

export interface DependencyGraph {
  nodes: DependencyNode[];
  edges: DependencyEdge[];
}

// --- Element-to-Clause Mapping Rules ---
// These rules define which regulation clauses are affected when a given
// blueprint element type/property changes.

interface MappingRule {
  elementType: string;
  properties: string[];        // which properties trigger this mapping
  clauseIds: string[];         // which regulation clauses are affected
  topics: string[];            // topics for regulation retrieval
}

const ELEMENT_CLAUSE_RULES: MappingRule[] = [
  {
    elementType: "window",
    properties: ["clearWidthInches", "clearHeightInches", "sillHeightFromFloorInches"],
    clauseIds: ["FE-102", "FE-103", "FE-107", "FE-108"],
    topics: ["egress", "fire", "window", "dimensions"],
  },
  {
    elementType: "window",
    properties: ["position.x", "position.y"],
    clauseIds: ["SB-203", "SB-205", "SB-207", "SB-208", "FE-107"],
    topics: ["setback", "zoning", "side", "waiver"],
  },
  {
    elementType: "door",
    properties: ["clearWidthInches", "clearHeightInches"],
    clauseIds: ["FE-104"],
    topics: ["egress", "fire", "door", "width"],
  },
  {
    elementType: "room",
    properties: ["dimensions.width", "dimensions.length", "isSleepingRoom"],
    clauseIds: ["FE-101", "FE-102", "FE-103", "FE-109"],
    topics: ["egress", "fire", "smoke", "alarm"],
  },
  {
    elementType: "room",
    properties: ["floorLevel"],
    clauseIds: ["FE-102", "FE-103", "FE-107"],
    topics: ["egress", "basement", "window", "well"],
  },
  {
    elementType: "setback",
    properties: ["front"],
    clauseIds: ["SB-202"],
    topics: ["setback", "zoning", "front"],
  },
  {
    elementType: "setback",
    properties: ["side"],
    clauseIds: ["SB-203", "SB-205", "SB-207", "SB-208"],
    topics: ["setback", "zoning", "side", "waiver"],
  },
  {
    elementType: "setback",
    properties: ["rearLeft", "rearRight"],
    clauseIds: ["SB-204"],
    topics: ["setback", "zoning", "rear"],
  },
  {
    elementType: "wall",
    properties: ["position", "length"],
    clauseIds: ["SB-203", "SB-205", "SB-207", "FE-105"],
    topics: ["setback", "hallway", "corridor"],
  },
];

/**
 * Get all regulation clause IDs affected by a change to the given element type and property.
 */
export function getAffectedClauseIds(elementType: string, property: string): string[] {
  const clauseIds = new Set<string>();
  for (const rule of ELEMENT_CLAUSE_RULES) {
    if (rule.elementType === elementType && rule.properties.includes(property)) {
      for (const id of rule.clauseIds) {
        clauseIds.add(id);
      }
    }
  }
  return Array.from(clauseIds);
}

/**
 * Get topics relevant to a change, for use with the Regulation Retriever.
 */
export function getAffectedTopics(elementType: string, property: string): string[] {
  const topics = new Set<string>();
  for (const rule of ELEMENT_CLAUSE_RULES) {
    if (rule.elementType === elementType && rule.properties.includes(property)) {
      for (const t of rule.topics) {
        topics.add(t);
      }
    }
  }
  return Array.from(topics);
}

/**
 * Get all findings that cite any of the given clause IDs.
 */
export function getAffectedFindings(
  findings: ComplianceFinding[],
  clauseIds: string[]
): ComplianceFinding[] {
  return findings.filter((f) => clauseIds.includes(f.clauseId));
}

/**
 * Get all downstream clause IDs and findings for a given blueprint element.
 * Returns the full dependency chain.
 */
export function getDownstream(
  elementType: string,
  property: string,
  findings: ComplianceFinding[]
): { clauseIds: string[]; findings: ComplianceFinding[] } {
  const clauseIds = getAffectedClauseIds(elementType, property);
  const affected = getAffectedFindings(findings, clauseIds);
  return { clauseIds, findings: affected };
}

/**
 * Build a full dependency graph for a blueprint and its findings.
 * Maps every element → clauses it's governed by → findings produced.
 */
export function buildDependencyGraph(
  blueprint: Blueprint,
  clauses: RegulationClause[],
  findings: ComplianceFinding[]
): DependencyGraph {
  const nodes: DependencyNode[] = [];
  const edges: DependencyEdge[] = [];
  const nodeIds = new Set<string>();

  function addNode(node: DependencyNode) {
    if (!nodeIds.has(node.id)) {
      nodeIds.add(node.id);
      nodes.push(node);
    }
  }

  // Add blueprint element nodes
  for (const room of blueprint.rooms) {
    addNode({ id: `room:${room.id}`, type: "blueprint_element", label: room.name });
    for (const opening of room.egressOpenings) {
      const openingId = opening.id || `${room.id}-opening`;
      addNode({
        id: `opening:${openingId}`,
        type: "blueprint_element",
        label: `${opening.type} ${openingId} (${room.name}, ${opening.wall} wall)`,
      });
    }
  }

  // Add setback element nodes
  for (const [side, value] of Object.entries(blueprint.setbacks)) {
    addNode({
      id: `setback:${side}`,
      type: "blueprint_element",
      label: `${side} setback (${value} ft)`,
    });
  }

  // Add clause nodes
  for (const clause of clauses) {
    addNode({
      id: `clause:${clause.id}`,
      type: "regulation_clause",
      label: `${clause.section} — ${clause.title}`,
    });
  }

  // Add finding nodes
  for (const finding of findings) {
    addNode({
      id: `finding:${finding.id}`,
      type: "finding",
      label: finding.issue,
    });
  }

  // Build edges: elements → clauses (governed_by)
  for (const room of blueprint.rooms) {
    for (const opening of room.egressOpenings) {
      const openingId = opening.id || `${room.id}-opening`;
      // Window/door openings are governed by egress clauses
      const govClauses = getAffectedClauseIds(opening.type, "clearWidthInches");
      for (const cid of govClauses) {
        if (nodeIds.has(`clause:${cid}`)) {
          edges.push({
            from: `opening:${openingId}`,
            to: `clause:${cid}`,
            relation: "governed_by",
          });
        }
      }
    }
  }

  // Build edges: setbacks → clauses
  for (const [side] of Object.entries(blueprint.setbacks)) {
    const govClauses = getAffectedClauseIds("setback", side);
    for (const cid of govClauses) {
      if (nodeIds.has(`clause:${cid}`)) {
        edges.push({
          from: `setback:${side}`,
          to: `clause:${cid}`,
          relation: "governed_by",
        });
      }
    }
  }

  // Build edges: clauses → findings (produces)
  for (const finding of findings) {
    if (nodeIds.has(`clause:${finding.clauseId}`)) {
      edges.push({
        from: `clause:${finding.clauseId}`,
        to: `finding:${finding.id}`,
        relation: "produces",
      });
    }
  }

  return { nodes, edges };
}
