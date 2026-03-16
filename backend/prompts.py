from langchain.prompts import PromptTemplate

INTERVIEW_PROMPT_TEMPLATE = PromptTemplate(
    input_variables=["job_role", "experience_level", "tech_stack"],
    template="""
You are an expert technical interviewer with 15 years of experience.

Generate interview questions for the following candidate profile:
- Job Role: {job_role}
- Experience Level: {experience_level}
- Tech Stack: {tech_stack}

Generate exactly 5 questions for each difficulty level.
Return ONLY a valid JSON object with no extra text, in this exact format:

{{
  "beginner": [
    "Question 1",
    "Question 2",
    "Question 3",
    "Question 4",
    "Question 5"
  ],
  "intermediate": [
    "Question 1",
    "Question 2",
    "Question 3",
    "Question 4",
    "Question 5"
  ],
  "advanced": [
    "Question 1",
    "Question 2",
    "Question 3",
    "Question 4",
    "Question 5"
  ]
}}

Important rules:
- Make questions specific to {job_role} and {tech_stack}
- Beginner: fundamental concepts and definitions
- Intermediate: practical application and problem-solving
- Advanced: system design, architecture, and deep expertise
- Do not include question numbers or bullet points inside the strings
- Return ONLY the JSON, nothing else
"""
)