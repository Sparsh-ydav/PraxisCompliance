// Regulation Retriever — keyword-based retrieval over synthetic regulation clauses.
// For the MVP demo this uses simple topic matching; a production build would use embeddings.

import { REGULATIONS, type RegulationClause } from "@/fixtures/regulations";

const EGRESS_KEYWORDS = [
  "egress", "escape", "rescue", "opening", "window", "door", "hallway",
  "corridor", "smoke", "alarm", "stair", "exit", "sill",
];

const SETBACK_KEYWORDS = [
  "setback", "zoning", "front", "side", "rear", "yard", "property line",
  "waiver", "variance", "coverage", "impervious", "height", "accessory",
];

function scoreClause(clause: RegulationClause, topics: string[]): number {
  const topicsLower = topics.map((t) => t.toLowerCase());
  let score = 0;

  for (const topic of topicsLower) {
    if (clause.topics.some((t) => t.includes(topic) || topic.includes(t))) {
      score += 2;
    }
    if (clause.text.toLowerCase().includes(topic)) score += 1;
    if (clause.title.toLowerCase().includes(topic)) score += 1;
  }

  // Boost egress clauses for egress-related topics
  if (topicsLower.some((t) => EGRESS_KEYWORDS.includes(t))) {
    if (clause.id.startsWith("FE-")) score += 1;
  }

  // Boost setback clauses for setback-related topics
  if (topicsLower.some((t) => SETBACK_KEYWORDS.includes(t))) {
    if (clause.id.startsWith("SB-")) score += 1;
  }

  return score;
}

/**
 * Retrieve the most relevant regulation clauses for the given topics.
 * Returns all clauses with a score > 0, sorted by relevance.
 */
export function retrieveRegulations(topics: string[]): RegulationClause[] {
  return REGULATIONS.filter((c) => scoreClause(c, topics) > 0)
    .sort((a, b) => scoreClause(b, topics) - scoreClause(a, topics));
}

/**
 * Derive relevant topics from a blueprint's characteristics.
 */
export function deriveTopics(blueprint: {
  rooms: Array<{ isSleepingRoom: boolean; floorLevel: string; egressOpenings: unknown[] }>;
  setbacks: Record<string, number>;
  primaryExitDoorWidthInches: number;
  hallwayWidthInches: number;
}): string[] {
  const topics = new Set<string>(["egress", "setback"]);

  const hasSleepingRoom = blueprint.rooms.some((r) => r.isSleepingRoom);
  const hasBasement = blueprint.rooms.some((r) => r.floorLevel === "basement");

  if (hasSleepingRoom) {
    topics.add("fire");
    topics.add("smoke");
    topics.add("alarm");
    topics.add("window");
  }
  if (hasBasement) {
    topics.add("basement");
    topics.add("well");
  }

  const minSetback = Math.min(...Object.values(blueprint.setbacks));
  if (minSetback < 8) {
    topics.add("side");
    topics.add("zoning");
    topics.add("waiver");
  }

  return Array.from(topics);
}
