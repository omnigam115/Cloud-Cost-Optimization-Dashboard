import React from 'react';

const s = {
  card: {
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: 20,
  },
  header: {
    padding: '16px 20px', borderBottom: '1px solid var(--border)',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  title: { fontWeight: 700, fontSize: 14 },
  sub: { fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text3)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    padding: '10px 20px', textAlign: 'left',
    fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em',
    color: 'var(--text3)', textTransform: 'uppercase',
    background: 'var(--bg2)', borderBottom: '1px solid var(--border)',
  },
  td: {
    padding: '12px 20px',
    borderBottom: '1px solid var(--border)',
    fontSize: 13,
  },
  bar: {
    height: 4, borderRadius: 2,
    background: 'linear-gradient(90deg, var(--accent), var(--green))',
    transition: 'width 0.5s',
  },
};

const COLORS = ['#00e5ff', '#00ff9d', '#ff6b35', '#ffd60a', '#ff3e6c', '#a78bfa', '#34d399', '#f472b6', '#60a5fa', '#fb923c'];

export default function ServiceTable({ services }) {
  return (
    <div style={s.card}>
      <div style={s.header}>
        <div style={s.title}>⚙ Top Services by Cost</div>
        <div style={s.sub}>sorted by total spend</div>
      </div>
      <table style={s.table}>
        <thead>
          <tr>
            <th style={s.th}>#</th>
            <th style={s.th}>Service</th>
            <th style={s.th}>Cost</th>
            <th style={s.th}>Share</th>
            <th style={{ ...s.th, width: '30%' }}>Distribution</th>
          </tr>
        </thead>
        <tbody>
          {services.map((svc, i) => (
            <tr key={svc.name}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <td style={{ ...s.td, color: 'var(--text3)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>{String(i + 1).padStart(2, '0')}</td>
              <td style={{ ...s.td, fontWeight: 600 }}>{svc.name}</td>
              <td style={{ ...s.td, fontFamily: 'var(--font-mono)', color: COLORS[i % COLORS.length] }}>${svc.cost.toFixed(2)}</td>
              <td style={{ ...s.td, fontFamily: 'var(--font-mono)', color: 'var(--text2)' }}>{svc.percentage}%</td>
              <td style={s.td}>
                <div style={{ background: 'var(--border)', borderRadius: 2, height: 4, overflow: 'hidden' }}>
                  <div style={{ ...s.bar, width: `${svc.percentage}%`, background: COLORS[i % COLORS.length] }} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
