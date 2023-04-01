import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({});
  const [visitedQuestions, setVisitedQuestions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [points, setPoints] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [count, setCount] = useState(0);
  const [showPoints, setShowPoints] = useState(false);
  const [userAnswer , setUserAnswer] = useState(false);

  useEffect(() => {
    fetch("/Database.json")
      .then((response) => response.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          data = [data];
        }
        var result = {};
        data.forEach((question) => {
          result = question;
        });
        setQuestions(result.algebra);
        console.log(result.algebra);
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    setCurrentQuestion(
      questions
        .filter(
          (question) =>
            question.level === 1 && !visitedQuestions.includes(question)
        )
        .sort(() => 0.5 - Math.random())
        .slice(0, 1)[0]
    );
  }, [questions]);

  const handleAnswerChange = (event) => {
    setSelectedAnswer(event.target.value);
  };

  const handleNextButtonClick = () => {
    setCount(count + 1);
    update(selectedAnswer);
    if (visitedQuestions.length < 10) {
      const nextQuestion = questions
        .filter(
          (question) =>
            (selectedAnswer === currentQuestion.a &&
              question.level >= currentQuestion.level &&
              !visitedQuestions.includes(question)) ||
            (selectedAnswer !== currentQuestion.a &&
              question.level <= currentQuestion.level &&
              !visitedQuestions.includes(question))
        )
        .sort(() => 0.5 - Math.random())
        .slice(0, 1)[0];
      setCurrentQuestion(nextQuestion);
      setVisitedQuestions([...visitedQuestions, currentQuestion]);
      setSelectedAnswer("");
    } else {
      // quiz is done
      // show the points
      setShowPoints(true);
    }
  };

  const update = (answer) => {
    setTotalPoints(totalPoints + currentQuestion.level);
    if (answer === currentQuestion.a) {
      setUserAnswer(true);
      setPoints(points + currentQuestion.level);
    } else {
      setPoints(points + 0);
    }
    console.log("Updating with answer:", answer);
  };

  const handlePlayAgainClick = () => {
    setVisitedQuestions([]);
    setPoints(0);
    setTotalPoints(0);
    setCount(0);
    setShowPoints(false);
  };

  if (showPoints) {
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
            {visitedQuestions.map((q) => (
              <tr key={q.q}>
                <td>{q.topic}</td>
                <td>{q.level}</td>
                <td>{userAnswer ? "Correct" : "Wrong"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p>
          You got {points} out of {totalPoints} points.
        </p>
        <button class='playagain' onClick={handlePlayAgainClick}>Play Again</button>
      </div>
    );
  }

  return (
    <div>
      <p>Question {count} out of 10</p>
      {currentQuestion && (
        <div key={currentQuestion.q}>
          <h2 class='ques'>
            Q:{currentQuestion.q} (level: {currentQuestion.level})
          </h2>
          {/* <h3>a:{currentQuestion.a}</h3> */}
          <ul class='options'
          style={{ listStyle: "none", padding: 10 }}>
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

export default App;
