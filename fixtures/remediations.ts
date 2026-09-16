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
      description: "Sawcut the existing concrete foundation sill down 200 mm (8 inches) so finished sill is 1066 mm (42 inches) above finished floor level.",
      tradeoff: "Permanently solves sill height under NBC 2016 Part 4 Cl 4.10.1; requires deepening the exterior window well by 200 mm.",
      costEstimate: "₹25,000 – ₹35,000 ($300 – $420)",
      impactLevel: "medium",
      approvalLikelihood: "99%",
    },
    {
      id: "rem-b3-b",
      title: "Construct Code-Compliant Permanent Step",
      description: "Build a permanent, fixed masonry step (minimum 300 mm / 12\" tread, full window width, maximum 200 mm / 8\" riser) beneath the window.",
      tradeoff: "Per NBC 2016 Part 4 Cl 4.10.1 & Part 8 Sec 1 Cl 9.11.2, a permanent masonry step reduces effective sill height below 1100 mm (44 inches); minor floor space footprint impact.",
      costEstimate: "₹8,000 – ₹12,000 ($100 – $150)",
      impactLevel: "low",
      approvalLikelihood: "90% (Municipal inspection verified)",
    },
  ],

  // Smoke alarm documentation failure
  "f-b-004": [
    {
      id: "rem-b4-a",
      title: "Attach Electrical & Detection Plan (Sheet E-2)",
      description: "Upload an addendum drawing showing interconnected photoelectric smoke/heat detectors in rm-003 and common corridor complying with NBC 2016 Part 4 Table 7.",
      tradeoff: "Standard plan check documentation; negligible cost if drafted by licensed architect/engineer.",
      costEstimate: "₹0 – ₹4,000 ($0 – $50)",
      impactLevel: "low",
      approvalLikelihood: "100% (Fulfills documentation deficiency)",
    },
    {
      id: "rem-b4-b",
      title: "Licensed Electrical Contractor Undertaking Affidavit",
      description: "Provide a signed Form E undertaking with a licensed electrical contractor pledging hardwired interconnected detection prior to final inspection.",
      tradeoff: "Acceptable under NBC 2016 Part 4 administrative guidelines; guarantees contractor availability.",
      costEstimate: "₹10,000 – ₹18,000 ($120 – $220)",
      impactLevel: "low",
      approvalLikelihood: "98%",
    },
  ],

  // Side setback advisory finding
  "f-a-001": [
    {
      id: "rem-a1-a",
      title: "Apply for NBC 2016 Part 2 Clause 12.5 Administrative Setback Waiver",
      description: "Submit Form B-1 requesting administrative tolerance waiver for the 100 mm (3.96-inch) side open space encroachment under NBC 2016 Part 2 Cl 12.5, accompanied by a registered surveyor demarcation.",
      tradeoff: "Encroachment is within the 150 mm (6-inch) administrative waiver limit under NBC 2016 Part 2 Cl 12.5 (Pattern lp-002: 92% approval rate); requires standard municipal processing fee.",
      costEstimate: "₹2,500 filing fee + ₹8,000 survey",
      impactLevel: "low",
      approvalLikelihood: "92% (Supported by historical reviewer precedents)",
    },
    {
      id: "rem-a1-b",
      title: "Recess East Kitchen Exterior Wall 115 mm (4.5 Inches)",
      description: "Modulate the addition foundation by shifting the east exterior wall inward by 115 mm (4.5 inches), achieving 1.84 m (6.05 ft) side open space clearance.",
      tradeoff: "100% compliant by-right under NBC 2016 Part 3 Cl 8.2.3 without administrative delay; slightly reduces interior kitchen countertop depth.",
      costEstimate: "₹12,000 (Framing adjustment during construction phase)",
      impactLevel: "medium",
      approvalLikelihood: "100% (By-right clearance)",
    },
  ],

  // Side setback ripple finding (f-re-setback-side)
  "f-re-setback-side": [
    {
      id: "rem-re-a",
      title: "File for Planning Authority Variance (Encroachment > 150 mm / 6 Inches)",
      description: "Since moving the window reduced side open space to 1.52 m / 5.0 ft (300 mm / 12-inch encroachment), file for a formal Planning Authority variance under NBC 2016 Part 3 Cl 8.2.3.",
      tradeoff: "Requires Municipal Standing Committee review and 30-45 day scrutiny cycle; uncertain outcome without demonstrable site hardship.",
      costEstimate: "₹15,000 committee scrutiny fee",
      impactLevel: "high",
      approvalLikelihood: "45% (Formal hardship required)",
    },
    {
      id: "rem-re-b",
      title: "Fine-tune Window Translation to +150mm (Within 150 mm / 6\" Waiver Threshold)",
      description: "Recalibrate the window movement eastward to only 150mm rather than 300mm, keeping side open space at 1.68 m / 5.5 ft (150 mm / 6-inch encroachment).",
      tradeoff: "Qualifies for NBC 2016 Part 2 Cl 12.5 / Part 3 Cl 8.4.3 administrative waiver while still clearing window sill/header framing.",
      costEstimate: "₹0 (Simulation optimization)",
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
        description: "Resize or reposition the opening to comply with emergency escape criteria under NBC 2016 Part 4.",
        tradeoff: "Requires plan revision and reframing.",
        costEstimate: "₹25,000 – ₹45,000 ($300 – $550)",
        impactLevel: "medium",
        approvalLikelihood: "98%",
      },
      {
        id: `rem-gen-2`,
        title: "Alternative Egress Route",
        description: "Provide direct exterior access door meeting NBC 2016 Part 4, Clause 4.4.2.",
        tradeoff: "Higher installation cost, preserves existing window framing.",
        costEstimate: "₹50,000+",
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
