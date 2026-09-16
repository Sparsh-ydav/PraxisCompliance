// National Building Code of India (NBC 2016)
// Standardized Regulations: Part 3 (Development Control & Open Spaces) and Part 4 (Fire & Life Safety)
// Applicable to Residential Additions, Alterations, and Plan Approvals.

export interface RegulationClause {
  id: string;
  section: string;
  title: string;
  text: string;
  topics: string[];
}

export const REGULATIONS: RegulationClause[] = [
  // === PART 4: FIRE AND LIFE SAFETY / EGRESS & VENTILATION ===
  {
    id: "FE-101",
    section: "NBC 2016 Part 4, Clause 4.1",
    title: "Scope of Exit Requirements & Fire Safety",
    text: "All residential construction including additions and renovations shall comply with the fire egress and exit requirements set forth in NBC 2016 Part 4, Clause 4.1 through Clause 4.17. Every sleeping room, habitable basement, and occupied space shall have unobstructed access to safe exit pathways and operable emergency escape openings.",
    topics: ["egress", "fire", "residential", "nbc"],
  },
  {
    id: "FE-102",
    section: "NBC 2016 Part 4, Clause 4.10 & Part 8 Sec 1, Clause 9.11.2",
    title: "Emergency Escape Openings & Ventilation Dimensions",
    text: "Every sleeping room and habitable basement room shall have at least one operable emergency escape and rescue opening. Such opening shall provide a minimum net clear opening width of 500 mm (20 inches), minimum net clear height of 600 mm (24 inches), and an aggregate net clear opening area of not less than 0.53 m² (5.7 sq ft / 1/10th of floor area). The sill height of the emergency escape opening shall not exceed 1.1 m (44 inches / 1100 mm) above finished floor level.",
    topics: ["egress", "fire", "window", "dimensions", "nbc"],
  },
  {
    id: "FE-103",
    section: "NBC 2016 Part 8 Section 1, Clause 9.11.1",
    title: "Habitable Room Ventilation & Upper Floor Openings",
    text: "For habitable sleeping rooms located on ground or upper floors, natural ventilation and egress openings directly opening to the exterior shall maintain an aggregate area of not less than 10% of floor area (minimum 0.46 m² / 5.0 sq ft), provided minimum clear width of 500 mm (20 in) and height of 600 mm (24 in) are preserved. This exception does not relax basement opening requirements.",
    topics: ["egress", "fire", "window", "exception", "nbc"],
  },
  {
    id: "FE-104",
    section: "NBC 2016 Part 4, Clause 4.4.2",
    title: "Exit Doorways — Minimum Clear Width",
    text: "The primary exit doorway for any residential dwelling unit or addition shall have a minimum clear opening width of 1000 mm (1.0 m / 39.4 in, min 900 mm for internal doors) and minimum height of 2000 mm (2.0 m). Screen doors, grills, or secondary fittings shall not reduce the required clear egress passage below 1000 mm.",
    topics: ["egress", "fire", "door", "width", "nbc"],
  },
  {
    id: "FE-105",
    section: "NBC 2016 Part 4, Clause 4.5.1",
    title: "Egress Corridors & Passageways Clear Width",
    text: "Any interior corridor, passage, or hallway serving as a required exit access from a habitable sleeping room shall maintain a continuous, unobstructed minimum clear width of 1000 mm (1.0 m / 39.4 in). No structural projection or permanent fixture shall encroach into this egress corridor.",
    topics: ["egress", "fire", "hallway", "corridor", "nbc"],
  },
  {
    id: "FE-106",
    section: "NBC 2016 Part 4, Clause 4.6.1 & Table 6",
    title: "Internal Staircase Specifications",
    text: "Internal staircases serving residential occupancies shall have a minimum clear width of 1000 mm (1.0 m). Treads shall be not less than 250 mm in clear width and risers shall not exceed 190 mm in height. Handrails shall not project more than 115 mm into required staircase width.",
    topics: ["egress", "stairway", "stairs", "nbc"],
  },
  {
    id: "FE-107",
    section: "NBC 2016 Part 4, Clause 4.10.3 & Part 3, Clause 8.2.6",
    title: "Basement Window Wells & Light Shafts",
    text: "Where an emergency escape opening is provided in a basement below surrounding ground level, an external window well or light shaft shall be constructed. The window well shall have a minimum horizontal clearance of 900 mm (36 inches / 0.9 m) from the exterior wall face to permit full 90-degree swing of the escape sash.",
    topics: ["egress", "window", "basement", "well", "nbc"],
  },
  {
    id: "FE-108",
    section: "NBC 2016 Part 4, Clause 4.4.1",
    title: "Emergency Escape Window Operability",
    text: "All emergency escape and rescue openings shall be operable from the inside without requiring keys, specialized tools, or physical force. Latching hardware must be releasable by occupants in zero-visibility conditions.",
    topics: ["egress", "fire", "window", "operation", "nbc"],
  },
  {
    id: "FE-109",
    section: "NBC 2016 Part 4, Clause 4.17 & Table 7",
    title: "Smoke Detection & Fire Alarm Integration",
    text: "Any addition or internal alteration creating a new sleeping room shall require installation of interconnected automatic smoke and heat detectors per IS 2189 / NBC Part 4 Table 7. An electrical layout plan specifying detector positions across corridors and bedrooms must be submitted.",
    topics: ["egress", "fire", "smoke", "alarm", "nbc"],
  },

  // === PART 3: DEVELOPMENT CONTROL RULES & OPEN SPACES (SETBACKS) ===
  {
    id: "SB-201",
    section: "NBC 2016 Part 3, Clause 8.1",
    title: "Exterior Open Spaces (Setbacks) — General Mandate",
    text: "Every residential building shall have exterior open spaces (setbacks) on front, rear, and sides as prescribed in NBC 2016 Part 3, Clause 8.1 through Clause 8.4 to secure adequate natural lighting, air circulation, and fire tender movement. No addition may encroach into statutory open spaces without competent authority sanction.",
    topics: ["setback", "zoning", "residential", "nbc"],
  },
  {
    id: "SB-202",
    section: "NBC 2016 Part 3, Clause 8.2.1",
    title: "Front Open Space (Front Setback) — Low-Rise Residential",
    text: "For plotted residential buildings in low-rise residential zones, a minimum front open space (front setback) of 7.5 m (25 feet) shall be provided measured perpendicularly from the plot boundary to the outermost plinth line of the main building.",
    topics: ["setback", "zoning", "front", "nbc"],
  },
  {
    id: "SB-203",
    section: "NBC 2016 Part 3, Clause 8.2.3 & Table 2",
    title: "Side Open Space (Side Setback) — Plotted Residential",
    text: "For residential buildings up to 10 m in height, a minimum side open space (side setback) of 1.8 m (6.0 feet) shall be maintained on each side of the building. The aggregate sum of both side open spaces shall be not less than 4.5 m (15 feet).",
    topics: ["setback", "zoning", "side", "nbc"],
  },
  {
    id: "SB-204",
    section: "NBC 2016 Part 3, Clause 8.2.2",
    title: "Rear Open Space (Rear Setback)",
    text: "A minimum rear open space of 7.5 m (25 feet, minimum 3.0 m for constrained plots) shall be provided along the rear plot line throughout the width of the building to maintain adequate rear light plane angles.",
    topics: ["setback", "zoning", "rear", "nbc"],
  },
  {
    id: "SB-205",
    section: "NBC 2016 Part 3, Clause 8.2.3 (Group Housing)",
    title: "Side Open Space — Higher Density & Group Housing",
    text: "For multi-family, semi-detached, and group residential plots, side open spaces shall be not less than 2.4 m (8.0 feet) on each side boundary. For corner plots, the street-facing side open space shall be not less than 4.5 m.",
    topics: ["setback", "zoning", "side", "group-housing", "nbc"],
  },
  {
    id: "SB-206",
    section: "NBC 2016 Part 3, Clause 8.2.5",
    title: "Accessory Structure Setbacks & Clearances",
    text: "Detached accessory structures including domestic garages, guard cabins, and pump rooms shall maintain a minimum clearance of 1.5 m (5.0 feet) from side and rear boundaries and shall not be sited within the mandatory front open space.",
    topics: ["setback", "zoning", "accessory", "garage", "nbc"],
  },
  {
    id: "SB-207",
    section: "NBC 2016 Part 3, Clause 8.4.1",
    title: "Permissible Projections into Open Spaces",
    text: "Architectural features, sunshades (chhajjas), cornices, weather-sheds, and cantilever projections not exceeding 0.6 m (600 mm / 24 inches / 2.0 ft) in depth may project into required open spaces without being counted in setback encroachment calculations.",
    topics: ["setback", "zoning", "measurement", "projections", "nbc"],
  },
  {
    id: "SB-208",
    section: "NBC 2016 Part 2, Clause 12.5 & Part 3, Clause 8.4.3",
    title: "Administrative Tolerances & Waiver Threshold",
    text: "The Municipal Sanctioning Authority / Town Planner may grant an administrative waiver for marginal setback deviations up to 150 mm (6.0 inches / 0.5 ft) where the applicant presents a certified total-station plot demarcation confirming no hindrance to light, ventilation, or emergency fire lanes.",
    topics: ["setback", "zoning", "waiver", "variance", "nbc"],
  },
  {
    id: "SB-209",
    section: "NBC 2016 Part 3, Clause 6.1 & Table 1",
    title: "Maximum Permissible Ground Coverage",
    text: "The maximum ground coverage for residential plotted developments shall not exceed 40% of the total site area, preserving at least 60% unbuilt permeable space for rainwater infiltration and environmental mitigation.",
    topics: ["setback", "zoning", "coverage", "impervious", "nbc"],
  },
  {
    id: "SB-210",
    section: "NBC 2016 Part 3, Clause 8.3",
    title: "Building Height Limitations & Angular Planes",
    text: "The maximum height of residential additions shall not exceed 10.5 m (35 feet) in low-rise zones and must strictly comply with the 1:1.5 angular light plane projection from the opposite side of the abutting street.",
    topics: ["setback", "zoning", "height", "nbc"],
  },
];

export const REGULATION_COUNT = REGULATIONS.length;
