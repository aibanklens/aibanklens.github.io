import { AnnualSummary, BankRiskDetail, OSFITaxonomy, EvidenceLog } from '@/types';

const BASE = '/data';

export async function getAnnualSummary(): Promise<AnnualSummary[]> {
  const res = await fetch(`${BASE}/annual_summary.json`);
  return res.json();
}

export async function getBankRiskDetail(): Promise<BankRiskDetail[]> {
  const res = await fetch(`${BASE}/bank_risk_detail.json`);
  return res.json();
}

export async function getOSFITaxonomy(): Promise<OSFITaxonomy[]> {
  const res = await fetch(`${BASE}/osfi_taxonomy.json`);
  return res.json();
}

export async function getEvidenceLog(): Promise<EvidenceLog[]> {
  const res = await fetch(`${BASE}/evidence_log.json`);
  return res.json();
}
