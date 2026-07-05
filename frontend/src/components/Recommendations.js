import React, { useState } from 'react';

const priorityStyles = {
  high: { bg: 'var(--red-dim)', border: 'rgba(255,62,108,0.3)', dot: 'var(--red)', label: 'HIGH' },
  medium: { bg: 'var(--yellow-dim)', border: 'rgba(255,214,10,0.3)', dot: 'var(--yellow)', label: 'MEDIUM' },
  low: { bg: 'var(--green-dim)', border: 'rgba(0,255,157,0.3)', dot: 'var(--green)', label: 'LOW' },
};

const s = {
  section: { marginBottom: 28 },
  heading: { fontWeight: 800, fontSize: 20, marginBottom: 4, letterSpacing: '-0.02em' },
  sub: { color: 'var(--text3)', fontSize: 13, marginBottom: 20, fontFamily: 'var(--font-mono)' },
  filters: { display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' },
  filterBtn: {
    fontFamily: 'var(--font-display)',
    fontSize: 12, fontWeight: 600,
    border: '1px solid var(--border)',
    borderRadius: 4, padding: '5px 14px',
    cursor: 'pointer', transition: 'all 0.15s',
    background: 'transparent', color: 'var(--text3)',
  },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 14 },
  card: {
    border: '1px solid',
    borderRadius: 'var(--radius-lg)',
    padding: '20px',
    position: 'relative',
    transition: 'transform 0.15s',
  },
  top: { display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  icon: { fontSize: 24, flexShrink: 0, marginTop: 2 },
  meta: { flex: 1 },
  priority: {
    fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 500,
    letterSpacing: '0.12em', display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4,
  },
  dot: { width: 5, height: 5, borderRadius: '50%', display: 'inline-block' },
  title: { fontWeight: 700, fontSize: 14, lineHeight: 1.3 },
  desc: { fontSize: 13, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 14 },
  footer: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  saving: {
    fontFamily: 'var(--font-mono)', fontSize: 12,
    color: 'var(--green)', fontWeight: 500,
  },
  action: {
    fontSize: 12, fontWeight: 600,
    background: 'transparent',
    border: '1px solid var(--border2)',
    borderRadius: 4, padding: '5px 12px',
    color: 'var(--text2)', cursor: 'pointer',
    transition: 'all 0.15s', fontFamily: 'var(--font-display)',
  },
  totalSavings: {
    background: 'linear-gradient(135deg, rgba(0,255,157,0.08), rgba(0,229,255,0.05))',
    border: '1px solid rgba(0,255,157,0.2)',
    borderRadius: 'var(--radius-lg)',
    padding: '20px 24px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 24, flexWrap: 'wrap', gap: 12,
  },
  savingsLabel: { fontSize: 13, color: 'var(--text3)', marginBottom: 4 },
  savingsValue: { fontWeight: 800, fontSize: 32, color: 'var(--green)', letterSpacing: '-0.03em' },
};

export default function Recommendations({ recommendations }) {
  const [filter, setFilter] = useState('all');
  const filters = ['all', 'high', 'medium', 'low'];

  const totalSavings = recommendations
    .filter(r => r.potentialSaving > 0)
    .reduce((s, r) => s + r.potentialSaving, 0);

  const filtered = filter === 'all' ? recommendations : recommendations.filter(r => r.priority === filter);

  return (
    <div style={s.section}>
      <div style={s.heading}>💡 Recommendations</div>
      <div style={s.sub}>// {recommendations.length} optimization opportunities identified</div>

      <div style={s.totalSavings}>
        <div>
          <div style={s.savingsLabel}>TOTAL POTENTIAL SAVINGS</div>
          <div style={s.savingsValue}>${totalSavings.toFixed(2)}</div>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text2)', textAlign: 'right' }}>
          <div>{recommendations.filter(r => r.priority === 'high').length} high priority</div>
          <div>{recommendations.filter(r => r.priority === 'medium').length} medium priority</div>
        </div>
      </div>

      <div style={s.filters}>
        {filters.map(f => (
          <button key={f} style={{
            ...s.filterBtn,
            ...(filter === f ? { borderColor: 'var(--accent)', color: 'var(--accent)', background: 'var(--accent-dim)' } : {})
          }} onClick={() => setFilter(f)}>
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={s.grid}>
        {filtered.map((rec) => {
          const p = priorityStyles[rec.priority];
          return (
            <div key={rec.id} style={{ ...s.card, background: p.bg, borderColor: p.border }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={s.top}>
                <span style={s.icon}>{rec.icon}</span>
                <div style={s.meta}>
                  <div style={s.priority}>
                    <span style={{ ...s.dot, background: p.dot }} />
                    <span style={{ color: p.dot }}>{p.label}</span>
                    <span style={{ color: 'var(--text3)', marginLeft: 6 }}>{rec.category}</span>
                  </div>
                  <div style={s.title}>{rec.title}</div>
                </div>
              </div>
              <div style={s.desc}>{rec.description}</div>
              <div style={s.footer}>
                <div style={s.saving}>
                  {rec.potentialSaving > 0 ? `Save ~$${rec.potentialSaving.toFixed(0)}/period` : '✓ Good job!'}
                </div>
                <button style={s.action}
                  onMouseEnter={e => { e.target.style.borderColor = p.dot; e.target.style.color = p.dot; }}
                  onMouseLeave={e => { e.target.style.borderColor = 'var(--border2)'; e.target.style.color = 'var(--text2)'; }}>
                  {rec.action} →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
