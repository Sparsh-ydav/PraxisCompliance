// Synthetic blueprint data for PraxisCompliance demo
// Three sample blueprints: clean, blocking-issue, advisory-issue

export interface Room {
  id: string;
  name: string;
  type: "bedroom" | "bathroom" | "kitchen" | "living" | "dining" | "hallway" | "other";
  dimensions: { width: number; length: number }; // feet
  isSleepingRoom: boolean;
  floorLevel: "basement" | "ground" | "upper";
  egressOpenings: EgressOpening[];
}

export interface EgressOpening {
  id?: string;
  room?: string;
  wall?: string;
  type: "window" | "door";
  clearWidthInches: number;
  clearHeightInches: number;
  sillHeightFromFloorInches: number;
  operableFromInside: boolean;
}

export interface Blueprint {
  id: string;
  label: string;
  description: string;
  projectType: "addition" | "renovation";
  zoneDistrict: "R-1" | "R-2";
  lotSizeSqft: number;
  existingFootprintSqft: number;
  additionFootprintSqft: number;
  setbacks: {
    front: number;  // feet from property line
    rearLeft: number;
    rearRight: number;
    side: number;
  };
  structureHeightFt: number;
  primaryExitDoorWidthInches: number;
  hallwayWidthInches: number;
  rooms: Room[];
  notes: string;
}

// Blueprint 1: CLEAN — passes all checks
export const BLUEPRINT_CLEAN: Blueprint = {
  id: "bp-clean",
  label: "Blueprint A — Bedroom Addition (Clean)",
  description: "Single-story rear addition adding one bedroom and a hallway bathroom. All dimensions comfortably within code.",
  projectType: "addition",
  zoneDistrict: "R-1",
  lotSizeSqft: 7200,
  existingFootprintSqft: 1400,
  additionFootprintSqft: 320,
  setbacks: {
    front: 28,
    rearLeft: 8.5,
    rearRight: 9.0,
    side: 7,
  },
  structureHeightFt: 18,
  primaryExitDoorWidthInches: 36,
  hallwayWidthInches: 42,
  rooms: [
    {
      id: "rm-001",
      name: "Addition Bedroom",
      type: "bedroom",
      dimensions: { width: 12, length: 14 },
      isSleepingRoom: true,
      floorLevel: "ground",
      egressOpenings: [
        {
          id: "W1",
          room: "Addition Bedroom",
          wall: "north",
          type: "window",
          clearWidthInches: 24,
          clearHeightInches: 26,
          sillHeightFromFloorInches: 36,
          operableFromInside: true,
        },
      ],
    },
    {
      id: "rm-002",
      name: "Addition Bathroom",
      type: "bathroom",
      dimensions: { width: 8, length: 10 },
      isSleepingRoom: false,
      floorLevel: "ground",
      egressOpenings: [],
    },
  ],
  notes: "Standard rear addition, no issues expected. Smoke alarms to be installed per FE-109.",
};

// Blueprint 2: BLOCKING ISSUE — clear egress violation in basement bedroom
export const BLUEPRINT_BLOCKING: Blueprint = {
  id: "bp-blocking",
  label: "Blueprint B — Basement Bedroom Conversion (Blocking)",
  description: "Renovation converting basement recreation room to a bedroom. Egress window is undersized — clear width is only 16 inches, well below the 20-inch minimum.",
  projectType: "renovation",
  zoneDistrict: "R-1",
  lotSizeSqft: 6800,
  existingFootprintSqft: 1600,
  additionFootprintSqft: 0,
  setbacks: {
    front: 26,
    rearLeft: 7.5,
    rearRight: 7.5,
    side: 6,
  },
  structureHeightFt: 22,
  primaryExitDoorWidthInches: 34,
  hallwayWidthInches: 38,
  rooms: [
    {
      id: "rm-003",
      name: "Basement Bedroom",
      type: "bedroom",
      dimensions: { width: 11, length: 13 },
      isSleepingRoom: true,
      floorLevel: "basement",
      egressOpenings: [
        {
          id: "W2",
          room: "basement bedroom",
          wall: "south",
          type: "window",
          clearWidthInches: 16, // VIOLATION: minimum is 20 inches
          clearHeightInches: 22, // VIOLATION: minimum is 24 inches
          sillHeightFromFloorInches: 50, // VIOLATION: maximum is 44 inches
          operableFromInside: true,
        },
      ],
    },
  ],
  notes: "Basement conversion. Existing window well in place but window itself needs replacement. Sill height also exceeds maximum allowed.",
};

// Blueprint 3: ADVISORY ISSUE — borderline side setback
export const BLUEPRINT_ADVISORY: Blueprint = {
  id: "bp-advisory",
  label: "Blueprint C — Side Addition (Advisory Setback)",
  description: "Side-yard addition for expanded kitchen. Side setback measures 5 feet 8 inches (5.67 ft) — below the 6-foot minimum, but within the administrative waiver threshold.",
  projectType: "addition",
  zoneDistrict: "R-1",
  lotSizeSqft: 6000,
  existingFootprintSqft: 1200,
  additionFootprintSqft: 280,
  setbacks: {
    front: 27,
    rearLeft: 26,
    rearRight: 26,
    side: 5.67, // ADVISORY: 0.33 ft below the 6 ft minimum — within admin waiver range
  },
  structureHeightFt: 16,
  primaryExitDoorWidthInches: 36,
  hallwayWidthInches: 40,
  rooms: [
    {
      id: "rm-004",
      name: "Kitchen Extension",
      type: "kitchen",
      dimensions: { width: 10, length: 14 },
      isSleepingRoom: false,
      floorLevel: "ground",
      egressOpenings: [],
    },
  ],
  notes: "Side setback is 5 ft 8 in. Historical pattern shows reviewers routinely grant administrative waivers for encroachments under 6 inches. Applicant should be advised to request waiver at time of filing.",
};

export const BLUEPRINTS: Blueprint[] = [
  BLUEPRINT_CLEAN,
  BLUEPRINT_BLOCKING,
  BLUEPRINT_ADVISORY,
];

export function getBlueprintById(id: string): Blueprint | undefined {
  return BLUEPRINTS.find((bp) => bp.id === id);
}
