import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({});
  const [visitedQuestions, setVisitedQuestions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState({});
  const [points, setPoints] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [count, setCount] = useState(0);
  const [showPoints, setShowPoints] = useState(false);
  const [userAnswer , setUserAnswer] = useState(false);

  // Fetch questions from database and parse them
  useEffect(() => {
    fetch("/Database.json")
      .then((response) => response.json())
      .then((data) => {
        setQuestions(data.algebra);
      })
      .catch((error) => console.error(error));
  }, []);

  // Set the current question with a useEffect hook
  useEffect(() => {
    setCurrentQuestion(
      questions
        .filter((question) => {
            return question.level === 1 && !visitedQuestions.includes(question)
        })
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
      setVisitedQuestions([...visitedQuestions, currentQuestion]);

      const nextQuestion = questions.find((question) => {
          return safelyCheckLevel(selectedAnswer, question)
      })

      setCurrentQuestion(nextQuestion);
      setSelectedAnswer("");
    } else {
      // quiz is done
      // show the points
      setShowPoints(true);
    }
  };

  function safelyCheckLevel(selectedAnswer, question) {
    console.log(visitedQuestions);

    if (selectedAnswer === currentQuestion.a) {
      if (currentQuestion.level === 5) {
        console.log(visitedQuestions);
        return question.level === 5 && !visitedQuestions.includes(question);
      } else {
        return question.level === currentQuestion.level + 1 && !visitedQuestions.includes(question);
      }
    } else {
      if (currentQuestion.level === 1) {
        return question.level === 1 && !visitedQuestions.includes(question);
      } else {
        return question.level === currentQuestion.level - 1 && !visitedQuestions.includes(question);
      }
    }
  }

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
          <p>{currentQuestion.a}</p>
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
