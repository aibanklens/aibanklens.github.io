import Link from 'next/link';

export default function MethodologyPage() {
  return (
    <>
      <nav className="nav">
        <span className="nav-brand">Canada <span>Big-6</span> AI Risk Tracker</span>
        <ul className="nav-links">
          <li><a href="/">Dashboard</a></li>
          <li><a href="/heatmap">Risk Heatmap</a></li>
          <li><a href="/methodology" className="active">Methodology</a></li>
        </ul>
      </nav>

      <main className="main" style={{ maxWidth: 900 }}>
        <span className="section-label">Framework · Documentation</span>
        <h1 className="section-title">OSFI-FCAC AI Risk Assessment Methodology</h1>

        {/* Scoring formula */}
        <div className="chart-card" style={{ marginBottom: 24 }}>
          <div className="chart-title">Scoring Framework</div>
          <p className="prose" style={{ marginBottom: 16 }}>
            This framework is based on guidelines from <strong>OSFI</strong> (Office of the Superintendent of Financial Institutions) and <strong>FCAC</strong> (Financial Consumer Agency of Canada) for managing AI-related risk. It is applied to assess AI exposure and governance quality across Canada&apos;s six largest commercial banks.
          </p>
          <div style={{ background: 'var(--surface2)', borderRadius: 10, padding: 20, fontFamily: 'var(--mono)', fontSize: 13 }}>
            <div style={{ color: '#58a6ff', fontWeight: 700, marginBottom: 12 }}>Final_risk_estimate =</div>
            <div style={{ color: 'var(--text)', fontSize: 16 }}>
              <span style={{ background: '#1f406820', padding: '4px 10px', borderRadius: 4, color: '#f85149' }}>avg(Exposure₁, Exposure₂)</span>
              <span style={{ color: 'var(--text2)', margin: '0 12px' }}>−</span>
              <span style={{ background: '#1f406820', padding: '4px 10px', borderRadius: 4, color: '#3fb950' }}>0.25 × (Control − 3)</span>
            </div>
            <div style={{ marginTop: 14, fontSize: 12, color: 'var(--text2)', lineHeight: 1.8 }}>
              · <strong style={{ color: 'var(--text)' }}>Exposure (1–5):</strong> Each risk category has two exposure sub-scores reflecting AI usage breadth, complexity, and external dependencies.<br />
              · <strong style={{ color: 'var(--text)' }}>Control (1–5):</strong> Governance/control sub-score. 3 = baseline. Above 3 reduces risk; below 3 increases it.<br />
              · <strong style={{ color: 'var(--text)' }}>Final score range:</strong> 1 (lowest risk) to 5 (highest risk).
            </div>
          </div>
        </div>

        {/* Risk categories */}
        <div className="chart-card" style={{ marginBottom: 24 }}>
          <div className="chart-title">9 Risk Categories</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent)', marginBottom: 12 }}>Internal Risk</div>
              {[
                ['INT1', 'Data Governance, Privacy & Data Quality Risk', 'Sensitive data use / External data processing complexity'],
                ['INT2', 'Model Risk', 'High-impact AI use case intensity / Third-party model dependency'],
                ['INT3', 'Third-Party / Cloud / Concentration Risk', 'Cloud dependence / Vendor concentration'],
                ['INT4', 'Algorithmic Bias & Fairness Risk', 'High-risk AI decision scope / Bias mitigation measures'],
                ['INT5', 'Cybersecurity & Fraud Risk', 'Fraud AI usage breadth / External threat exposure'],
              ].map(([id, cat, exp]) => (
                <div key={id} style={{ marginBottom: 14, fontSize: 12 }}>
                  <div style={{ fontWeight: 700, color: 'var(--text)' }}>{id} · {cat}</div>
                  <div style={{ color: 'var(--text2)', marginTop: 2 }}>Exposure: {exp}</div>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#f0883e', marginBottom: 12 }}>External Risk</div>
              {[
                ['EXT1', 'Regulatory & Compliance Risk', 'Regulatory mention frequency / Compliance disclosure quality'],
                ['EXT2', 'Competitive & Market Risk', 'AI competitive positioning / Technology disruption speed'],
                ['EXT3', 'Systemic / Contagion Risk', 'Industry AI risk contagion exposure / Ecosystem dependency'],
                ['EXT4', 'Reputational & Consumer Trust Risk', 'Public AI perception / Consumer protection record'],
              ].map(([id, cat, exp]) => (
                <div key={id} style={{ marginBottom: 14, fontSize: 12 }}>
                  <div style={{ fontWeight: 700, color: 'var(--text)' }}>{id} · {cat}</div>
                  <div style={{ color: 'var(--text2)', marginTop: 2 }}>Exposure: {exp}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Score scale */}
        <div className="chart-card" style={{ marginBottom: 24 }}>
          <div className="chart-title">Score Interpretation</div>
          <div style={{ display: 'grid', gap: 10 }}>
            {[
              ['5', '#f85149', 'Very High Risk', 'AI deeply embedded in core operations; control framework materially insufficient; high regulatory attention.'],
              ['4', '#d29922', 'High Risk', 'Broad AI adoption but governance framework still maturing; notable exposure gaps.'],
              ['3', '#f0883e', 'Moderate-High Risk', 'AI at scale; controls broadly proportionate to exposure.'],
              ['2', '#3fb950', 'Moderate-Low Risk', 'Limited AI deployment; controls adequately cover exposure.'],
              ['1', '#3fb950', 'Low Risk', 'Minimal or no AI deployment; robust control framework.'],
            ].map(([score, bgColor, label, desc]) => (
              <div key={score} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '10px 14px', background: 'var(--surface2)', borderRadius: 8 }}>
                <div style={{ width: 32, height: 32, background: bgColor, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, color: '#fff', flexShrink: 0 }}>{score}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: bgColor }}>{label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data sources */}
        <div className="chart-card" style={{ marginBottom: 32 }}>
          <div className="chart-title">Data Sources</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              ['Annual Reports',             'Strategic direction, overall AI positioning'],
              ['MD&A',                       'AI risk disclosures, risk factor analysis'],
              ['Q4 Earnings Call Transcripts','Management commentary on AI strategy'],
              ['AI News Releases',           'Specific AI milestones, partnerships, and innovations'],
              ['OSFI-FCAC Regulatory Docs',  'Risk assessment framework and classification standards'],
              ['Industry Reports (DAIS, Evident)', 'Third-party AI talent & capability benchmarking'],
            ].map(([src, desc]) => (
              <div key={src} style={{ fontSize: 12, padding: '8px 12px', background: 'var(--surface2)', borderRadius: 6 }}>
                <div style={{ fontWeight: 600, color: 'var(--text)' }}>{src}</div>
                <div style={{ color: 'var(--text2)', marginTop: 2 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Link href="/" style={{ color: 'var(--accent)', fontSize: 14 }}>← Back to Dashboard</Link>
        </div>
      </main>

      <footer className="footer">
        OSFI-FCAC AI Risk Framework · Sources: Annual Reports, MD&amp;A, Q4 Earnings Transcripts, AI News Releases (2020–2025)
      </footer>
    </>
  );
}
