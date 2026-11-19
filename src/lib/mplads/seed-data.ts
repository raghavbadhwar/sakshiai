import type { ConstituencyBudget, WorkItem } from "./types";

export const CONSTITUENCY_META = {
  name: "West Delhi Parliamentary Constituency (Demo)",
  financialYear: "FY 2026-27",
  nodalDistrict: "South-West Delhi (District Authority)",
  portalTarget: "MoSPI e-SAKSHI",
};

export const INITIAL_BUDGET: ConstituencyBudget = {
  annualEntitlementInr: 50_000_000, // ₹5.00 Cr
  allocatedGeneralInr: 22_400_000, // ₹2.24 Cr
  allocatedScInr: 6_850_000, // ₹68.5L (₹6.5L shy of ₹75L 15% target!)
  allocatedStInr: 3_900_000, // ₹39.0L (meets ₹37.5L 7.5% target)
};

export const DELHI_SEED_WORKS: WorkItem[] = [
  {
    id: "WK-2026-101",
    title: "400m RCC Storm Water Drain — Najafgarh Main Road",
    ward: "Najafgarh (Ward 14)",
    category: "SC",
    implementingAgency: "MCD",
    stage: "RECOMMENDED",
    estimatedCostInr: 3_468_000,
    sanctionedCostInr: null,
    recommendedDateIso: "2026-08-22",
    sanctionedDateIso: null,
    lastUpdatedIso: "2026-08-22",
    siteLocation: { lat: 28.6092, lng: 76.9798 },
    ucHash: null,
  },
  {
    id: "WK-2026-102",
    title: "30 LED Solar Street Lights — Matiala Extension",
    ward: "Matiala (Ward 125)",
    category: "GENERAL",
    implementingAgency: "PWD Delhi",
    stage: "RECOMMENDED",
    estimatedCostInr: 1_377_000,
    sanctionedCostInr: null,
    recommendedDateIso: "2026-09-18",
    sanctionedDateIso: null,
    lastUpdatedIso: "2026-09-18",
    siteLocation: { lat: 28.6041, lng: 77.0324 },
    ucHash: null,
  },
  {
    id: "WK-2026-103",
    title: "3 Community RO Drinking Water ATMs — Uttam Nagar",
    ward: "Uttam Nagar (Ward 114)",
    category: "SC",
    implementingAgency: "Delhi Jal Board",
    stage: "IN_PROGRESS",
    estimatedCostInr: 1_468_800,
    sanctionedCostInr: 1_468_800,
    recommendedDateIso: "2026-06-15",
    sanctionedDateIso: "2026-07-12",
    lastUpdatedIso: "2026-10-28",
    siteLocation: { lat: 28.6219, lng: 77.059 },
    ucHash: null,
  },
  {
    id: "WK-2026-104",
    title: "1,200 Sq.m Interlocking Paver Lane — Dwarka Sector 12",
    ward: "Dwarka (Ward 121)",
    category: "GENERAL",
    implementingAgency: "MCD",
    stage: "DM_SANCTIONED",
    estimatedCostInr: 1_774_800,
    sanctionedCostInr: 1_774_800,
    recommendedDateIso: "2026-07-25",
    sanctionedDateIso: "2026-08-14",
    lastUpdatedIso: "2026-08-14",
    siteLocation: { lat: 28.5921, lng: 77.046 },
    ucHash: null,
  },
  {
    id: "WK-2026-105",
    title: "Smart Classroom & 5kW Solar Roof — Govt School Kakrola",
    ward: "Kakrola (Ward 123)",
    category: "ST",
    implementingAgency: "DSIIDC",
    stage: "UC_VERIFIED",
    estimatedCostInr: 1_275_000,
    sanctionedCostInr: 1_275_000,
    recommendedDateIso: "2026-05-04",
    sanctionedDateIso: "2026-05-29",
    lastUpdatedIso: "2026-10-19",
    siteLocation: { lat: 28.6108, lng: 77.0221 },
    ucHash: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
  },
];

export const KNOWN_SUBMITTED_PHOTO_HASHES = [
  "img_hash_kakrola_2026_verified_01",
  "img_hash_recycled_contractor_999",
];
