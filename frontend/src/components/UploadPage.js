import React, { useState, useRef } from 'react';

const s = {
  page: {
    minHeight: 'calc(100vh - 60px)',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    padding: '60px 24px',
  },
  hero: { textAlign: 'center', marginBottom: 56, maxWidth: 600 },
  tag: {
    display: 'inline-block',
    fontFamily: 'var(--font-mono)', fontSize: 11,
    color: 'var(--accent)', letterSpacing: '0.15em',
    background: 'var(--accent-dim)', border: '1px solid rgba(0,229,255,0.2)',
    borderRadius: 4, padding: '4px 12px', marginBottom: 20,
  },
  h1: {
    fontFamily: 'var(--font-display)', fontWeight: 800,
    fontSize: 'clamp(36px, 6vw, 64px)',
    lineHeight: 1.05, letterSpacing: '-0.03em',
    color: 'var(--text)', marginBottom: 18,
  },
  accent: { color: 'var(--accent)' },
  sub: { color: 'var(--text2)', fontSize: 16, lineHeight: 1.6 },
  uploadBox: {
    width: '100%', maxWidth: 560,
    border: '2px dashed var(--border2)',
    borderRadius: 'var(--radius-lg)',
    padding: '52px 40px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.25s',
    background: 'var(--surface)',
    position: 'relative',
    marginBottom: 20,
  },
  uploadBoxActive: {
    borderColor: 'var(--accent)',
    background: 'var(--accent-dim)',
  },
  uploadIcon: { fontSize: 42, marginBottom: 16, display: 'block' },
  uploadTitle: { fontWeight: 700, fontSize: 18, marginBottom: 8, color: 'var(--text)' },
  uploadSub: { color: 'var(--text2)', fontSize: 13, lineHeight: 1.6 },
  browseBtn: {
    display: 'inline-block', marginTop: 20,
    background: 'var(--accent)', color: '#000',
    fontWeight: 700, fontSize: 13, letterSpacing: '0.04em',
    border: 'none', borderRadius: 'var(--radius)',
    padding: '10px 22px', cursor: 'pointer',
    transition: 'all 0.2s',
  },
  divider: {
    display: 'flex', alignItems: 'center', gap: 16,
    width: '100%', maxWidth: 560, marginBottom: 20,
    color: 'var(--text3)', fontFamily: 'var(--font-mono)', fontSize: 11,
  },
  line: { flex: 1, height: 1, background: 'var(--border)' },
  demoBtn: {
    width: '100%', maxWidth: 560,
    background: 'transparent', border: '1px solid var(--border2)',
    borderRadius: 'var(--radius-lg)', padding: '16px',
    color: 'var(--text2)', fontSize: 14, fontWeight: 600,
    cursor: 'pointer', transition: 'all 0.2s',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
  },
  error: {
    width: '100%', maxWidth: 560,
    background: 'var(--red-dim)', border: '1px solid rgba(255,62,108,0.3)',
    borderRadius: 'var(--radius)', padding: '12px 16px',
    color: 'var(--red)', fontSize: 13, marginTop: 16,
    fontFamily: 'var(--font-mono)',
  },
  loading: {
    position: 'fixed', inset: 0, background: 'rgba(8,12,16,0.92)',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    zIndex: 999, gap: 20,
  },
  spinner: {
    width: 48, height: 48, borderRadius: '50%',
    border: '3px solid var(--border)',
    borderTopColor: 'var(--accent)',
    animation: 'spin 0.8s linear infinite',
  },
  loadingText: { color: 'var(--text2)', fontSize: 14, fontFamily: 'var(--font-mono)' },
  features: {
    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16,
    width: '100%', maxWidth: 560, marginTop: 40,
  },
  feature: {
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', padding: '16px',
    textAlign: 'center',
  },
  featureIcon: { fontSize: 22, display: 'block', marginBottom: 8 },
  featureText: { fontSize: 12, color: 'var(--text3)', lineHeight: 1.4 },
};

export default function UploadPage({ onUpload, onDemo, loading, error }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onUpload(file);
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) onUpload(file);
  };

  return (
    <div style={s.page}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      {loading && (
        <div style={s.loading}>
          <div style={s.spinner} />
          <div style={s.loadingText}>Analyzing your cloud spend...</div>
        </div>
      )}
      <div style={s.hero}>
        <div style={s.tag}>// CLOUD COST INTELLIGENCE</div>
        <h1 style={s.h1}>Stop <span style={s.accent}>overpaying</span><br/>for cloud.</h1>
        <p style={s.sub}>Upload your billing CSV and get instant AI-powered analysis with actionable cost-saving recommendations.</p>
      </div>

      <div
        style={{ ...s.uploadBox, ...(dragging ? s.uploadBoxActive : {}) }}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current.click()}
      >
        <span style={s.uploadIcon}>📂</span>
        <div style={s.uploadTitle}>Drop your billing CSV here</div>
        <div style={s.uploadSub}>
          Supports AWS Cost Explorer, GCP Billing, Azure Cost Management<br />
          exports and any standard cloud billing CSV format
        </div>
        <button style={s.browseBtn} onClick={(e) => { e.stopPropagation(); inputRef.current.click(); }}>
          Browse File
        </button>
        <input ref={inputRef} type="file" accept=".csv" style={{ display: 'none' }} onChange={handleChange} />
      </div>

      <div style={s.divider}>
        <div style={s.line} /><span>or try the demo</span><div style={s.line} />
      </div>

      <button style={s.demoBtn} onClick={onDemo}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.color = 'var(--text2)'; }}>
        ⚡ Load Demo Data — AWS-style Sample Dataset
      </button>

      {error && <div style={s.error}>⚠ {error}</div>}

      <div style={s.features}>
        {[
          { icon: '📊', text: 'Interactive charts & breakdowns' },
          { icon: '🔍', text: 'Service & region analysis' },
          { icon: '💡', text: 'Smart saving recommendations' },
        ].map((f, i) => (
          <div key={i} style={s.feature}>
            <span style={s.featureIcon}>{f.icon}</span>
            <div style={s.featureText}>{f.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
