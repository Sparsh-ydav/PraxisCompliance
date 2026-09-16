// Structured remediation options with tradeoffs for compliance findings.
// Fulfills Phase 4 (item 22): 2-3 remediation options with clear tradeoffs per finding.

export interface RemediationOption {
  id: string;
  title: string;
  description: string;
  tradeoff: string;
  costEstimate?: string;
  impactLevel: "low" | "medium" | "high";
  approvalLikelihood: string;
}

export const REMEDIATION_OPTIONS: Record<string, RemediationOption[]> = {
  // Egress window width failure
  "f-b-001": [
    {
      id: "rem-b1-a",
      title: "Replace with Larger Egress Window Unit",
      description: "Replace Window W2 with a 30\" × 36\" casement window, expanding net clear width to 28 inches and clear height to 34 inches.",
      tradeoff: "Resolves both width and height deficits in one operation; requires modest header reframing (~$1,400).",
      costEstimate: "$1,400 – $1,800",
      impactLevel: "medium",
      approvalLikelihood: "99% (Direct compliance)",
    },
    {
      id: "rem-b1-b",
      title: "Add Second Egress Point on West Wall",
      description: "Keep existing window W2 as natural light source and cut a new compliant egress window well on the unconstrained west elevation.",
      tradeoff: "Avoids modifying the south foundation wall near the property line; higher excavation and masonry cost.",
      costEstimate: "$3,200 – $4,500",
      impactLevel: "high",
      approvalLikelihood: "98% (Alternative egress path)",
    },
    {
      id: "rem-b1-c",
      title: "Reclassify Room to Non-Sleeping Use (Home Office/Den)",
      description: "Re-designate rm-003 from 'Basement Bedroom' to 'Recreation / Home Office' on architectural plans.",
      tradeoff: "Zero construction cost and instant code clearance; forfeit bedroom count on home valuation.",
      costEstimate: "$0 (Plan revision only)",
      impactLevel: "low",
      approvalLikelihood: "100% (Removes sleeping room classification)",
    },
  ],

  // Egress window height failure
  "f-b-002": [
    {
      id: "rem-b2-a",
      title: "Enlarge Window Rough Opening Vertically",
      description: "Lower foundation cut by 6 inches to accommodate a 30-inch tall operable sash.",
      tradeoff: "Also helps lower sill height toward the 44-inch limit; requires foundation sawing.",
      costEstimate: "$1,200 – $1,600",
      impactLevel: "medium",
      approvalLikelihood: "99%",
    },
    {
      id: "rem-b2-b",
      title: "Install Egress-Rated Slider with Low-Profile Frame",
      description: "Utilize an ultra-thin composite frame designed for retrofits to achieve 24\" clear height within existing rough opening.",
      tradeoff: "Avoids concrete cutting if existing masonry opening has 1.5\" tolerance; premium window cost.",
      costEstimate: "$900 – $1,300",
      impactLevel: "low",
      approvalLikelihood: "94% (Pending manufacturer submittal cut sheet)",
    },
  ],

  // Egress window sill height failure
  "f-b-003": [
    {
      id: "rem-b3-a",
      title: "Lower Window Sill via Foundation Wall Cut",
      description: "Sawcut the existing concrete foundation sill down 8 inches so finished sill is 42 inches above floor.",
      tradeoff: "Permanently solves sill height; requires deepening the exterior window well by 8 inches.",
      costEstimate: "$800 – $1,200",
      impactLevel: "medium",
      approvalLikelihood: "99%",
    },
    {
      id: "rem-b3-b",
      title: "Construct Code-Compliant Permanent Step",
      description: "Build a permanent, fixed architectural step (minimum 12\" deep, full window width, maximum 8\" high) beneath the window.",
      tradeoff: "Per IRC Section R310.2.1, a permanent step effectively reduces sill height; interior space footprint impact.",
      costEstimate: "$250 – $400",
      impactLevel: "low",
      approvalLikelihood: "90% (Jurisdiction inspection verified)",
    },
  ],

  // Smoke alarm documentation failure
  "f-b-004": [
    {
      id: "rem-b4-a",
      title: "Attach Electrical Key Plan (Sheet E-2)",
      description: "Upload an addendum sheet showing interconnected wireless/hardwired photoelectric smoke alarms in rm-003 and common corridor.",
      tradeoff: "Standard plan check correction; negligible cost if drafted by applicant.",
      costEstimate: "$0 – $150",
      impactLevel: "low",
      approvalLikelihood: "100% (Fulfills documentation deficiency)",
    },
    {
      id: "rem-b4-b",
      title: "Certified Electrician Installation Affidavit",
      description: "Provide a signed scope of work contract with a licensed C-10 electrical contractor pledging hardwire interconnection prior to rough-in inspection.",
      tradeoff: "Acceptable under Maplewood administrative guidelines; guarantees contractor availability.",
      costEstimate: "$300 – $600",
      impactLevel: "low",
      approvalLikelihood: "98%",
    },
  ],

  // Side setback advisory finding
  "f-a-001": [
    {
      id: "rem-a1-a",
      title: "Apply for Section 201.8 Administrative Setback Waiver",
      description: "Submit Form Z-12 requesting an administrative waiver for the 3.96-inch side encroachment, accompanied by a certified boundary survey.",
      tradeoff: "Encroachment is well within the 6-inch administrative waiver limit (Historical Pattern lp-002: 92% approval rate); requires $150 filing fee.",
      costEstimate: "$150 filing fee + $500 survey",
      impactLevel: "low",
      approvalLikelihood: "92% (Supported by historical reviewer precedents)",
    },
    {
      id: "rem-a1-b",
      title: "Recess East Kitchen Exterior Wall 4 Inches",
      description: "Modulate the addition foundation by shifting the east exterior wall inward by 4.5 inches, achieving exactly 6.05 ft clearance.",
      tradeoff: "100% compliant by-right without administrative delay; slightly reduces interior kitchen countertop depth.",
      costEstimate: "$400 (Framing adjustment during framing phase)",
      impactLevel: "medium",
      approvalLikelihood: "100% (By-right clearance)",
    },
  ],

  // Side setback ripple finding (f-re-setback-side)
  "f-re-setback-side": [
    {
      id: "rem-re-a",
      title: "File for Zoning Variance (Encroachment > 6 Inches)",
      description: "Since moving the window reduced setback to 5.0 ft (12-inch encroachment), file for a formal Board of Adjustment variance.",
      tradeoff: "Requires public notification and 45-day review cycle; uncertain outcome without hardship demonstration.",
      costEstimate: "$750 hearing fee",
      impactLevel: "high",
      approvalLikelihood: "45% (Formal hardship required)",
    },
    {
      id: "rem-re-b",
      title: "Fine-tune Window Translation to +150mm (Within 6\" Waiver Threshold)",
      description: "Recalibrate the window movement eastward to only 150mm rather than 300mm, keeping setback at 5.5 ft (6-inch encroachment).",
      tradeoff: "Qualifies for Section 201.8 administrative waiver while still clearing window sill/header framing.",
      costEstimate: "$0 (Simulation optimization)",
      impactLevel: "low",
      approvalLikelihood: "92%",
    },
  ],
};

export function getRemediationOptions(findingId: string, clauseId?: string): RemediationOption[] {
  if (REMEDIATION_OPTIONS[findingId]) {
    return REMEDIATION_OPTIONS[findingId];
  }

  // Fallback generation for generic findings
  if (clauseId?.startsWith("FE")) {
    return [
      {
        id: `rem-gen-1`,
        title: "Standard Architectural Modification",
        description: "Resize or reposition the opening to comply with emergency escape criteria.",
        tradeoff: "Requires plan revision and reframing (~$1,200).",
        costEstimate: "$1,000 – $2,000",
        impactLevel: "medium",
        approvalLikelihood: "98%",
      },
      {
        id: `rem-gen-2`,
        title: "Alternative Egress Route",
        description: "Provide direct exterior access door meeting Section 101.4.",
        tradeoff: "Higher installation cost, preserves existing window framing.",
        costEstimate: "$2,500+",
        impactLevel: "high",
        approvalLikelihood: "99%",
      },
    ];
  }

  return [
    {
      id: "rem-gen-def",
      title: "Request Municipal Staff Consultation",
      description: "Schedule a preliminary plan review conference with the designated plan examiner.",
      tradeoff: "Provides official guidance; adds 5–7 business days to submission timeline.",
      costEstimate: "$0",
      impactLevel: "low",
      approvalLikelihood: "90%",
    },
  ];
}
