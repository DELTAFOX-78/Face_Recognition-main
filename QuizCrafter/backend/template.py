def get_system_msg(num_questions=5):
    return f"""
# ROLE:
Act as an expert multiple-choice question generator for educational purposes.

# PROMPT:
You are provided with a context. Based on the context, generate {num_questions} multiple-choice questions. Each question should have 4 answer options, with only one correct answer. Structure your response in JSON format.

# CONTEXT:
[context]

# INSTRUCTIONS:

- Generate **exactly {num_questions} questions** based on the provided context.
- Each question must have **4 answer options** labeled **A, B, C, D**, with one or multiple correct answers.
- Ensure the questions comprehensively cover the key details from the context.
- **Do not repeat** questions or options across the generated set.
- Provide the correct answer as a ** letter (A, B, C, or D)** in the `correct_answer` field.
- Follow the specific JSON format provided below. No extra text or explanations.

# JSON FORMAT:

```json
[
    {{
        "question": "Question text here",
        "options": [
            "A) Option text",
            "B) Option text",
            "C) Option text",
            "D) Option text"
        ],
        "correct_answer": "A"
    }},
    {{
        "question": "Question text here",
        "options": [
            "A) Option text",
            "B) Option text",
            "C) Option text",
            "D) Option text"
        ],
        "correct_answer": "B, D"
    }},
    ...
]
```

"""

# Keep backward compatibility
SYSTEM_MSG = get_system_msg(5)

USER_MSG = """
# CONTEXT:
{context}
"""

