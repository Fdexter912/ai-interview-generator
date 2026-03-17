// ============================================================
// AuthPage.jsx — Login and Register form with tab switching
// ============================================================

import { useState } from 'react'

const BASE_URL = import.meta.env.VITE_API_URL || '/api'

// Props:
//   onAuthSuccess (function) — called with token when login succeeds
const AuthPage = ({ onAuthSuccess }) => {
  const [tab, setTab]         = useState('login')   // 'login' | 'register'
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError]     = useState(null)
  const [success, setSuccess] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    const endpoint = tab === 'login' ? '/login' : '/register'

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const text = await response.text()
      const data = text ? JSON.parse(text) : {}

      if (!response.ok) {
        throw new Error(data.detail || `Server error: ${response.status}`)
      }

      if (tab === 'register') {
        setSuccess('Account created! Please log in.')
        setTab('login')
        setPassword('')
      } else {
        localStorage.setItem('access_token', data.access_token)
        onAuthSuccess(data.access_token)
      }
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError('Unexpected server response. Check the backend terminal.')
      } else {
        setError(err.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={styles.wrapper}>
      <div className="glass" style={styles.card}>

        {/* ── Brand ────────────────────────────────────────── */}
        <div style={styles.brand}>
          <div style={styles.logoMark}>
            <span style={styles.logoIcon}>⬡</span>
          </div>
          <h1 style={styles.title}>InterviewForge</h1>
        </div>
        <p style={styles.subtitle}>AI-powered interview preparation</p>

        {/* ── Tabs ─────────────────────────────────────────── */}
        <div style={styles.tabs}>
          {['login', 'register'].map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(null); setSuccess(null) }}
              style={{
                ...styles.tab,
                ...(tab === t ? styles.tabActive : {})
              }}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* ── Feedback messages ─────────────────────────────── */}
        {error && (
          <div style={styles.errorBox}>⚠️ {error}</div>
        )}
        {success && (
          <div style={styles.successBox}>✓ {success}</div>
        )}

        {/* ── Form ─────────────────────────────────────────── */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={styles.input}
              required
              disabled={isLoading}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={tab === 'register' ? 'At least 6 characters' : '••••••••'}
              style={styles.input}
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              ...styles.submitBtn,
              ...(isLoading ? { opacity: 0.7, cursor: 'not-allowed' } : {})
            }}
          >
            {isLoading ? (
              <><span style={styles.spinner} /> {tab === 'login' ? 'Signing in...' : 'Creating account...'}</>
            ) : (
              tab === 'login' ? '→ Sign In' : '→ Create Account'
            )}
          </button>
        </form>

      </div>
    </div>
  )
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    padding: '2.5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '0.25rem',
  },
  logoMark: {
    width: '44px',
    height: '44px',
    background: 'var(--accent)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transform: 'rotate(15deg)',
    boxShadow: '0 4px 16px var(--accent-soft)',
  },
  logoIcon: {
    fontSize: '20px',
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
  },
  subtitle: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    fontWeight: 300,
    marginBottom: '0.5rem',
  },
  tabs: {
    display: 'flex',
    width: '100%',
    gap: '8px',
    padding: '4px',
    background: 'var(--accent-soft)',
    borderRadius: '12px',
  },
  tab: {
    flex: 1,
    padding: '9px',
    border: 'none',
    borderRadius: '9px',
    background: 'transparent',
    color: 'var(--text-muted)',
    fontSize: '0.9rem',
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  tabActive: {
    background: 'var(--bg-card-hover)',
    color: 'var(--accent)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    marginTop: '0.5rem',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '7px',
  },
  label: {
    fontSize: '0.78rem',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  input: {
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid var(--border)',
    background: 'var(--accent-soft)',
    color: 'var(--text-primary)',
    fontSize: '0.95rem',
    fontFamily: 'var(--font-body)',
    outline: 'none',
    width: '100%',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  submitBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '13px',
    borderRadius: '12px',
    border: 'none',
    background: 'var(--accent)',
    color: '#fff',
    fontSize: '0.95rem',
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginTop: '0.25rem',
    letterSpacing: '0.01em',
  },
  errorBox: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '10px',
    background: 'rgba(220,38,38,0.1)',
    border: '1px solid rgba(220,38,38,0.2)',
    color: 'var(--advanced-color)',
    fontSize: '0.85rem',
  },
  successBox: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '10px',
    background: 'rgba(22,163,74,0.1)',
    border: '1px solid rgba(22,163,74,0.2)',
    color: 'var(--beginner-color)',
    fontSize: '0.85rem',
  },
  spinner: {
    display: 'inline-block',
    width: '14px',
    height: '14px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },
}

export default AuthPage