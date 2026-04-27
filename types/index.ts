export interface AnnualSummary {
  Bank: string;
  Year: number;
  Average_internal_risk: number;
  Average_external_risk: number;
  Average_overall_risk: number;
  Annual_AI_summary: string;
  Source_refs: string;
}

export interface OSFITaxonomy {
  Category_ID: string;
  OSFI_bucket: string;
  Risk_category: string;
  Exposure_1_name: string;
  Exposure_2_name: string;
  Control_name: string;
}

export interface BankRiskDetail {
  Bank: string;
  Year: number;
  Category_ID: string;
  OSFI_bucket: string;
  Risk_category: string;
  Exposure_1_name: string;
  Exposure_1_score: number;
  Exposure_1_rationale: string;
  Exposure_1_evidence: string;
  Exposure_1_source: string;
  Exposure_2_name: string;
  Exposure_2_score: number;
  Exposure_2_rationale: string;
  Exposure_2_evidence: string;
  Exposure_2_source: string;
  Control_name: string;
  Control_score: number;
  Control_rationale: string;
  Control_evidence: string;
  Control_source: string;
  Raw_exposure: number;
  Final_risk_estimate: number;
  Confidence: number;
  Imputation_flag: string;
  Category_summary: string;
}

export interface EvidenceLog {
  Bank: string;
  Year: number;
  Category_ID: string;
  Risk_category: string;
  Subscore_type: string;
  Subscore_name: string;
  Score: number;
  Rationale: string;
  Evidence: string;
  Source_refs: string;
  Imputation_flag: string;
}

export const BANK_META: Record<string, { color: string; shortName: string; fullName: string }> = {
  'TD':                      { color: '#4CAF50', shortName: 'TD',        fullName: 'Toronto-Dominion Bank' },
  'Scotiabank':              { color: '#CC0000', shortName: 'Scotiabank',fullName: 'Bank of Nova Scotia' },
  'RBC':                     { color: '#003366', shortName: 'RBC',       fullName: 'Royal Bank of Canada' },
  'National Bank of Canada': { color: '#1E6B3C', shortName: 'NBC',       fullName: 'National Bank of Canada' },
  'CIBC':                    { color: '#F26522', shortName: 'CIBC',      fullName: 'Canadian Imperial Bank of Commerce' },
  'BMO':                     { color: '#0066CC', shortName: 'BMO',       fullName: 'Bank of Montreal' },
};

export const BANKS = ['TD', 'Scotiabank', 'RBC', 'National Bank of Canada', 'CIBC', 'BMO'] as const;
export const YEARS = [2020, 2021, 2022, 2023, 2024, 2025] as const;
