import React from 'react';

const fmt = (n) => n >= 1000 ? `$${(n/1000).toFixed(1)}k` : `$${n.toFixed(2)}`;

const cards = (d) => [
  { label: 'Total Spend', value: fmt(d.totalCost), icon: '💰', color: 'var(--accent)', sub: `${d.totalRows} line items` },
  { label: 'Avg Monthly', value: fmt(d.avgMonthlySpend), icon: '📅', color: 'var(--green)', sub: 'per billing period' },
  { label: 'Services', value: d.uniqueServices, icon: '⚙️', color: 'var(--yellow)', sub: 'unique cloud services' },
  { label: 'Regions', value: d.uniqueRegions, icon: '🌍', color: 'var(--orange)', sub: 'deployment regions' },
  { label: 'Top Service', value: d.topService, icon: '🔥', color: 'var(--red)', sub: 'highest cost driver', small: true },
];

const s = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 16, marginBottom: 28,
  },
  card: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '20px 22px',
    position: 'relative', overflow: 'hidden',
  },
  bar: {
    position: 'absolute', top: 0, left: 0, right: 0,
    height: 2,
  },
  top: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  icon: { fontSize: 22 },
  label: { fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', textTransform: 'uppercase' },
  value: { fontWeight: 800, fontSize: 28, letterSpacing: '-0.03em', lineHeight: 1 },
  sub: { fontSize: 12, color: 'var(--text3)', marginTop: 6 },
};

export default function SummaryCards({ summary }) {
  return (
    <div style={s.grid}>
      {cards(summary).map((c, i) => (
        <div key={i} style={s.card}>
          <div style={{ ...s.bar, background: c.color }} />
          <div style={s.top}>
            <span style={s.label}>{c.label}</span>
            <span style={s.icon}>{c.icon}</span>
          </div>
          <div style={{ ...s.value, color: c.color, fontSize: c.small ? 18 : 28 }}>{c.value}</div>
          <div style={s.sub}>{c.sub}</div>
        </div>
      ))}
    </div>
  );
}
