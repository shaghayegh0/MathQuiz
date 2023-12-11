import React from "react";

// A component that renders a table of results at the end of the quiz
function ResultsTable({ visitedQuestions, userAnswers, userPoints, totalPoints, handlePlayAgainClick }) {
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
            {visitedQuestions.current.map((q , index) => (
              <tr key={q.q}>
                <td>{q.topic}</td>
                <td>{q.level}</td>
                <td>{userAnswers.current[index] ? "Correct" : "Wrong"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p>
          You got {userPoints} out of {totalPoints} points.
        </p>
        <button class='playagain' onClick={handlePlayAgainClick}>Play Again</button>
      </div>
    );
  }

export default ResultsTable;