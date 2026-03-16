// ============================================================
// InputForm.jsx — The form where users enter their details
// ============================================================

// Props:
//   onSubmit  (function) — called with { jobRole, experienceLevel, techStack }
//   isLoading (bool)     — disables the form while AI is thinking
import {React, useState} from "react";


const InputForm = ({ onSubmit, isLoading }) => {
  // React useState holds each field's value.
  // When an input changes, we update state, which re-renders the input.
  // This is called a "controlled component" pattern.
  const [jobRole, setJobRole] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('junior');
  const [techStack, setTechStack] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); // prevent page reload (default form behavior)
    if (!jobRole.trim() || !techStack.trim()) return;
    onSubmit({ jobRole, experienceLevel, techStack });
  };

  return (
    <div className="glass" style={styles.card}>
      <div style={styles.cardHeader}>
        <h2 style={styles.cardTitle}>Generate Questions</h2>
        <p style={styles.cardDesc}>
          Fill in your profile and let the AI craft the perfect interview set
        </p>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>

        {/* ── Job Role ──────────────────────────────────── */}
        <div style={styles.field}>
          <label style={styles.label}>Job Role</label>
          <input
            type="text"
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
            placeholder="e.g. Backend Developer, Data Scientist..."
            style={styles.input}
            disabled={isLoading}
            required
          />
        </div>

        {/* ── Experience Level ──────────────────────────── */}
        <div style={styles.field}>
          <label style={styles.label}>Experience Level</label>
          {/* Instead of a dropdown, we use pill buttons.
              More tactile and visually interesting. */}
          <div style={styles.pillGroup}>
            {['junior', 'mid', 'senior'].map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setExperienceLevel(level)}
                style={{
                  ...styles.pill,
                  ...(experienceLevel === level ? styles.pillActive : {}),
                }}
                disabled={isLoading}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* ── Tech Stack ────────────────────────────────── */}
        <div style={styles.field}>
          <label style={styles.label}>Tech Stack</label>
          <input
            type="text"
            value={techStack}
            onChange={(e) => setTechStack(e.target.value)}
            placeholder="e.g. Python, FastAPI, PostgreSQL, Redis..."
            style={styles.input}
            disabled={isLoading}
            required
          />
          <span style={styles.hint}>Separate technologies with commas</span>
        </div>

        {/* ── Submit button ─────────────────────────────── */}
        <button
          type="submit"
          disabled={isLoading || !jobRole.trim() || !techStack.trim()}
          style={{
            ...styles.submitBtn,
            ...(isLoading ? styles.submitBtnLoading : {}),
          }}
        >
          {isLoading ? (
            <>
              <span style={styles.spinner} />
              Generating questions...
            </>
          ) : (
            <>
              <span>⚡</span>
              Generate Interview Questions
            </>
          )}
        </button>

      </form>
    </div>
  );
};

const styles = {
  card: {
    padding: '2rem 2.5rem',
    maxWidth: '680px',
    margin: '0 auto 2.5rem',
  },
  cardHeader: { marginBottom: '2rem' },
  cardTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.4rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
    letterSpacing: '-0.02em',
    marginBottom: '6px',
  },
  cardDesc: {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
    fontWeight: 300,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '0.8rem',
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
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    width: '100%',
  },
  hint: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
  },
  pillGroup: {
    display: 'flex',
    gap: '10px',
  },
  pill: {
    flex: 1,
    padding: '10px 0',
    borderRadius: '10px',
    border: '1px solid var(--border)',
    background: 'transparent',
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
    fontFamily: 'var(--font-body)',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    letterSpacing: '0.01em',
  },
  pillActive: {
    background: 'var(--accent)',
    borderColor: 'var(--accent)',
    color: '#fff',
    boxShadow: '0 4px 12px var(--accent-soft)',
  },
  submitBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    padding: '14px 24px',
    borderRadius: '12px',
    border: 'none',
    background: 'var(--accent)',
    color: '#fff',
    fontSize: '0.95rem',
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    letterSpacing: '0.01em',
    marginTop: '0.5rem',
  },
  submitBtnLoading: {
    opacity: 0.7,
    cursor: 'not-allowed',
  },
  spinner: {
    display: 'inline-block',
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },
};

export default InputForm;