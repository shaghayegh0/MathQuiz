import React from "react";

// A component that renders a single question and its answers
function QuizQuestion({ count, currentQuestion, selectedAnswer, handleAnswerChange, handleNextButtonClick }) {
    return (
      <div>
        <p>Question {count} out of 10</p>
        {currentQuestion && (
          <div key={currentQuestion.q}>
            <p>{currentQuestion.a}</p>
            <p>{currentQuestion.topic}</p>
            <h2 class='ques'>
              Q:{currentQuestion.q} (level: {currentQuestion.level})
            </h2>
            {/* <h3>a:{currentQuestion.a}</h3> */}
            <ul
              class='options'
              style={{ listStyle: "none", padding: 10 }}
            >
              {Array.isArray(currentQuestion.answers) &&
                currentQuestion.answers.map((answer) => (
                  <li key={answer}>
                    <label>
                      <input
                        type="radio"
                        name="answer"
                        value={answer}
                        checked={selectedAnswer === answer}
                        onChange={handleAnswerChange}
                      />
                      {answer}
                    </label>
                  </li>
                ))}
            </ul>
          </div>
        )}
        <button class='next' type="button" onClick={handleNextButtonClick}>
          next
        </button>
      </div>
    );
  }

export default QuizQuestion;