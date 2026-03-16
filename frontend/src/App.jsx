// ============================================================
// App.jsx — Root component, manages global state and layout
// ============================================================

import { useState, useEffect } from 'react'
import Header from './components/Header'
import InputForm from './components/InputForm'
import QuestionCard from './components/QuestionCard'

function App() {
  // ── Global state ─────────────────────────────────────────
  const [darkMode, setDarkMode] = useState(true)   // default: dark
  const [isLoading, setIsLoading] = useState(false)
  const [questions, setQuestions] = useState(null)  // null = no results yet
  const [error, setError] = useState(null)

  // ── Sync dark mode with <html data-theme="..."> ──────────
  // Whenever darkMode state changes, we update the HTML attribute.
  // Our CSS variables in index.css listen to [data-theme="dark"]
  // and swap all colors automatically.
  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      darkMode ? 'dark' : 'light'
    )
  }, [darkMode])

  // ── Handle form submission ────────────────────────────────
  // Stage 3: this just simulates a response.
  // Stage 4: we'll replace this with a real fetch() to FastAPI.
  const handleSubmit = async ({ jobRole, experienceLevel, techStack }) => {
    setIsLoading(true)
    setError(null)
    setQuestions(null)

    // ── TEMPORARY mock response for Stage 3 ──────────────
    // We're just testing the UI works correctly.
    // Replace this entire block in Stage 4 with a real API call.
    setTimeout(() => {
      setQuestions({
        beginner_questions: [
          `What is the difference between a list and a tuple in ${techStack}?`,
          `Explain what an API is in simple terms.`,
          `What is ${jobRole}'s primary responsibility in a team?`,
          `What does HTTP stand for and what are common status codes?`,
          `What is version control and why do ${jobRole}s use it?`,
        ],
        intermediate_questions: [
          `How would you design a REST API for a ${jobRole} role?`,
          `Explain async vs sync programming in ${techStack}.`,
          `How do you handle authentication in a ${techStack} application?`,
          `What is database indexing and when would you use it?`,
          `Describe a CI/CD pipeline you would set up as a ${experienceLevel} ${jobRole}.`,
        ],
        advanced_questions: [
          `How would you scale a ${techStack} system to 1M users?`,
          `Design a microservices architecture for a ${jobRole} team.`,
          `Explain the CAP theorem and its trade-offs in ${techStack}.`,
          `How do you debug a memory leak in a production ${techStack} app?`,
          `What strategies ensure zero-downtime deployments for a ${jobRole}?`,
        ],
      })
      setIsLoading(false)
    }, 1800) // simulate network delay
  }

  return (
    <div style={styles.app}>
      {/* ── Header with dark mode toggle ───────────────── */}
      <Header darkMode={darkMode} onToggle={() => setDarkMode(!darkMode)} />

      <main style={styles.main}>
        {/* ── Input form ─────────────────────────────────── */}
        <InputForm onSubmit={handleSubmit} isLoading={isLoading} />

        {/* ── Error state ────────────────────────────────── */}
        {error && (
          <div style={styles.errorBox}>
            <span>⚠️</span> {error}
          </div>
        )}

        {/* ── Results grid ───────────────────────────────── */}
        {/* Only rendered when questions state is not null */}
        {questions && (
          <>
            <div style={styles.resultsHeader}>
              <h2 style={styles.resultsTitle}>Your Interview Questions</h2>
              <p style={styles.resultsSubtitle}>
                AI-generated and tailored to your profile
              </p>
            </div>

            <div style={styles.grid}>
              <QuestionCard
                title="Beginner"
                questions={questions.beginner_questions}
                color="var(--beginner-color)"
                bgColor="var(--beginner-bg)"
                icon="🌱"
                delay={0}
              />
              <QuestionCard
                title="Intermediate"
                questions={questions.intermediate_questions}
                color="var(--intermediate-color)"
                bgColor="var(--intermediate-bg)"
                icon="⚡"
                delay={120}
              />
              <QuestionCard
                title="Advanced"
                questions={questions.advanced_questions}
                color="var(--advanced-color)"
                bgColor="var(--advanced-bg)"
                icon="🔥"
                delay={240}
              />
            </div>
          </>
        )}
      </main>
    </div>
  )
}

const styles = {
  app: {
    minHeight: '100vh',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1.5rem 4rem',
  },
  main: {
    paddingTop: '1rem',
  },
  errorBox: {
    maxWidth: '680px',
    margin: '0 auto 2rem',
    padding: '14px 20px',
    borderRadius: '12px',
    background: 'rgba(220, 38, 38, 0.1)',
    border: '1px solid rgba(220, 38, 38, 0.2)',
    color: 'var(--advanced-color)',
    fontSize: '0.9rem',
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  resultsHeader: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  resultsTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.6rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
    letterSpacing: '-0.03em',
    marginBottom: '6px',
  },
  resultsSubtitle: {
    fontSize: '0.9rem',
    color: 'var(--text-muted)',
    fontWeight: 300,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
    gap: '1.5rem',
  },
}

export default App