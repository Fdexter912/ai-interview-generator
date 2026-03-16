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
  // ── Real API call ─────────────────────────────────────────
  const handleSubmit = async ({ jobRole, experienceLevel, techStack }) => {
    setIsLoading(true)
    setError(null)
    setQuestions(null)

    try {
      // fetch() sends an HTTP request.
      // We use /api/generate-questions (not the full localhost URL)
      // because Vite's proxy will forward it to FastAPI.
      const response = await fetch('/api/generate-questions', {
        method: 'POST',

        // Tell the server we're sending JSON
        headers: {
          'Content-Type': 'application/json',
        },

        // JSON.stringify converts the JS object to a JSON string
        // to match FastAPI's QuestionRequest model fields exactly
        body: JSON.stringify({
          job_role: jobRole,
          experience_level: experienceLevel,
          tech_stack: techStack,
        }),
      })

      // ── Handle HTTP errors ──────────────────────────────
      // fetch() does NOT throw on 4xx/5xx — you must check manually.
      // response.ok is true for status codes 200-299.
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || `Server error: ${response.status}`)
      }

      // ── Parse JSON response ─────────────────────────────
      // response.json() reads the response body and parses it
      // into a JavaScript object matching QuestionResponse
      const data = await response.json()
      setQuestions(data)

    } catch (err) {
      // Network errors (backend offline) or thrown errors above
      console.error('[API Error]', err)
      setError(
        err.message.includes('Failed to fetch')
          ? 'Cannot reach the backend. Is FastAPI running on port 8000?'
          : err.message
      )
    } finally {
      // finally always runs — whether success or error.
      // Perfect for cleaning up loading state.
      setIsLoading(false)
    }
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