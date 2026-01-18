import os
import shutil
from typing import List

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from quiz_llm import QuizCrafter

app = FastAPI()


# CORS setup to allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this based on the frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the QuizCrafter
ques_llm = QuizCrafter(base_url="http://localhost:11434")

# Directory for uploaded PDFs
UPLOAD_FOLDER = "./uploads"


# Pydantic models
class Answer(BaseModel):
    text: str
    correct: bool


class QuestionResponse(BaseModel):
    question: str
    answers: List[Answer]


# Helper function to convert questions to the desired format
def format_questions(questions):
    formatted_questions = []
    for question_obj in questions:
        formatted_question = {
            "question": question_obj["question"],
            "answers": [
                {
                    "text": option,
                    "correct": option.startswith(question_obj["correct_answer"]),
                }
                for option in question_obj["options"]
            ],
        }
        formatted_questions.append(QuestionResponse(**formatted_question))
    return formatted_questions


# 1) Endpoint to upload PDF
@app.post("/upload/")
async def upload_pdf(file: UploadFile = File(...)):
    try:
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)
        file_path = os.path.join(UPLOAD_FOLDER, "book.pdf")
        with open(file_path, "wb") as f:
            shutil.copyfileobj(file.file, f)
        return {"message": "File uploaded successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# 2) Endpoint to generate questions from a specific topic
@app.post("/generate-questions/", response_model=List[QuestionResponse])
async def generate_questions(topic: str = Form(...)):
    try:
        # Assuming the PDF has already been uploaded and stored
        pdf_path = os.path.join(
            UPLOAD_FOLDER, "book.pdf"
        )  # Adjust the file path if needed
        _ = ques_llm.load_docs(pdf_path)
        questions = ques_llm.get_questions(topic)

        # Format questions to match the required structure
        formatted_questions = format_questions(questions)

        return formatted_questions

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Helper function to format questions for MongoDB Quiz model
def format_questions_for_db(questions):
    """
    Converts QuizCrafter's question format to the Node.js Quiz model format.
    """
    formatted = []
    for q in questions:
        correct_ans_letter = q.get("correct_answer", "").strip()
        options = q.get("options", [])
        
        # Map letter (A, B, C, D) to the full option text
        correct_answer_text = ""
        letter_to_index = {"A": 0, "B": 1, "C": 2, "D": 3}
        
        if correct_ans_letter in letter_to_index and len(options) > letter_to_index[correct_ans_letter]:
            correct_answer_text = options[letter_to_index[correct_ans_letter]]
        else:
            # Fallback: try to find option starting with the letter
            for opt in options:
                if opt.strip().startswith(correct_ans_letter + ")"):
                    correct_answer_text = opt
                    break
        
        formatted.append({
            "type": "MCQ",
            "question": q["question"],
            "options": options,
            "correctAnswer": correct_answer_text,
            "marks": 1
        })
    return formatted


# 3) Endpoint for Node.js backend integration - returns MongoDB-compatible format
@app.post("/generate-quiz-for-db/")
async def generate_quiz_for_db(
    file: UploadFile = File(...),
    topic: str = Form(...),
    numQuestions: int = Form(5)
):
    """
    Generates quiz questions from a PDF and returns them in the format
    compatible with the Node.js Quiz MongoDB model.
    """
    try:
        # Save uploaded file with unique name
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)
        file_path = os.path.join(UPLOAD_FOLDER, file.filename)
        with open(file_path, "wb") as f:
            shutil.copyfileobj(file.file, f)
        
        # Load document and generate questions with specified count
        _ = ques_llm.load_docs(file_path)
        questions = ques_llm.get_questions(topic, numQuestions)
        
        if questions is None:
            raise HTTPException(status_code=500, detail="Failed to generate questions from LLM")
        
        # Ensure we don't exceed the requested number (in case LLM generates extra)
        questions = questions[:numQuestions]
        
        # Format for MongoDB
        formatted_questions = format_questions_for_db(questions)
        
        return {
            "questions": formatted_questions,
            "resourceFile": file_path
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

