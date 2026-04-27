'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { getAnnualSummary } from '@/lib/data';
import { BANK_META, BANKS, YEARS } from '@/types';
import type { AnnualSummary } from '@/types';

function RiskTrendChart({ data }: { data: AnnualSummary[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const echarts = (window as any).echarts;
    if (!echarts) return;
    const chart = echarts.init(ref.current, null, { renderer: 'canvas' });
    const series = BANKS.map(bank => ({
      name: BANK_META[bank].shortName,
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 5,
      lineStyle: { width: 2.5 },
      itemStyle: { color: BANK_META[bank].color },
      data: YEARS.map(y => {
        const row = data.find(r => r.Bank === bank && r.Year === y);
        return row ? +row.Average_overall_risk.toFixed(2) : null;
      }),
    }));
    chart.setOption({
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#21262d',
        borderColor: '#30363d',
        textStyle: { color: '#e6edf3', fontSize: 12 },
        formatter: (params: any[]) => {
          let s = `<div style="font-weight:700;margin-bottom:4px">${params[0].axisValue}</div>`;
          params.forEach(p => {
            if (p.value == null) return;
            s += `<div style="display:flex;align-items:center;gap:6px;margin:2px 0"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${p.color}"></span><span>${p.seriesName}: <b>${p.value}</b></span></div>`;
          });
          return s;
        },
      },
      legend: { top: 0, right: 0, textStyle: { color: '#8b949e', fontSize: 11 }, itemWidth: 12, itemHeight: 8 },
      grid: { top: 32, left: 44, right: 16, bottom: 40 },
      xAxis: { type: 'category', data: YEARS.map(String), axisLine: { lineStyle: { color: '#30363d' } }, axisTick: { show: false }, axisLabel: { color: '#8b949e', fontSize: 12 } },
      yAxis: { type: 'value', min: 1, max: 5, splitNumber: 4, axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: '#8b949e', fontSize: 11 }, splitLine: { lineStyle: { color: '#21262d', type: 'dashed' } } },
      series,
    });
    const obs = new ResizeObserver(() => chart.resize());
    obs.observe(ref.current!);
    return () => { obs.disconnect(); chart.dispose(); };
  }, [data]);
  return <div ref={ref} style={{ width: '100%', height: 300 }} />;
}

function InternalExternalBar({ data }: { data: AnnualSummary[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const echarts = (window as any).echarts;
    if (!echarts) return;
    const chart = echarts.init(ref.current);
    const latest = YEARS[YEARS.length - 1];
    chart.setOption({
      backgroundColor: 'transparent',
      tooltip: { trigger: 'axis', backgroundColor: '#21262d', borderColor: '#30363d', textStyle: { color: '#e6edf3', fontSize: 12 }, axisPointer: { type: 'shadow' } },
      legend: { bottom: 0, textStyle: { color: '#8b949e', fontSize: 11 } },
      grid: { top: 16, left: 16, right: 16, bottom: 48 },
      xAxis: { type: 'category', data: BANKS.map(b => BANK_META[b].shortName), axisLine: { lineStyle: { color: '#30363d' } }, axisTick: { show: false }, axisLabel: { color: '#8b949e', fontSize: 11, rotate: 30 } },
      yAxis: { type: 'value', min: 0, max: 5, axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: '#8b949e', fontSize: 11 }, splitLine: { lineStyle: { color: '#21262d', type: 'dashed' } } },
      series: [
        { name: 'Internal Risk', type: 'bar', stack: 'total', itemStyle: { color: '#58a6ff' }, barWidth: '50%' },
        { name: 'External Risk', type: 'bar', stack: 'total', itemStyle: { color: '#f0883e' }, barWidth: '50%' },
      ],
      dataset: {
        dimensions: ['bank', 'Internal Risk', 'External Risk'],
        source: BANKS.map(bank => {
          const row = data.find(r => r.Bank === bank && r.Year === latest);
          return { bank: BANK_META[bank].shortName, 'Internal Risk': row?.Average_internal_risk ?? 0, 'External Risk': row?.Average_external_risk ?? 0 };
        }),
      },
    });
    const obs = new ResizeObserver(() => chart.resize());
    obs.observe(ref.current!);
    return () => { obs.disconnect(); chart.dispose(); };
  }, [data]);
  return <div ref={ref} style={{ width: '100%', height: 280 }} />;
}

function RiskRankingChart({ data }: { data: AnnualSummary[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const echarts = (window as any).echarts;
    if (!echarts) return;
    const chart = echarts.init(ref.current);
    const latest = YEARS[YEARS.length - 1];
    const sorted = [...BANKS].sort((a, b) => {
      const ra = data.find(r => r.Bank === a && r.Year === latest)?.Average_overall_risk ?? 0;
      const rb = data.find(r => r.Bank === b && r.Year === latest)?.Average_overall_risk ?? 0;
      return rb - ra;
    });
    chart.setOption({
      backgroundColor: 'transparent',
      tooltip: { trigger: 'axis', backgroundColor: '#21262d', borderColor: '#30363d', textStyle: { color: '#e6edf3', fontSize: 12 }, axisPointer: { type: 'shadow' } },
      grid: { top: 16, left: 16, right: 16, bottom: 40 },
      xAxis: { type: 'category', data: sorted.map(b => BANK_META[b].shortName), axisLine: { lineStyle: { color: '#30363d' } }, axisTick: { show: false }, axisLabel: { color: '#8b949e', fontSize: 11, rotate: 30 } },
      yAxis: { type: 'value', min: 0, max: 5, axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: '#8b949e', fontSize: 11 }, splitLine: { lineStyle: { color: '#21262d', type: 'dashed' } } },
      series: [{
        type: 'bar',
        data: sorted.map(bank => {
          const row = data.find(r => r.Bank === bank && r.Year === latest);
          const v = row?.Average_overall_risk ?? 0;
          return { value: +v.toFixed(2), itemStyle: { color: v >= 3.5 ? '#f85149' : v >= 3.0 ? '#d29922' : '#3fb950', borderRadius: [4, 4, 0, 0] } };
        }),
        barWidth: '55%',
        label: { show: true, position: 'top', color: '#8b949e', fontSize: 11, formatter: '{c}' },
      }],
    });
    const obs = new ResizeObserver(() => chart.resize());
    obs.observe(ref.current!);
    return () => { obs.disconnect(); chart.dispose(); };
  }, [data]);
  return <div ref={ref} style={{ width: '100%', height: 280 }} />;
}

function riskLabel(v: number) {
  if (v >= 3.5) return { text: 'Very High', cls: 'badge-red' };
  if (v >= 3.0) return { text: 'High',      cls: 'badge-yellow' };
  if (v >= 2.0) return { text: 'Moderate',  cls: 'badge-blue' };
  return            { text: 'Low',       cls: 'badge-green' };
}

export default function HomePage() {
  const [data, setData] = useState<AnnualSummary[]>([]);
  useEffect(() => { getAnnualSummary().then(setData); }, []);

  const latest = YEARS[YEARS.length - 1];
  const prev   = YEARS[YEARS.length - 2];

  return (
    <>
      <nav className="nav">
        <span className="nav-brand">Canada <span>Big-6</span> AI Risk Tracker</span>
        <ul className="nav-links">
          <li><a href="/"           className="active">Dashboard</a></li>
          <li><a href="/heatmap">Risk Heatmap</a></li>
          <li><a href="/methodology">Methodology</a></li>
        </ul>
        <span style={{ marginLeft: 'auto', fontSize: 11, color: '#8b949e', fontFamily: 'var(--mono)' }}>
          2020–2025 · OSFI-FCAC Framework
        </span>
      </nav>

      <main className="main">
        <span className="section-label">Overview · {latest}</span>
        <h1 className="section-title">Canada Big-6 AI Risk Dashboard</h1>

        {/* Bank Cards */}
        <div className="bank-grid">
          {BANKS.map(bank => {
            const cur  = data.find(r => r.Bank === bank && r.Year === latest);
            const pre  = data.find(r => r.Bank === bank && r.Year === prev);
            const delta = cur && pre ? +(cur.Average_overall_risk - pre.Average_overall_risk).toFixed(2) : 0;
            const trend = delta > 0.05 ? '↑' : delta < -0.05 ? '↓' : '→';
            const trendClass = delta > 0.05 ? 'trend-up' : delta < -0.05 ? 'trend-down' : 'trend-flat';
            const meta = BANK_META[bank];
            const rl = cur ? riskLabel(cur.Average_overall_risk) : null;
            return (
              <Link key={bank} href={`/bank/${encodeURIComponent(bank)}`} className="bank-card">
                <div className="bank-card-top">
                  <div>
                    <div className="bank-name">{meta.shortName}</div>
                    <div className="bank-full">{meta.fullName}</div>
                  </div>
                  <div className="bank-dot" style={{ background: meta.color }} />
                </div>
                {cur && (
                  <>
                    <div className="bank-score" style={{ color: cur.Average_overall_risk >= 3.5 ? '#f85149' : cur.Average_overall_risk >= 3.0 ? '#d29922' : '#3fb950' }}>
                      {cur.Average_overall_risk.toFixed(2)}
                    </div>
                    {rl && <span className={`badge ${rl.cls}`} style={{ marginTop: 6 }}>{rl.text}</span>}
                  </>
                )}
                <div className={`bank-trend ${trendClass}`} style={{ marginTop: 6 }}>
                  {trend} {Math.abs(delta)} vs {prev}
                </div>
                <div className="bank-meta">
                  Int: {cur?.Average_internal_risk.toFixed(2) ?? '—'} · Ext: {cur?.Average_external_risk.toFixed(2) ?? '—'}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Charts */}
        <div className="chart-grid">
          <div className="chart-card full">
            <div className="chart-title">Overall Risk Trend 2020–2025</div>
            <RiskTrendChart data={data} />
            <div className="chart-subtitle">Score 1–5 · Higher = greater AI exposure relative to controls</div>
          </div>
          <div className="chart-card">
            <div className="chart-title">Risk Composition {latest} (Internal vs External)</div>
            <InternalExternalBar data={data} />
            <div className="chart-subtitle">Blue = Internal Risk · Orange = External Risk</div>
          </div>
          <div className="chart-card">
            <div className="chart-title">Overall Risk Ranking {latest}</div>
            <RiskRankingChart data={data} />
            <div className="chart-subtitle">Red ≥ 3.5 · Yellow ≥ 3.0 · Green &lt; 3.0</div>
          </div>
        </div>

        {/* Year table */}
        <div className="chart-card" style={{ marginBottom: 32 }}>
          <div className="chart-title">Annual Overall Risk Summary</div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--text2)', fontWeight: 500 }}>Bank</th>
                  {YEARS.map(y => <th key={y} style={{ textAlign: 'center', padding: '8px', color: 'var(--text2)', fontWeight: 500 }}>{y}</th>)}
                </tr>
              </thead>
              <tbody>
                {BANKS.map(bank => {
                  const meta = BANK_META[bank];
                  return (
                    <tr key={bank} style={{ borderBottom: '1px solid var(--surface2)' }}>
                      <td style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="bank-dot" style={{ background: meta.color, width: 8, height: 8 }} />
                        <span style={{ fontWeight: 500 }}>{meta.shortName}</span>
                      </td>
                      {YEARS.map(y => {
                        const row = data.find(r => r.Bank === bank && r.Year === y);
                        if (!row) return <td key={y} style={{ textAlign: 'center', padding: 8, color: '#8b949e' }}>—</td>;
                        const v = row.Average_overall_risk;
                        const color = v >= 3.5 ? '#f85149' : v >= 3.0 ? '#d29922' : '#3fb950';
                        return <td key={y} style={{ textAlign: 'center', padding: 8 }}><span style={{ color, fontFamily: 'var(--mono)', fontWeight: 600 }}>{v.toFixed(2)}</span></td>;
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2025 summaries */}
        <div style={{ marginBottom: 32 }}>
          <div className="chart-title">{latest} AI Strategy Snapshot — All Banks</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
            {BANKS.map(bank => {
              const row  = data.find(r => r.Bank === bank && r.Year === latest);
              const meta = BANK_META[bank];
              if (!row) return null;
              const rl = riskLabel(row.Average_overall_risk);
              return (
                <div key={bank} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <div className="bank-dot" style={{ background: meta.color }} />
                    <span style={{ fontWeight: 600, fontSize: 13 }}>{meta.shortName}</span>
                    <span className={`badge ${rl.cls}`} style={{ marginLeft: 4 }}>{rl.text}</span>
                    <span style={{ marginLeft: 'auto', fontFamily: 'var(--mono)', fontSize: 20, fontWeight: 700, color: row.Average_overall_risk >= 3.5 ? '#f85149' : row.Average_overall_risk >= 3.0 ? '#d29922' : '#3fb950' }}>
                      {row.Average_overall_risk.toFixed(2)}
                    </span>
                  </div>
                  <p className="prose">{row.Annual_AI_summary}</p>
                  <div style={{ fontSize: 10, color: 'var(--text2)', marginTop: 8, fontFamily: 'var(--mono)' }}>{row.Source_refs}</div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <footer className="footer">
        OSFI-FCAC AI Risk Framework · Sources: Annual Reports, MD&amp;A, Q4 Earnings Transcripts, AI News Releases (2020–2025)
      </footer>
    </>
  );
}
