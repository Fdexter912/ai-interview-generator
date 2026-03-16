// ============================================================
// QuestionCard.jsx — Stage 5: displays rich question objects
// ============================================================

import { useState, useEffect } from 'react'

// Each question object has:
//   question, hint, what_interviewer_looks_for, follow_up

const QuestionCard = ({ title, questions, color, bgColor, icon, delay = 0 }) => {
  const [visible, setVisible] = useState(false)
  // Track which question's details panel is open (null = all closed)
  const [openIndex, setOpenIndex] = useState(null)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  if (!questions || questions.length === 0) return null

  const toggleDetails = (index) => {
    // Toggle open — clicking same index closes it
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div
      className="glass"
      style={{
        ...styles.card,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms,
                     background 0.3s ease, border-color 0.3s ease`,
      }}
    >
      {/* ── Card header ───────────────────────────────────── */}
      <div style={styles.cardHeader}>
        <div style={{ ...styles.badge, color, background: bgColor }}>
          <span>{icon}</span>
          <span style={styles.badgeText}>{title}</span>
        </div>
        <span style={styles.count}>{questions.length} questions</span>
      </div>

      {/* ── Question list ─────────────────────────────────── */}
      <div style={styles.list}>
        {questions.map((q, index) => (
          <div key={index} style={styles.questionBlock}>

            {/* ── Question row ──────────────────────────────── */}
            <div style={styles.questionRow}>
              <span style={{ ...styles.number, color, background: bgColor }}>
                {index + 1}
              </span>
              <p style={styles.questionText}>{q.question}</p>
            </div>

            {/* ── Expand/collapse button ────────────────────── */}
            {/* Clicking this reveals the hint, intent, follow-up */}
            <button
              onClick={() => toggleDetails(index)}
              style={{
                ...styles.detailsToggle,
                color,
                background: openIndex === index ? bgColor : 'transparent',
              }}
            >
              {openIndex === index ? '▲ Hide details' : '▼ Show hint & details'}
            </button>

            {/* ── Expandable details panel ──────────────────── */}
            {openIndex === index && (
              <div style={{ ...styles.detailsPanel, borderColor: color + '33' }}>

                {/* Hint */}
                <div style={styles.detailRow}>
                  <span style={{ ...styles.detailLabel, color }}>💡 Hint</span>
                  <p style={styles.detailText}>{q.hint}</p>
                </div>

                {/* What interviewer looks for */}
                <div style={styles.detailRow}>
                  <span style={{ ...styles.detailLabel, color }}>
                    🎯 Interviewer looks for
                  </span>
                  <p style={styles.detailText}>{q.what_interviewer_looks_for}</p>
                </div>

                {/* Follow-up */}
                <div style={{ ...styles.detailRow, borderBottom: 'none' }}>
                  <span style={{ ...styles.detailLabel, color }}>
                    🔁 Follow-up question
                  </span>
                  <p style={styles.detailText}>{q.follow_up}</p>
                </div>

              </div>
            )}

          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  card: {
    padding: '1.75rem 2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: '50px',
    fontSize: '0.8rem',
    fontWeight: 600,
    fontFamily: 'var(--font-display)',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  badgeText: { letterSpacing: '0.06em' },
  count: {
    fontSize: '0.78rem',
    color: 'var(--text-muted)',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  questionBlock: {
    borderRadius: '12px',
    overflow: 'hidden',
    border: '1px solid var(--border)',
    transition: 'border-color 0.2s ease',
  },
  questionRow: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'flex-start',
    padding: '1rem',
  },
  number: {
    minWidth: '28px',
    height: '28px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.78rem',
    fontWeight: 700,
    fontFamily: 'var(--font-display)',
    flexShrink: 0,
    marginTop: '1px',
  },
  questionText: {
    fontSize: '0.95rem',
    color: 'var(--text-primary)',
    lineHeight: 1.65,
    fontWeight: 300,
    paddingTop: '2px',
  },
  detailsToggle: {
    display: 'block',
    width: '100%',
    padding: '8px 1rem',
    border: 'none',
    borderTop: '1px solid var(--border)',
    fontSize: '0.75rem',
    fontFamily: 'var(--font-body)',
    fontWeight: 500,
    cursor: 'pointer',
    textAlign: 'left',
    letterSpacing: '0.02em',
    transition: 'background 0.2s ease',
  },
  detailsPanel: {
    borderTop: '1px solid',
    background: 'var(--accent-soft)',
  },
  detailRow: {
    padding: '0.85rem 1rem',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  detailLabel: {
    fontSize: '0.72rem',
    fontWeight: 600,
    fontFamily: 'var(--font-display)',
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
  },
  detailText: {
    fontSize: '0.88rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.6,
    fontWeight: 300,
  },
}

export default QuestionCard