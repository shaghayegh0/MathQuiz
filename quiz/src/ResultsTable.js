import React from "react";

// A component that renders a table of results at the end of the quiz
function ResultsTable({ questions, userAnswer, userPoints, totalPoints, handlePlayAgainClick }) {
    return (
      <div class='result'>
        <h2>Quiz Results</h2>
        <table>
          <thead>
            <tr>
              <th>Topic</th>
              <th>Level</th>
              <th>C/W</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((question) => (
              <tr key={question.q}>
                <td>{question.topic}</td>
                <td>{question.level}</td>
                {/* TODO: Keep track of user's answer for each question */}
                <td>{userAnswer ? "Correct" : "Wrong"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p>You got {userPoints} out of {totalPoints} points.</p>
        <button class='playagain' onClick={handlePlayAgainClick}>
          Play Again
        </button>
      </div>
    );
  }

export default ResultsTable;