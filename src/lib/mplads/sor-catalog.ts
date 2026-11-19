import type { ImplementingAgency } from "./types";

export interface SorCatalogEntry {
  code: string;
  keywords: string[];
  description: string;
  unit: string;
  unitRateInr: number;
  defaultQuantity: number;
  defaultAgency: ImplementingAgency;
}

export const PROHIBITED_WORK_PATTERNS: Array<{ pattern: RegExp; label: string }> = [
  { pattern: /\b(office\s*renovation|mp\s*office|mla\s*office|party\s*office)\b/i, label: "Office building or party office renovation" },
  { pattern: /\b(commercial\s*complex|shopping\s*mall|shops?\s*for\s*rent|commercial\s*shops?)\b/i, label: "Commercial complex or revenue-generating private shops" },
  { pattern: /\b(salary|salaries|honorarium|recurring\s*maintenance|staff\s*wages)\b/i, label: "Recurring revenue expenditure or staff salaries" },
  { pattern: /\b(private\s*house|private\s*residence|personal\s*land)\b/i, label: "Assets on private non-public land" },
  { pattern: /\b(temple|mosque|church|gurudwara|religious\s*place)\b/i, label: "Places of religious worship (prohibited under MPLADS guidelines)" },
];

export const DELHI_CPWD_SOR_CATALOG: SorCatalogEntry[] = [
  {
    code: "CPWD-SL-401",
    keywords: ["solar", "street light", "streetlight", "light", "pole", "led"],
    description: "Supply & erection of 9m GI octagonal pole with 40W LED solar street light & LiFePO4 battery",
    unit: "Nos",
    unitRateInr: 45_000,
    defaultQuantity: 25,
    defaultAgency: "PWD Delhi",
  },
  {
    code: "CPWD-DR-214",
    keywords: ["drain", "drainage", "nala", "waterlogging", "storm"],
    description: "Construction of RCC M-25 storm water box drain with precast heavy-duty cover slabs",
    unit: "Meters",
    unitRateInr: 8_500,
    defaultQuantity: 400,
    defaultAgency: "MCD",
  },
  {
    code: "CPWD-RD-112",
    keywords: ["road", "sadak", "paver", "lane", "gali", "interlocking"],
    description: "Providing & laying 80mm M-40 interlocking concrete paver blocks with granular sub-base",
    unit: "Sq.m",
    unitRateInr: 1_450,
    defaultQuantity: 1_200,
    defaultAgency: "MCD",
  },
  {
    code: "CPWD-WT-308",
    keywords: ["water", "ro", "pani", "drinking", "atm", "pipeline"],
    description: "Installation of 1,000 LPH community RO drinking water ATM kiosk with SS storage tank",
    unit: "Units",
    unitRateInr: 480_000,
    defaultQuantity: 3,
    defaultAgency: "Delhi Jal Board",
  },
  {
    code: "CPWD-ED-519",
    keywords: ["school", "classroom", "library", "anganwadi", "smart class", "hall", "chaupal"],
    description: "Durable community hall / smart classroom civil upgrade with rooftop 5kW solar & seating",
    unit: "Units",
    unitRateInr: 1_250_000,
    defaultQuantity: 1,
    defaultAgency: "DSIIDC",
  },
];
