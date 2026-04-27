'use client';
import { useState, useEffect } from 'react';
import { getBankRiskDetail, getOSFITaxonomy } from '@/lib/data';
import { BANK_META, BANKS, YEARS } from '@/types';
import type { BankRiskDetail, OSFITaxonomy } from '@/types';

export default function HeatmapPage() {
  const [data,       setData]       = useState<BankRiskDetail[]>([]);
  const [categories, setCategories] = useState<OSFITaxonomy[]>([]);
  const [selectedYear, setYear]     = useState(2025);

  useEffect(() => {
    getBankRiskDetail().then(setData);
    getOSFITaxonomy().then(setCategories);
  }, []);

  const internalCats = categories.filter(c => c.OSFI_bucket === 'Internal');
  const externalCats = categories.filter(c => c.OSFI_bucket === 'External');

  return (
    <>
      <nav className="nav">
        <span className="nav-brand">Canada <span>Big-6</span> AI Risk Tracker</span>
        <ul className="nav-links">
          <li><a href="/">Dashboard</a></li>
          <li><a href="/heatmap" className="active">Risk Heatmap</a></li>
          <li><a href="/methodology">Methodology</a></li>
        </ul>
        <span style={{ marginLeft: 'auto', fontSize: 11, color: '#8b949e', fontFamily: 'var(--mono)' }}>
          2020–2025 · OSFI-FCAC Framework
        </span>
      </nav>

      <main className="main">
        <span className="section-label">Risk Analysis · Heatmap</span>
        <h1 className="section-title">AI Risk Heatmap</h1>

        <div className="filter-bar">
          <span style={{ color: 'var(--text2)', fontSize: 13 }}>Year:</span>
          {YEARS.map(y => (
            <button key={y} className={selectedYear === y ? 'active' : ''} onClick={() => setYear(y)}>{y}</button>
          ))}
          <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text2)' }}>
            Hover a cell for details ·{' '}
            <span style={{ color: '#3fb950' }}>Green = Low</span> ·{' '}
            <span style={{ color: '#1e88e5' }}>Blue = Moderate</span> ·{' '}
            <span style={{ color: '#d29922' }}>Yellow = High</span> ·{' '}
            <span style={{ color: '#f85149' }}>Red = Very High</span>
          </span>
        </div>

        {/* Internal table */}
        {data.length > 0 && (
          <div className="chart-card full" style={{ marginBottom: 24 }}>
            <div className="chart-title">Internal Risk Categories — {selectedYear}</div>
            <div style={{ overflowX: 'auto' }}>
              <table className="heatmap-table">
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left' }}>Risk Category</th>
                    {BANKS.map(b => (
                      <th key={b}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
                          <div className="bank-dot" style={{ background: BANK_META[b].color, width: 8, height: 8 }} />
                          {BANK_META[b].shortName}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {internalCats.map(cat => (
                    <tr key={cat.Category_ID}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{cat.Category_ID}</div>
                        <div style={{ fontSize: 11, color: 'var(--text2)', maxWidth: 200 }}>{cat.Risk_category}</div>
                      </td>
                      {BANKS.map(bank => {
                        const row = data.find(r => r.Bank === bank && r.Year === selectedYear && r.Category_ID === cat.Category_ID);
                        const v   = row?.Final_risk_estimate ?? 0;
                        const bg  = v >= 3.5 ? '#c0392b' : v >= 3.0 ? '#7c5a00' : v >= 2.0 ? '#1c3a5c' : '#1a5c35';
                        return (
                          <td key={bank} style={{ background: bg }}>
                            <span className="cell-score">{v > 0 ? v.toFixed(2) : '—'}</span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Category legend */}
        <div className="chart-card" style={{ marginBottom: 32 }}>
          <div className="chart-title">OSFI Risk Category Reference</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', marginBottom: 12 }}>Internal Risk</div>
              {internalCats.map(cat => (
                <div key={cat.Category_ID} style={{ marginBottom: 12, fontSize: 12 }}>
                  <div style={{ fontWeight: 600, color: 'var(--text)' }}>{cat.Category_ID} · {cat.Risk_category}</div>
                  <div style={{ color: 'var(--text2)', marginTop: 2 }}>Exposure: {cat.Exposure_1_name} + {cat.Exposure_2_name}</div>
                  <div style={{ color: 'var(--text2)' }}>Control: {cat.Control_name}</div>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#f0883e', marginBottom: 12 }}>External Risk</div>
              {externalCats.map(cat => (
                <div key={cat.Category_ID} style={{ marginBottom: 12, fontSize: 12 }}>
                  <div style={{ fontWeight: 600, color: 'var(--text)' }}>{cat.Category_ID} · {cat.Risk_category}</div>
                  <div style={{ color: 'var(--text2)', marginTop: 2 }}>Exposure: {cat.Exposure_1_name} + {cat.Exposure_2_name}</div>
                  <div style={{ color: 'var(--text2)' }}>Control: {cat.Control_name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* External table */}
        {data.length > 0 && (
          <div className="chart-card full">
            <div className="chart-title">External Risk Categories — {selectedYear}</div>
            <div style={{ overflowX: 'auto' }}>
              <table className="heatmap-table">
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left' }}>Risk Category</th>
                    {BANKS.map(b => (
                      <th key={b}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
                          <div className="bank-dot" style={{ background: BANK_META[b].color, width: 8, height: 8 }} />
                          {BANK_META[b].shortName}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {externalCats.map(cat => (
                    <tr key={cat.Category_ID}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{cat.Category_ID}</div>
                        <div style={{ fontSize: 11, color: 'var(--text2)', maxWidth: 200 }}>{cat.Risk_category}</div>
                      </td>
                      {BANKS.map(bank => {
                        const row = data.find(r => r.Bank === bank && r.Year === selectedYear && r.Category_ID === cat.Category_ID);
                        const v   = row?.Final_risk_estimate ?? 0;
                        const bg  = v >= 3.5 ? '#c0392b' : v >= 3.0 ? '#7c5a00' : v >= 2.0 ? '#1c3a5c' : '#1a5c35';
                        return (
                          <td key={bank} style={{ background: bg }}>
                            <span className="cell-score">{v > 0 ? v.toFixed(2) : '—'}</span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        OSFI-FCAC AI Risk Framework · Sources: Annual Reports, MD&amp;A, Q4 Earnings Transcripts, AI News Releases (2020–2025)
      </footer>
    </>
  );
}
