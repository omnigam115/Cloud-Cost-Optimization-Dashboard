import React from 'react';

const styles = {
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '0 32px', height: '60px',
    borderBottom: '1px solid var(--border)',
    background: 'rgba(8,12,16,0.95)',
    backdropFilter: 'blur(12px)',
    position: 'sticky', top: 0, zIndex: 100,
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: '10px',
  },
  logoIcon: {
    width: 28, height: 28,
    background: 'linear-gradient(135deg, var(--accent), var(--green))',
    borderRadius: 6,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 14,
  },
  logoText: {
    fontFamily: 'var(--font-display)',
    fontWeight: 800,
    fontSize: 18,
    letterSpacing: '-0.02em',
    color: 'var(--text)',
  },
  logoDot: { color: 'var(--accent)' },
  badge: {
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    color: 'var(--text3)',
    border: '1px solid var(--border)',
    borderRadius: 4,
    padding: '2px 6px',
    letterSpacing: '0.05em',
  },
  resetBtn: {
    display: 'flex', alignItems: 'center', gap: 6,
    background: 'transparent',
    border: '1px solid var(--border2)',
    borderRadius: 'var(--radius)',
    color: 'var(--text2)',
    padding: '6px 14px',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
  }
};

export default function Header({ hasData, onReset }) {
  return (
    <header style={styles.header}>
      <div style={styles.logo}>
        <div style={styles.logoIcon}>☁</div>
        <span style={styles.logoText}>
          Cloud<span style={styles.logoDot}>Lens</span>
        </span>
        <span style={styles.badge}>COST INTELLIGENCE</span>
      </div>
      {hasData && (
        <button style={styles.resetBtn} onClick={onReset}
          onMouseEnter={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.color = 'var(--accent)'; }}
          onMouseLeave={e => { e.target.style.borderColor = 'var(--border2)'; e.target.style.color = 'var(--text2)'; }}>
          ← New Analysis
        </button>
      )}
    </header>
  );
}
