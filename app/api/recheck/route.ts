// Recheck API route — POST endpoint for the generalized recheck loop.
// Accepts a blueprint ID and an array of BlueprintChange objects,
// runs each through the Ripple Engine, and returns the aggregated diff.

import type { NextRequest } from "next/server";
import { recheckCompliance } from "@/lib/recheck";
import { BlueprintChangeSchema } from "@/lib/schemas";
import { z } from "zod";

const RecheckRequestSchema = z.object({
  blueprintId: z.string(),
  changes: z.array(BlueprintChangeSchema).min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = RecheckRequestSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: "Invalid request", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { blueprintId, changes } = parsed.data;
    const result = await recheckCompliance(blueprintId, changes);

    return Response.json(result);
  } catch (err) {
    console.error("[Recheck] Unhandled error:", err);
    return Response.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
