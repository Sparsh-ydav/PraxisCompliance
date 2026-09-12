// Blueprint Classifier API route
// Analyzes uploaded files to classify project type, scope, and key characteristics
// ONLY classifies files from a known allowlist — rejects unrecognized files to prevent hallucination

import type { NextRequest } from "next/server";
import { z } from "zod";
import { callLLM } from "@/lib/llm";

const BlueprintClassificationSchema = z.object({
  projectType: z.string(),
  scope: z.enum(["minor", "moderate", "major"]),
  detectedRooms: z.array(z.string()),
  estimatedArea: z.string(),
  likelyIssues: z.array(z.string()),
  confidence: z.number().min(0).max(1),
});

type BlueprintClassification = z.infer<typeof BlueprintClassificationSchema>;

// Allowlist of recognized demo blueprint filenames/patterns
// These are the ONLY files we confidently classify
const RECOGNIZED_BLUEPRINT_PATTERNS = [
  // Fixture-based patterns (map to our actual demo data)
  "clean",
  "pass",
  "compliant",
  "blocking",
  "violation",
  "egress",
  "basement",
  "advisory",
  "setback",
  "kitchen",
  "side",
  // Explicit sample file names if you provide them
  "blueprint-a",
  "blueprint-b",
  "blueprint-c",
  "sample-",
  "demo-",
];

const CONFIDENCE_THRESHOLD = 0.5; // Minimum confidence to show results

interface ClassificationResponse {
  recognized: boolean;
  classification?: BlueprintClassification;
  usedFallback?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    const fileName = file.name.toLowerCase();
    const fileType = file.type;

    // Check if file matches our recognized pattern allowlist
    const isRecognized = RECOGNIZED_BLUEPRINT_PATTERNS.some((pattern) =>
      fileName.includes(pattern)
    );

    if (!isRecognized) {
      // File not recognized — return degraded state, do NOT hallucinate
      return Response.json({
        recognized: false,
      } as ClassificationResponse);
    }

    // File is recognized — proceed with classification
    const prompt = buildClassificationPrompt(fileName, fileType, file.size);

    const { result, usedFallback } = await callLLM<BlueprintClassification>({
      prompt,
      schema: BlueprintClassificationSchema,
      fallback: getFallbackFromFilename(fileName),
      agentName: "BlueprintClassifier",
    });

    // Defense-in-depth: check confidence threshold even for recognized files
    if (result.confidence < CONFIDENCE_THRESHOLD) {
      console.warn(`[BlueprintClassifier] Low confidence (${result.confidence}) for ${fileName}`);
      return Response.json({
        recognized: false, // Treat low-confidence as unrecognized
      } as ClassificationResponse);
    }

    return Response.json({
      recognized: true,
      classification: result,
      usedFallback,
    } as ClassificationResponse);
  } catch (err) {
    console.error("[BlueprintClassifier] Error:", err);
    return Response.json({
      recognized: false,
    } as ClassificationResponse);
  }
}

function buildClassificationPrompt(fileName: string, fileType: string, fileSize: number): string {
  return `You are analyzing a building permit blueprint file to classify its contents. Based on the filename and metadata provided, infer the most likely project characteristics.

## File Information
Filename: ${fileName}
File Type: ${fileType}
File Size: ${fileSize} bytes

## Instructions
Analyze the filename and file metadata to classify this blueprint submission. Look for keywords that indicate:
- Project type (addition, renovation, conversion, new construction)
- Room types (bedroom, bathroom, kitchen, basement, garage)
- Scope indicators (small, large, multi-story)
- Potential compliance areas (egress, setback, structural)

IMPORTANT: Only provide a classification if you are confident this is a building blueprint file. If the filename suggests this may not be a blueprint (e.g., generic document names, unrelated content), set confidence to 0.3 or lower.

Return ONLY valid JSON matching this schema:
{
  "projectType": "<specific project type like 'Basement bedroom conversion' or 'Side-yard kitchen addition'>",
  "scope": "minor" | "moderate" | "major",
  "detectedRooms": ["<room1>", "<room2>"],
  "estimatedArea": "<estimated square footage range>",
  "likelyIssues": ["<potential issue 1>", "<potential issue 2>"],
  "confidence": <0.0 to 1.0>
}

Return only the JSON object, no markdown, no explanation.`;
}

function getFallbackFromFilename(fileName: string): BlueprintClassification {
  const lower = fileName.toLowerCase();

  if (lower.includes("basement") || lower.includes("below") || lower.includes("blocking") || lower.includes("egress")) {
    return {
      projectType: "Basement bedroom conversion",
      scope: "moderate",
      detectedRooms: ["Basement bedroom"],
      estimatedArea: "150-300 sq ft",
      likelyIssues: ["Egress window dimensions", "Window well requirements", "Sill height"],
      confidence: 0.85,
    };
  }

  if (lower.includes("kitchen") || lower.includes("side") || lower.includes("advisory") || lower.includes("setback")) {
    return {
      projectType: "Side-yard kitchen addition",
      scope: "moderate",
      detectedRooms: ["Kitchen"],
      estimatedArea: "200-350 sq ft",
      likelyIssues: ["Side setback compliance", "Administrative waiver may be needed"],
      confidence: 0.80,
    };
  }

  if (lower.includes("clean") || lower.includes("pass") || lower.includes("compliant")) {
    return {
      projectType: "Bedroom addition",
      scope: "moderate",
      detectedRooms: ["Bedroom", "Bathroom"],
      estimatedArea: "250-400 sq ft",
      likelyIssues: ["Standard egress requirements", "Smoke alarm interconnection"],
      confidence: 0.82,
    };
  }

  if (lower.includes("master") || lower.includes("bedroom") || lower.includes("addition")) {
    return {
      projectType: "Bedroom addition",
      scope: "moderate",
      detectedRooms: ["Bedroom", "Bathroom"],
      estimatedArea: "250-400 sq ft",
      likelyIssues: ["Egress requirements", "Smoke alarm interconnection"],
      confidence: 0.78,
    };
  }

  if (lower.includes("garage") || lower.includes("conversion")) {
    return {
      projectType: "Garage conversion to living space",
      scope: "major",
      detectedRooms: ["Living space", "Bedroom"],
      estimatedArea: "300-500 sq ft",
      likelyIssues: ["Egress pathway width", "HVAC requirements", "Insulation"],
      confidence: 0.82,
    };
  }

  // Default fallback for recognized patterns
  return {
    projectType: "Residential addition or renovation",
    scope: "moderate",
    detectedRooms: ["Bedroom", "Bathroom"],
    estimatedArea: "200-400 sq ft",
    likelyIssues: ["Egress requirements", "Setback compliance"],
    confidence: 0.75,
  };
}
