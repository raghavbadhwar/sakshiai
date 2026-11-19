export type BeneficiaryCategory = "GENERAL" | "SC" | "ST";

export type WorkLifecycleStage =
  | "RECOMMENDED"
  | "DM_SANCTIONED"
  | "WORK_ORDER_ISSUED"
  | "IN_PROGRESS"
  | "UC_VERIFIED";

export type ImplementingAgency = "PWD Delhi" | "MCD" | "Delhi Jal Board" | "DSIIDC";

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface ConstituencyBudget {
  annualEntitlementInr: number;
  allocatedGeneralInr: number;
  allocatedScInr: number;
  allocatedStInr: number;
}

export interface SorLineItem {
  code: string;
  description: string;
  unit: string;
  quantity: number;
  unitRateInr: number;
  totalInr: number;
}

export interface EarmarkCheck {
  scTargetInr: number;
  stTargetInr: number;
  scShortfallInr: number;
  stShortfallInr: number;
  blocksGeneralRecommendation: boolean;
  message: string;
}

export interface EligibilityResult {
  eligible: boolean;
  prohibitedMatch: string | null;
  reason: string;
  earmarkCheck: EarmarkCheck;
}

export interface DprDraft {
  dprId: string;
  title: string;
  ward: string;
  category: BeneficiaryCategory;
  implementingAgency: ImplementingAgency;
  sourceTranscript: string;
  lineItems: SorLineItem[];
  subtotalInr: number;
  contingencyInr: number;
  grandTotalInr: number;
  eligibility: EligibilityResult;
  generatedAtIso: string;
}

export interface WorkItem {
  id: string;
  title: string;
  ward: string;
  category: BeneficiaryCategory;
  implementingAgency: ImplementingAgency;
  stage: WorkLifecycleStage;
  estimatedCostInr: number;
  sanctionedCostInr: number | null;
  recommendedDateIso: string;
  sanctionedDateIso: string | null;
  lastUpdatedIso: string;
  siteLocation: GeoPoint;
  ucHash: string | null;
}

export interface BottleneckAlert {
  workId: string;
  title: string;
  ward: string;
  implementingAgency: ImplementingAgency;
  stage: WorkLifecycleStage;
  daysPending: number;
  slaThresholdDays: number;
  severity: "WARNING" | "CRITICAL";
  stalledAmountInr: number;
  escalationDraft: string;
}

export interface SiteSubmission {
  workId: string;
  sanctionedLocation: GeoPoint;
  photoLocation: GeoPoint;
  imageHash: string;
  c2paVerified: boolean;
  vlmDetectedCompletionPct: number;
  vlmDetectedAssets: string[];
  capturedAtIso: string;
}

export interface AuditReport {
  workId: string;
  passed: boolean;
  distanceMeters: number;
  withinGeofence: boolean;
  duplicatePhotoDetected: boolean;
  c2paVerified: boolean;
  completionPct: number;
  flags: string[];
}

export interface UtilizationCertificate {
  ucNumber: string;
  workId: string;
  workTitle: string;
  ward: string;
  implementingAgency: ImplementingAgency;
  certifiedAmountInr: number;
  issuedAtIso: string;
  previousHash: string;
  sha256Hash: string;
}
