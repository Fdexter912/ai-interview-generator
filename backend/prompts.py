from langchain.prompts import PromptTemplate

SENIORITY_CONTEXT = {
    "junior": (
        "0-2 years experience. Focus on fundamentals, syntax knowledge, "
        "basic problem solving, and understanding of core concepts. "
        "Avoid system design or architecture questions."
    ),
    "mid": (
        "2-5 years experience. Focus on practical application, design "
        "patterns, debugging strategies, performance awareness, and "
        "ability to work independently on features."
    ),
    "senior": (
        "5+ years experience. Focus on system design, architectural "
        "trade-offs, team leadership, scalability, reliability, and "
        "deep expertise in the tech stack."
    ),
}

INTERVIEW_PROMPT_TEMPLATE = PromptTemplate(
    input_variables=["job_role", "experience_level", "tech_stack", "seniority_context"],
    template="""
You are a senior staff engineer with 15+ years of experience conducting \
technical interviews at top tech companies. You have interviewed hundreds \
of candidates for {job_role} positions.

CANDIDATE PROFILE:
- Role: {job_role}
- Experience Level: {experience_level}
- Tech Stack: {tech_stack}
- Level Definition: {seniority_context}

YOUR TASK:
Generate 5 interview questions for each of the three difficulty tiers below.
Every question must be tightly scoped to the candidate's role and tech stack.

DIFFICULTY TIERS:
- beginner: Core concepts, definitions, basic usage of {tech_stack}
- intermediate: Practical problem solving, trade-offs, real-world scenarios
- advanced: Architecture, scale, deep expertise, failure modes

For EACH question provide all four fields below. Think carefully about
what_interviewer_looks_for BEFORE writing the question — this ensures
the question actually tests the right skill.

STRICT OUTPUT FORMAT — return ONLY this JSON, no markdown, no extra text:

{{
  "beginner": [
    {{
      "question": "The interview question goes here",
      "hint": "A subtle nudge to help the candidate think in the right direction",
      "what_interviewer_looks_for": "The specific knowledge or skill being evaluated",
      "follow_up": "A deeper follow-up question to probe further"
    }}
  ],
  "intermediate": [
    {{
      "question": "The interview question goes here",
      "hint": "A subtle nudge to help the candidate think in the right direction",
      "what_interviewer_looks_for": "The specific knowledge or skill being evaluated",
      "follow_up": "A deeper follow-up question to probe further"
    }}
  ],
  "advanced": [
    {{
      "question": "The interview question goes here",
      "hint": "A subtle nudge to help the candidate think in the right direction",
      "what_interviewer_looks_for": "The specific knowledge or skill being evaluated",
      "follow_up": "A deeper follow-up question to probe further"
    }}
  ]
}}

RULES:
- Generate exactly 4 questions per tier (12 total)
- Every question must reference {job_role} or {tech_stack} specifically
- Hints should be subtle — not give away the answer
- Do NOT number questions inside the strings
- Do NOT wrap output in markdown code fences
- Do NOT include any text before or after the JSON
- Calibrate difficulty strictly to: {experience_level} ({seniority_context})
"""
)