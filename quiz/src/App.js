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
  const [userAnswer, setUserAnswer] = useState(false);

  // Fetch questions from database and parse them
  useEffect(() => {
    fetch("/Database.json")
      .then((response) => response.json())
      .then((data) => {
        // Grab the questions from the database
        const algebra = data.algebra;
        const calculus = data.calculus;
        // Add the questions together and shuffle them
        setQuestions(calculus.concat(algebra ).sort(() => 0.5 - Math.random()));
      })
      .catch((error) => console.error(error));
  }, []);

  // Get the first question with a useEffect hook
  useEffect(() => {
    setCurrentQuestion(
      questions.find((question) => question.level === 1)
    );
  }, [questions]);

  const handleAnswerChange = (event) => {
    setSelectedAnswer(event.target.value);
  };

  // Find the next question based on the selected answer
  const handleNextButtonClick = () => {
    setCount(count + 1);
    update(selectedAnswer);
    if (visitedQuestions.length < 10) {
      // Push the current question to the visitedQuestions array
      setVisitedQuestions(previouslyVisitedQuestions => [...previouslyVisitedQuestions, currentQuestion]);
      console.log("visitedQuestions:", visitedQuestions);

      // Find the next question
      const nextQuestion = questions.find((question) => {
        return safelyCheckLevel(selectedAnswer, question)
      })

      // Set the next question and reset the selected answer
      setCurrentQuestion(nextQuestion);
      setSelectedAnswer({});
    } else {
      // Quiz is done
      // Show the points
      setShowPoints(true);
    }
  };

  // Check if the question is the next question in the sequence.
  // Prevents overflow and underflow of levels.
  // i.e. If level is 5, and user gets the answer correct, stay on level 5.
  function safelyCheckLevel(selectedAnswer, question) {
    const currentLevel = currentQuestion.level;
    const potentialQuestionLevel = question.level;

    if (selectedAnswer === currentQuestion.a) {
      // If the current question is level 5, then the next question must be level 5 and not visited.
      // Else, the next question must be the current level + 1 and not visited.
      if (currentLevel === 5) {
        
        console.log("visitedQuestions:", visitedQuestions);
        console.log("question:", question.q);
        return potentialQuestionLevel === 5 && !visitedQuestions.map((q) => q.q).includes(question.q);
      } else {
        return potentialQuestionLevel === currentLevel + 1  && !visitedQuestions.includes(question);
      }
    } else {
      // If the current question is level 1, then the next question must be level 1 and not visited.
      // Else, the next question must be the previous level and not visited.
      if (currentLevel === 1) {
        return potentialQuestionLevel === 1 && !visitedQuestions.map((q) => q.q).includes(question.q);
      } else {
        return potentialQuestionLevel === currentLevel - 1 && !visitedQuestions.includes(question);
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

  // Reset the quiz
  const handlePlayAgainClick = () => {
    setVisitedQuestions([]);
    setPoints(0);
    setTotalPoints(0);
    setCount(0);
    setShowPoints(false);
    window.location.reload();
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
          <p>{currentQuestion.topic}</p>
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
