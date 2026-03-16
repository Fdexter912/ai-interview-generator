// ============================================================
// QuestionCard.jsx — Displays one difficulty tier of questions
// ============================================================

// Props:
//   title      (string) — "Beginner", "Intermediate", "Advanced"
//   questions  (array)  — list of question strings
//   color      (string) — CSS variable name for the badge color
//   icon       (string) — emoji icon for visual identity
//   delay      (number) — animation delay in ms (for stagger effect)
import {React, useState, useEffect} from "react";

const QuestionCard = ({ title, questions, color, bgColor, icon, delay = 0 }) => {
  const [visible, setVisible] = useState(false);

  // useEffect runs after the component mounts.
  // The small delay creates a staggered reveal effect
  // when all three cards appear together.
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer); // cleanup on unmount
  }, [delay]);

  if (!questions || questions.length === 0) return null;

  return (
    <div
      className="glass"
      style={{
        ...styles.card,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms,
                     background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease`,
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
      <ol style={styles.list}>
        {questions.map((question, index) => (
          <li key={index} style={styles.listItem}>
            {/* Question number bubble */}
            <span style={{ ...styles.number, color, background: bgColor }}>
              {index + 1}
            </span>
            <p style={styles.questionText}>{question}</p>
          </li>
        ))}
      </ol>
    </div>
  );
};

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
    fontWeight: 400,
  },
  list: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  listItem: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'flex-start',
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
  },
};

export default QuestionCard;