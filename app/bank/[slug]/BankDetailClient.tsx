'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { getAnnualSummary, getBankRiskDetail, getOSFITaxonomy } from '@/lib/data';
import { BANK_META, BANKS, YEARS } from '@/types';
import type { AnnualSummary, BankRiskDetail, OSFITaxonomy } from '@/types';

/* ─────────────────────────────────────────────────────────────────
   MILESTONE DATA
   To edit: find the bank key below and add / remove items.
   Each item has: year, category, text, source
   Valid categories: strategy | hire | tech | award | risk
   ───────────────────────────────────────────────────────────────── */
const MILESTONES: Record<string, Array<{ year: number; category: string; text: string; source: string }>> = {
  TD: [
    { year: 2020, category: 'tech',     text: 'TD Layer 6 AI Lab launched; AI-powered COVID-19 customer identification program deployed.',        source: 'TD Annual Report 2020' },
    { year: 2021, category: 'tech',     text: 'Enterprise data & analytics platform migrated to cloud; colleague chatbots deployed.',               source: 'TD Annual Report 2021' },
    { year: 2022, category: 'strategy', text: 'TD Invent established; Layer 6 Research publishes at top AI conferences.',                           source: 'TD Annual Report 2022' },
    { year: 2023, category: 'strategy', text: 'GenAI practice launched; model standardisation platform rolled out; Redwood AI exploration.',        source: 'TD Annual Report 2023' },
    { year: 2024, category: 'award',    text: 'Recognised as Canada\'s most active AI patent filer; GenAI practice expanded to U.S. market.',       source: 'TD AI News Releases 2020-2026' },
    { year: 2025, category: 'strategy', text: 'AI Centre of Excellence launched; Enterprise GenAI Platform live; AI Prism foundational model released; AI risk disclosure extended to all business lines.', source: 'TD AI News Releases 2020-2026' },
  ],
  Scotiabank: [
    { year: 2020, category: 'strategy', text: 'Digital banking strategy accelerated; API open-banking ecosystem construction begins.',              source: 'Scotiabank Annual Report 2020' },
    { year: 2021, category: 'tech',     text: 'Partnership with Symend for AI-driven customer retention.',                                          source: 'Scotiabank Annual Report 2021' },
    { year: 2022, category: 'tech',     text: 'AI + HD video banking service launched; digital customer journeys fully revamped.',                  source: 'Scotiabank Annual Report 2022' },
    { year: 2023, category: 'strategy', text: '"First on the Future" strategy published; generative AI pilot projects initiated.',                  source: 'Scotiabank Annual Report 2023' },
    { year: 2024, category: 'hire',     text: 'AI governance committee established; responsible AI framework formalised.',                          source: 'Scotiabank AI News Releases 2020-2026' },
    { year: 2025, category: 'strategy', text: 'AI-assisted wealth management platform upgraded; digital transformation acceleration plan (FY26–28) released.', source: 'Scotiabank AI News Releases 2020-2026' },
  ],
  RBC: [
    { year: 2020, category: 'strategy', text: 'Digital-first strategy deepened; AI risk governance integrated into Enterprise Risk Framework.',    source: 'RBC Annual Report 2020' },
    { year: 2021, category: 'tech',     text: 'NOMI Insights & NOMI Find and Save launched; AI-driven financial wellness tools gain market recognition.', source: 'RBC Annual Report 2021' },
    { year: 2022, category: 'award',    text: 'Aviva Direct insurance platform wins AI innovation award; digital user base exceeds 12 million.',   source: 'RBC Annual Report 2022' },
    { year: 2023, category: 'strategy', text: 'Borealis AI research deepened; responsible AI framework published.',                               source: 'RBC Annual Report 2023' },
    { year: 2024, category: 'strategy', text: 'Borealis AI celebrates 10th anniversary; Toronto AI Innovation Summit co-hosted.',                 source: 'RBC AI News Releases 2020-2026' },
    { year: 2025, category: 'award',    text: 'Evident AI Index — Ranked #1 globally in AI talent development (consecutive years); AI governance leadership recognised.', source: 'RBC AI News Releases 2020-2026' },
  ],
  'National Bank of Canada': [
    { year: 2020, category: 'strategy', text: 'Digital banking strategy accelerated; AI risk framework included in annual disclosure.',            source: 'NBC Annual Report 2020' },
    { year: 2021, category: 'tech',     text: 'NAventures invests in Element AI (AI-First platform); enterprise AI capability foundation built.',  source: 'NBC Annual Report 2021 / NAventures' },
    { year: 2022, category: 'strategy', text: '"AI Factory" architecture introduced — centralised AI capability model for business-unit customisation.', source: 'NBC Annual Report 2022' },
    { year: 2023, category: 'tech',     text: 'NAventures invests in Maxa (enterprise AI insights) and Nova Credit (AI credit infrastructure).', source: 'NBC NAventures / Fintech.ca' },
    { year: 2024, category: 'tech',     text: 'Kyndryl partnership for cloud & AI modernisation; Concordia University trustworthy AI research collaboration ($1.5M / 5 years).', source: 'NBC AI News Releases 2020-2026' },
    { year: 2025, category: 'strategy', text: 'AI Factory model expanded; AI risk disclosure covers all business lines.',                          source: 'NBC AI News Releases 2020-2026' },
  ],
  CIBC: [
    { year: 2020, category: 'strategy', text: 'CIBC Digital strategy launched; AI applied to fraud detection workflows.',                          source: 'CIBC Annual Report 2020' },
    { year: 2021, category: 'tech',     text: 'Employee productivity AI tools piloted; MD&A formally introduces AI risk factor.',                  source: 'CIBC Annual Report 2021' },
    { year: 2022, category: 'strategy', text: 'CIBC Ventures AI investment portfolio expanded; digital transformation accelerated.',               source: 'CIBC Annual Report 2022' },
    { year: 2023, category: 'strategy', text: 'CLIX platform AI recommendation engine goes live; regulatory compliance AI tools explored.',        source: 'CIBC Annual Report 2023' },
    { year: 2024, category: 'strategy', text: 'Responsible AI framework officially published; enterprise-wide AI literacy training launched.',     source: 'CIBC AI News Releases 2020-2026' },
    { year: 2025, category: 'strategy', text: 'AI-driven wealth management experience upgraded; Enterprise GenAI programme initiated.',            source: 'CIBC AI News Releases 2020-2026' },
  ],
  BMO: [
    { year: 2020, category: 'strategy', text: 'Digital First strategy deepened; AI embedded into core business processes.',                        source: 'BMO Annual Report 2020' },
    { year: 2021, category: 'tech',     text: 'OLI (Operational Loss Intelligence) ML system deployed for trading-desk risk.',                    source: 'BMO Annual Report 2021' },
    { year: 2022, category: 'tech',     text: 'BMO Insights analytics platform; partnership with RiskFuel (Nvidia) for derivative pricing models.', source: 'BMO Annual Report 2022' },
    { year: 2023, category: 'strategy', text: 'Cautious GenAI evaluation stance; Bank of the West acquisition completed — AI scale-up accelerates.', source: 'BMO Annual Report 2023' },
    { year: 2024, category: 'hire',     text: 'Kristin Milchanowski appointed Chief AI & Data Officer (Oxford PhD, ex-JPMorgan / EY); Microsoft partnership for Canada\'s first AI-powered insurance digital assistant.', source: 'BMO AI News Releases 2020-2026' },
    { year: 2025, category: 'award',    text: 'First Canadian bank to join IBM Quantum Network; Evident AI Index #1 in AI talent development globally; 11 AI & Digital Innovation awards; Lumi Assistant (enterprise GenAI) launched.', source: 'BMO AI News Releases 2020-2026' },
    { year: 2026, category: 'strategy', text: 'BMO Institute for Applied AI & Quantum established; "Return on Intelligence" podcast launched.', source: 'BMO Newsroom 2026' },
  ],
};

const CAT_COLORS: Record<string, string> = { strategy: 'cat-strategy', hire: 'cat-hire', tech: 'cat-tech', award: 'cat-award', risk: 'cat-risk' };
const CAT_LABELS: Record<string, string> = { strategy: 'Strategy', hire: 'Leadership', tech: 'Technology', award: 'Award', risk: 'Risk' };

function RadarChart({ data, categories, bank }: { data: BankRiskDetail[]; categories: OSFITaxonomy[]; bank: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const echarts = (window as any).echarts;
    if (!echarts) return;
    const chart = echarts.init(ref.current);
    const last4 = YEARS.slice(-4);
    chart.setOption({
      backgroundColor: 'transparent',
      tooltip: { trigger: 'item', backgroundColor: '#21262d', borderColor: '#30363d', textStyle: { color: '#e6edf3' } },
      legend: { top: 0, right: 0, textStyle: { color: '#8b949e', fontSize: 11 }, data: last4.map(String) },
      radar: {
        indicator: categories.map(c => ({ name: c.Risk_category, max: 5 })),
        axisName: { color: '#8b949e', fontSize: 10, overflow: 'truncate', width: 110 },
        splitArea: { areaStyle: { color: ['transparent', '#161b22'] } },
        axisLine: { lineStyle: { color: '#30363d' } },
        splitLine: { lineStyle: { color: '#21262d' } },
        radius: '62%',
      },
      series: last4.map((year, i) => ({
        type: 'radar',
        name: String(year),
        data: [categories.map(cat => {
          const r = data.find(r => r.Bank === bank && r.Year === year && r.Category_ID === cat.Category_ID);
          return r ? +r.Final_risk_estimate.toFixed(2) : 0;
        })],
        lineStyle: { width: i === last4.length - 1 ? 3 : 1.5, opacity: i === last4.length - 1 ? 1 : 0.35 },
        itemStyle: { color: i === last4.length - 1 ? BANK_META[bank].color : '#8b949e' },
        areaStyle: { opacity: i === last4.length - 1 ? 0.15 : 0.03 },
        symbol: i === last4.length - 1 ? 'circle' : 'none',
        symbolSize: i === last4.length - 1 ? 4 : 0,
      })),
    });
    const obs = new ResizeObserver(() => chart.resize());
    obs.observe(ref.current!);
    return () => { obs.disconnect(); chart.dispose(); };
  }, [data, categories, bank]);
  return <div ref={ref} style={{ width: '100%', height: 420 }} />;
}

function TrendChart({ data, bank }: { data: AnnualSummary[]; bank: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const echarts = (window as any).echarts;
    if (!echarts) return;
    const chart = echarts.init(ref.current);
    const rows = data.filter(r => r.Bank === bank);
    chart.setOption({
      backgroundColor: 'transparent',
      tooltip: { trigger: 'axis', backgroundColor: '#21262d', borderColor: '#30363d', textStyle: { color: '#e6edf3' } },
      legend: { top: 0, right: 0, textStyle: { color: '#8b949e', fontSize: 11 } },
      grid: { top: 32, left: 44, right: 16, bottom: 40 },
      xAxis: { type: 'category', data: YEARS.map(String), axisLine: { lineStyle: { color: '#30363d' } }, axisTick: { show: false }, axisLabel: { color: '#8b949e' } },
      yAxis: { type: 'value', min: 1, max: 5, axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: '#8b949e' }, splitLine: { lineStyle: { color: '#21262d', type: 'dashed' } } },
      series: [
        { name: 'Overall',  type: 'line', smooth: true, data: YEARS.map(y => rows.find(r => r.Year === y)?.Average_overall_risk  ?? null), lineStyle: { width: 3, color: BANK_META[bank].color }, itemStyle: { color: BANK_META[bank].color }, symbol: 'circle', symbolSize: 6 },
        { name: 'Internal', type: 'line', smooth: true, data: YEARS.map(y => rows.find(r => r.Year === y)?.Average_internal_risk ?? null), lineStyle: { width: 1.5, color: '#58a6ff', type: 'dashed' }, itemStyle: { color: '#58a6ff' }, symbol: 'none' },
        { name: 'External', type: 'line', smooth: true, data: YEARS.map(y => rows.find(r => r.Year === y)?.Average_external_risk ?? null), lineStyle: { width: 1.5, color: '#f0883e', type: 'dashed' }, itemStyle: { color: '#f0883e' }, symbol: 'none' },
      ],
    });
    const obs = new ResizeObserver(() => chart.resize());
    obs.observe(ref.current!);
    return () => { obs.disconnect(); chart.dispose(); };
  }, [data, bank]);
  return <div ref={ref} style={{ width: '100%', height: 280 }} />;
}

function riskLabel(v: number) {
  if (v >= 3.5) return { text: 'Very High', cls: 'badge-red' };
  if (v >= 3.0) return { text: 'High',      cls: 'badge-yellow' };
  if (v >= 2.0) return { text: 'Moderate',  cls: 'badge-blue' };
  return            { text: 'Low',       cls: 'badge-green' };
}

export default function BankDetailClient({ slug }: { slug: string }) {
  const bankKey = decodeURIComponent(slug);
  const valid   = BANKS.includes(bankKey as any);

  const [summary,    setSummary]    = useState<AnnualSummary[]>([]);
  const [risk,       setRisk]       = useState<BankRiskDetail[]>([]);
  const [categories, setCategories] = useState<OSFITaxonomy[]>([]);
  const [tab,        setTab]        = useState<'overview' | 'milestones' | 'risks'>('overview');

  useEffect(() => {
    if (!valid) return;
    getAnnualSummary().then(setSummary);
    getBankRiskDetail().then(setRisk);
    getOSFITaxonomy().then(setCategories);
  }, [valid]);

  if (!valid) return (
    <div style={{ padding: 40, color: '#8b949e' }}>Bank not found. <Link href="/">← Back to Dashboard</Link></div>
  );

  const meta       = BANK_META[bankKey];
  const latest     = YEARS[YEARS.length - 1];
  const latestRow  = summary.find(r => r.Bank === bankKey && r.Year === latest);
  const milestones = MILESTONES[bankKey] || [];

  return (
    <>
      <nav className="nav">
        <span className="nav-brand">Canada <span>Big-6</span> AI Risk Tracker</span>
        <ul className="nav-links">
          <li><a href="/">Dashboard</a></li>
          <li><a href="/heatmap/">Risk Heatmap</a></li>
          <li><a href="/methodology/">Methodology</a></li>
        </ul>
        <Link href="/" style={{ marginLeft: 'auto', fontSize: 12, color: '#8b949e' }}>← Back</Link>
      </nav>

      <main className="main">
        <div className="bank-header">
          <div>
            <h1>
              <span className="bank-dot" style={{ background: meta.color, width: 16, height: 16, borderRadius: '50%', display: 'inline-block', marginRight: 12, verticalAlign: 'middle' }} />
              {meta.shortName}
            </h1>
            <div className="full-name">{meta.fullName}</div>
          </div>
          {latestRow && (
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {[
                { val: latestRow.Average_overall_risk,  label: `Overall ${latest}`,  color: latestRow.Average_overall_risk >= 3.5 ? '#f85149' : latestRow.Average_overall_risk >= 3.0 ? '#d29922' : '#3fb950' },
                { val: latestRow.Average_internal_risk, label: 'Internal Risk', color: '#58a6ff' },
                { val: latestRow.Average_external_risk, label: 'External Risk', color: '#f0883e' },
              ].map(({ val, label, color }) => (
                <div key={label} className="score-badge">
                  <div className="val" style={{ color }}>{val.toFixed(2)}</div>
                  <div className="label">{label}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="detail-tabs">
          {(['overview', 'milestones', 'risks'] as const).map(t => (
            <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
              {t === 'overview' ? 'Overview' : t === 'milestones' ? 'AI Milestones' : 'Risk Radar'}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div>
            <div className="chart-grid">
              <div className="chart-card">
                <div className="chart-title">Risk Trend 2020–2025</div>
                <TrendChart data={summary} bank={bankKey} />
                <div className="chart-subtitle">Solid = Overall · Blue dashed = Internal · Orange dashed = External</div>
              </div>
              <div className="chart-card">
                <div className="chart-title">{latest} Strategy Snapshot</div>
                {latestRow && (
                  <>
                    <p className="prose" style={{ marginBottom: 16 }}>{latestRow.Annual_AI_summary}</p>
                    <div style={{ background: 'var(--surface2)', borderRadius: 8, padding: 12 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 6, color: 'var(--text)' }}>Sources</div>
                      {latestRow.Source_refs.split(';').map((s, i) => (
                        <div key={i} style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)', marginBottom: 2 }}>· {s.trim()}</div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="chart-card">
              <div className="chart-title">Annual Score History</div>
              <table className="risk-table">
                <thead>
                  <tr><th>Year</th><th>Overall</th><th>Internal</th><th>External</th><th>Level</th></tr>
                </thead>
                <tbody>
                  {[...YEARS].reverse().map(y => {
                    const row = summary.find(r => r.Bank === bankKey && r.Year === y);
                    if (!row) return null;
                    const rl = riskLabel(row.Average_overall_risk);
                    return (
                      <tr key={y}>
                        <td style={{ fontFamily: 'var(--mono)', fontWeight: 600 }}>{y}</td>
                        <td><span style={{ color: rl.cls === 'badge-red' ? '#f85149' : rl.cls === 'badge-yellow' ? '#d29922' : '#3fb950', fontFamily: 'var(--mono)', fontWeight: 700 }}>{row.Average_overall_risk.toFixed(2)}</span></td>
                        <td><span style={{ color: '#58a6ff', fontFamily: 'var(--mono)' }}>{row.Average_internal_risk.toFixed(2)}</span></td>
                        <td><span style={{ color: '#f0883e', fontFamily: 'var(--mono)' }}>{row.Average_external_risk.toFixed(2)}</span></td>
                        <td><span className={`badge ${rl.cls}`}>{rl.text}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MILESTONES */}
        {tab === 'milestones' && (
          <div className="chart-card">
            <div className="chart-title">AI Milestone Timeline</div>
            <div style={{ marginBottom: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {Object.entries(CAT_LABELS).map(([k, v]) => (
                <span key={k} className={`tl-category ${CAT_COLORS[k]}`}>{v}</span>
              ))}
            </div>
            <div className="timeline">
              {[...new Set(milestones.map(m => m.year))].sort((a, b) => b - a).map(y => (
                <div key={y}>
                  <div className="tl-year">{y}</div>
                  {milestones.filter(m => m.year === y).map((m, i) => (
                    <div key={i} className="tl-item">
                      <span className={`tl-category ${CAT_COLORS[m.category]}`}>{CAT_LABELS[m.category]}</span>
                      <div className="tl-text" style={{ marginTop: 4 }}>{m.text}</div>
                      <div className="tl-source">{m.source}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RISK RADAR */}
        {tab === 'risks' && (
          <div>
            <div className="chart-card" style={{ marginBottom: 24 }}>
              <div className="chart-title">Risk Radar 2022–{latest} ({latest} highlighted)</div>
              <RadarChart data={risk} categories={categories} bank={bankKey} />
              <div className="chart-subtitle">Last 4 years overlaid · {latest} = solid line</div>
            </div>
            <div className="chart-card">
              <div className="chart-title">{latest} Risk Score Detail</div>
              <div style={{ overflowX: 'auto' }}>
                <table className="risk-table">
                  <thead>
                    <tr><th>Category</th><th>Bucket</th><th>Exp 1</th><th>Exp 2</th><th>Control</th><th>Raw Exp</th><th>Final Risk</th><th>Confidence</th></tr>
                  </thead>
                  <tbody>
                    {risk.filter(r => r.Bank === bankKey && r.Year === latest).map(row => {
                      const rl = riskLabel(row.Final_risk_estimate);
                      return (
                        <tr key={row.Category_ID}>
                          <td style={{ fontWeight: 600 }}>{row.Category_ID} · {row.Risk_category}</td>
                          <td><span style={{ fontSize: 11, color: 'var(--text2)' }}>{row.OSFI_bucket}</span></td>
                          <td><span style={{ fontFamily: 'var(--mono)', color: '#f85149' }}>{row.Exposure_1_score}</span></td>
                          <td><span style={{ fontFamily: 'var(--mono)', color: '#f85149' }}>{row.Exposure_2_score}</span></td>
                          <td><span style={{ fontFamily: 'var(--mono)', color: '#3fb950' }}>{row.Control_score}</span></td>
                          <td><span style={{ fontFamily: 'var(--mono)' }}>{row.Raw_exposure.toFixed(2)}</span></td>
                          <td><span className={`badge ${rl.cls}`}>{row.Final_risk_estimate.toFixed(2)}</span></td>
                          <td><span style={{ fontFamily: 'var(--mono)', color: 'var(--text2)' }}>{row.Confidence}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
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
