// ============================================================
// Header.jsx — App title and dark/light mode toggle
// ============================================================

// Props:
//   darkMode  (bool)     — current theme state
//   onToggle  (function) — called when toggle button is clicked


const Header = ({ darkMode, onToggle, onLogout, userEmail }) => {
  return (
    <header style={styles.header}>
      {/* ── Brand ─────────────────────────────────────────── */}
      <div style={styles.brand}>
        <div style={styles.logoMark}>
          <span style={styles.logoIcon}>⬡</span>
        </div>
        <div>
          <h1 style={styles.title}>InterviewForge</h1>
          <p style={styles.subtitle}>AI-powered questions, tailored to your role</p>
        </div>
      </div>

      <div style={styles.actions}>
        {userEmail && (
          <span style={styles.userEmail}>{userEmail}</span>
        )}
      

      {/* ── Theme toggle ──────────────────────────────────── */}
      {/* Clicking this button calls onToggle in App.jsx,
          which flips the darkMode state and updates
          <html data-theme="..."> */}
      <button
        onClick={onToggle}
        style={styles.toggle}
        aria-label="Toggle dark mode"
      >
        <span style={styles.toggleIcon}>{darkMode ? '☀️' : '🌙'}</span>
        <span style={styles.toggleLabel}>{darkMode ? 'Light' : 'Dark'}</span>
      </button>

    {onLogout && (
      <button onClick={onLogout} style={styles.logoutBtn}>
        Sign Out
      </button>
    )}
    </div>
    </header>
  );
};

// Inline styles keep this component self-contained.
// We use CSS variables (var(--...)) so they automatically
// respond to dark/light mode changes.
const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '2rem 2.5rem',
    marginBottom: '1rem',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  logoMark: {
    width: '48px',
    height: '48px',
    background: 'var(--accent)',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 16px var(--accent-soft)',
    transform: 'rotate(15deg)',
  },
  logoIcon: {
    fontSize: '22px',
    transform: 'rotate(-15deg)',
    display: 'block',
    filter: 'brightness(10)',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.6rem',
    fontWeight: 800,
    color: 'var(--text-primary)',
    letterSpacing: '-0.03em',
    lineHeight: 1,
  },
  subtitle: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    marginTop: '3px',
    fontWeight: 300,
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  userEmail: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
    fontWeight: 300,
  },
  toggle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 18px',
    borderRadius: '50px',
    border: '1px solid var(--border)',
    background: 'var(--bg-card)',
    backdropFilter: 'blur(12px)',
    color: 'var(--text-secondary)',
    fontSize: '0.85rem',
    fontFamily: 'var(--font-body)',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  toggleIcon: { fontSize: '1rem' },
  toggleLabel: { letterSpacing: '0.02em' },
  logoutBtn: {
    padding: '10px 18px',
    borderRadius: '50px',
    border: '1px solid var(--border)',
    background: 'transparent',
    color: 'var(--text-secondary)',
    fontSize: '0.85rem',
    fontFamily: 'var(--font-body)',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
}


export default Header;