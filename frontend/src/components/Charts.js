import React from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const COLORS = ['#00e5ff', '#00ff9d', '#ff6b35', '#ffd60a', '#ff3e6c', '#a78bfa', '#34d399', '#f472b6'];

const s = {
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 },
  gridFull: { marginBottom: 20 },
  card: {
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)', padding: '24px',
  },
  title: { fontWeight: 700, fontSize: 14, marginBottom: 20, color: 'var(--text)', letterSpacing: '-0.01em' },
  tip: {
    background: 'var(--surface2)', border: '1px solid var(--border2)',
    borderRadius: 6, padding: '8px 12px',
    color: 'var(--text)', fontSize: 12, fontFamily: 'var(--font-mono)',
  },
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={s.tip}>
      <div style={{ color: 'var(--text2)', marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || 'var(--accent)' }}>
          {p.name}: ${Number(p.value).toFixed(2)}
        </div>
      ))}
    </div>
  );
};

export default function Charts({ data }) {
  const { topServices, spendOverTime, byRegion, byAccount } = data;

  return (
    <>
      <div style={s.gridFull}>
        <div style={s.card}>
          <div style={s.title}>☁ Spend Over Time</div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={spendOverTime} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#00e5ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" tick={{ fill: 'var(--text3)', fontSize: 11, fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text3)', fontSize: 11, fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v >= 1000 ? (v/1000).toFixed(0)+'k' : v}`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="cost" name="Cost" stroke="#00e5ff" strokeWidth={2} fill="url(#areaGrad)" dot={{ fill: '#00e5ff', r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={s.grid}>
        <div style={s.card}>
          <div style={s.title}>⚙ Cost by Service</div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={topServices.slice(0, 8)} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" tick={{ fill: 'var(--text3)', fontSize: 11, fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v >= 1000 ? (v/1000).toFixed(0)+'k' : v}`} />
              <YAxis type="category" dataKey="name" tick={{ fill: 'var(--text2)', fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="cost" name="Cost" radius={[0, 4, 4, 0]}>
                {topServices.slice(0, 8).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={s.card}>
          <div style={s.title}>🌍 Regional Distribution</div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={byRegion} dataKey="cost" nameKey="region" cx="50%" cy="50%" outerRadius={85} innerRadius={50} paddingAngle={3}>
                {byRegion.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(v) => <span style={{ color: 'var(--text2)', fontSize: 11 }}>{v}</span>}
                iconType="circle" iconSize={8}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {byAccount.length > 1 && (
          <div style={{ ...s.card, gridColumn: '1 / -1' }}>
            <div style={s.title}>👤 Spend by Account</div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={byAccount} margin={{ top: 5, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="account" tick={{ fill: 'var(--text3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text3)', fontSize: 11, fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v >= 1000 ? (v/1000).toFixed(0)+'k' : v}`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="cost" name="Cost" fill="#00ff9d" radius={[4, 4, 0, 0]}>
                  {byAccount.map((_, i) => <Cell key={i} fill={COLORS[(i + 1) % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </>
  );
}
