// Synthetic municipal regulations for Maplewood Township
// Residential Additions & Renovations — Fire Egress and Setback Requirements

export interface RegulationClause {
  id: string;
  section: string;
  title: string;
  text: string;
  topics: string[];
}

export const REGULATIONS: RegulationClause[] = [
  // === FIRE EGRESS ===
  {
    id: "FE-101",
    section: "Section 101.1",
    title: "Scope of Egress Requirements",
    text: "All residential construction including additions and renovations shall comply with the fire egress requirements set forth in Sections 101.1 through 101.9. These requirements apply to every sleeping room, habitable basement, and any room used for occupancy that may be isolated from a primary exit pathway.",
    topics: ["egress", "fire", "residential"],
  },
  {
    id: "FE-102",
    section: "Section 101.2",
    title: "Emergency Escape and Rescue Openings — Minimum Dimensions",
    text: "Every sleeping room and habitable basement room shall have at least one operable emergency escape and rescue opening. Such opening shall have a minimum net clear opening height of 24 inches, a minimum net clear opening width of 20 inches, and a minimum net clear opening area of 5.7 square feet. The sill height of the emergency escape opening shall not exceed 44 inches above the finished floor.",
    topics: ["egress", "fire", "window", "dimensions"],
  },
  {
    id: "FE-103",
    section: "Section 101.3",
    title: "Emergency Escape — Ground Floor Exceptions",
    text: "For sleeping rooms located on the ground floor or above ground level, the minimum net clear opening area may be reduced to 5.0 square feet provided the minimum height of 24 inches and minimum width of 20 inches are maintained. This exception does not apply to basement sleeping rooms.",
    topics: ["egress", "fire", "window", "exception"],
  },
  {
    id: "FE-104",
    section: "Section 101.4",
    title: "Door Width — Primary Exit",
    text: "The primary exit door for any residential addition shall have a minimum clear opening width of 32 inches and a minimum height of 78 inches. Screen doors and storm doors shall not reduce the required egress width below 32 inches.",
    topics: ["egress", "fire", "door", "width"],
  },
  {
    id: "FE-105",
    section: "Section 101.5",
    title: "Egress Pathway — Hallway and Corridor Width",
    text: "Any corridor or hallway serving as a required egress pathway from a sleeping room shall have a minimum clear width of 36 inches. No permanent obstruction shall reduce this width.",
    topics: ["egress", "fire", "hallway", "corridor"],
  },
  {
    id: "FE-106",
    section: "Section 101.6",
    title: "Stairway Width",
    text: "Interior stairways in residential additions shall have a minimum clear width of 36 inches, measured at or below the handrail. Handrails shall not project more than 4.5 inches into the required stairway width.",
    topics: ["egress", "stairway", "stairs"],
  },
  {
    id: "FE-107",
    section: "Section 101.7",
    title: "Egress Window Well Requirements",
    text: "Where an emergency escape and rescue opening is located below grade, a window well shall be provided. The window well shall have minimum horizontal projection and width of 36 inches. The area of the window well shall be sufficient to allow the window to fully open.",
    topics: ["egress", "window", "basement", "well"],
  },
  {
    id: "FE-108",
    section: "Section 101.8",
    title: "Emergency Escape — Window Operability",
    text: "Emergency escape and rescue openings shall be operable from the inside without the use of keys, tools, or special knowledge. Window opening control devices are permitted provided they are releasable from the inside without a key or tool.",
    topics: ["egress", "fire", "window", "operation"],
  },
  {
    id: "FE-109",
    section: "Section 101.9",
    title: "Smoke Alarm Integration",
    text: "Any addition or renovation that creates a new sleeping room shall require installation of interconnected smoke alarms on all floors of the dwelling unit and in each sleeping room. Smoke alarms shall be listed and labeled per UL 217.",
    topics: ["egress", "fire", "smoke", "alarm"],
  },

  // === SETBACK AND ZONING ===
  {
    id: "SB-201",
    section: "Section 201.1",
    title: "Setback Requirements — General",
    text: "All residential additions shall comply with the minimum setback requirements established for the underlying zoning district as set forth in Sections 201.1 through 201.8 of the Maplewood Township Zoning Ordinance. No addition may encroach into any required setback area without a variance granted by the Zoning Board of Appeals.",
    topics: ["setback", "zoning", "residential"],
  },
  {
    id: "SB-202",
    section: "Section 201.2",
    title: "Front Setback — R-1 Single Family Residential",
    text: "In the R-1 Single Family Residential district, no addition shall be constructed closer than 25 feet from the front property line. Front setback is measured from the face of the primary structure, not from any attached garage or accessory structure.",
    topics: ["setback", "zoning", "front", "R-1"],
  },
  {
    id: "SB-203",
    section: "Section 201.3",
    title: "Side Setback — R-1 Single Family Residential",
    text: "In the R-1 Single Family Residential district, side yard setbacks shall be a minimum of 6 feet on each side of the structure. The combined total of both side yards shall be not less than 15 feet.",
    topics: ["setback", "zoning", "side", "R-1"],
  },
  {
    id: "SB-204",
    section: "Section 201.4",
    title: "Rear Setback — R-1 Single Family Residential",
    text: "In the R-1 Single Family Residential district, rear yard setbacks shall be a minimum of 25 feet from the rear property line. Attached decks and patios are included in the calculation of rear setback.",
    topics: ["setback", "zoning", "rear", "R-1"],
  },
  {
    id: "SB-205",
    section: "Section 201.5",
    title: "Side Setback — R-2 Two Family and Multi-Family Residential",
    text: "In the R-2 district, side yard setbacks shall be a minimum of 8 feet on each side. For corner lots, the street-facing side yard shall be a minimum of 15 feet.",
    topics: ["setback", "zoning", "side", "R-2"],
  },
  {
    id: "SB-206",
    section: "Section 201.6",
    title: "Accessory Structure Setbacks",
    text: "Detached accessory structures including garages, sheds, and gazebos shall maintain a minimum setback of 5 feet from any side or rear property line and shall not be located in the front yard. Accessory structures over 200 square feet in floor area shall comply with primary structure setback requirements.",
    topics: ["setback", "zoning", "accessory", "garage", "shed"],
  },
  {
    id: "SB-207",
    section: "Section 201.7",
    title: "Setback Measurement Standards",
    text: "Setback distances shall be measured at right angles from the property line to the nearest point of the structure, including any eaves or overhangs that project more than 12 inches beyond the building face. Chimneys, bay windows, and similar architectural projections not exceeding 2 feet in depth and 8 feet in width shall not be counted in setback calculations.",
    topics: ["setback", "zoning", "measurement"],
  },
  {
    id: "SB-208",
    section: "Section 201.8",
    title: "Setback Waiver — Minor Encroachment",
    text: "The Building Official may grant an administrative waiver for setback encroachments of up to 6 inches when the applicant provides a certified survey and demonstrates that the encroachment does not adversely affect adjacent properties. Encroachments exceeding 6 inches require a formal variance from the Zoning Board of Appeals.",
    topics: ["setback", "zoning", "waiver", "variance"],
  },
  {
    id: "SB-209",
    section: "Section 201.9",
    title: "Impervious Surface Coverage",
    text: "The total impervious surface coverage for any R-1 lot shall not exceed 40% of the total lot area. This includes all buildings, driveways, walkways, patios, and other hard surfaces. Additions that would cause total impervious coverage to exceed 40% shall require a stormwater management plan.",
    topics: ["setback", "zoning", "coverage", "impervious"],
  },
  {
    id: "SB-210",
    section: "Section 201.10",
    title: "Height Limitations",
    text: "No residential addition in the R-1 district shall exceed 35 feet in height as measured from the average grade at the base of the structure to the highest point of the roof. Additions to existing structures shall not exceed the height of the existing structure by more than 10 feet.",
    topics: ["setback", "zoning", "height"],
  },
];

export const REGULATION_COUNT = REGULATIONS.length;
