import React, { useState } from 'react';

const QuizPage = ({ questions }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerClick = (answer, correct) => {
    if (selectedAnswers[currentQuestionIndex] !== undefined) return; // prevent re-selection

    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: answer,
    });

    if (correct) setScore(score + 1);
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {!submitted ? (
        <>
          <div className="bg-white p-6 rounded shadow-md w-full max-w-xl">
            <h2 className="text-2xl font-bold mb-4">{currentQuestion.question}</h2>

            <div className="grid gap-4">
              {currentQuestion.answers.map((answer, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswerClick(answer.text, answer.correct)}
                  className={`px-4 py-2 rounded border ${selectedAnswers[currentQuestionIndex] === answer.text
                    ? answer.correct
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
                    : 'bg-gray-200'
                    }`}
                  disabled={selectedAnswers[currentQuestionIndex] !== undefined} // disable if already answered
                >
                  {answer.text}
                </button>
              ))}
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={goToPreviousQuestion}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
                disabled={currentQuestionIndex === 0}
              >
                Back
              </button>

              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  onClick={goToNextQuestion}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500"
                  disabled={selectedAnswers[currentQuestionIndex] === undefined}
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500"
                  disabled={selectedAnswers[currentQuestionIndex] === undefined}
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white p-6 rounded shadow-md w-full max-w-4xl h-[80vh] overflow-y-auto">
          <h2 className="text-3xl font-bold mb-4 text-center">Quiz Completed!</h2>
          <p className="text-xl text-center mb-8">Your final score is: <span className="font-bold text-indigo-600">{score}</span> / {questions.length}</p>

          <div className="space-y-8">
            {questions.map((q, qIndex) => (
              <div key={qIndex} className="border p-4 rounded-lg bg-gray-50">
                <h3 className="text-lg font-semibold mb-3">{qIndex + 1}. {q.question}</h3>
                <div className="grid gap-2">
                  {q.answers.map((answer, aIndex) => {
                    const isSelected = selectedAnswers[qIndex] === answer.text;
                    const isCorrect = answer.correct;

                    let styleClass = "bg-white border-gray-200 text-gray-700";

                    if (isCorrect) {
                      styleClass = "bg-green-100 border-green-500 text-green-800 font-medium ring-1 ring-green-500";
                    } else if (isSelected && !isCorrect) {
                      styleClass = "bg-red-100 border-red-500 text-red-800 ring-1 ring-red-500";
                    }

                    return (
                      <div
                        key={aIndex}
                        className={`p-3 rounded border flex justify-between items-center ${styleClass}`}
                      >
                        <span>{answer.text}</span>
                        {isCorrect && <span className="text-green-600 font-bold ml-2">✓ Correct</span>}
                        {isSelected && !isCorrect && <span className="text-red-600 font-bold ml-2">✗ Your Answer</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-500 font-semibold shadow-md transition duration-200"
            >
              Take Another Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPage;

