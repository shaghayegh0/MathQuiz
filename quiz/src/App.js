import React, { useState, useEffect } from "react";
import { useRef } from 'react';
import "./App.css";

function App() {
  // useState is a hook to store state across renders,
  // and trigger a re-render of the component when the state changes
  const [currentQuestion, setCurrentQuestion] = useState({});
  const [selectedAnswer, setSelectedAnswer] = useState({});
  const [points, setPoints] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [count, setCount] = useState(0);
  const [showPoints, setShowPoints] = useState(false);
  

  // - useRef is a hook to store state across renders, 
  // but not trigger a re-render of the component.
  // - Since questions and visitedQuestions are not used in the render,
  // we can use useRef instead of useState.
  // - Using useState would mean anything that's dependent on questions or visitedQuestions,
  // would re-render when questions or visitedQuestions changes.
  const questions = useRef([]);
  const visitedQuestions = useRef([]);
  const useranswers = useRef([]);

  // Fetch questions from database and parse them
  useEffect(() => {
    fetch("/Database.json")
      .then((response) => response.json())
      .then((data) => {
        // Grab the questions from the database
        const algebra = data.algebra;
        const calculus = data.calculus;
        const geometry = data.geometry;
        // Add the questions together and shuffle them
        questions.current = calculus.concat(algebra , geometry).sort(() => 0.5 - Math.random());
        // Find the first question
        const firstQuestion = questions.current.find((question) => question.level === 1);
        setCurrentQuestion(firstQuestion);
        visitedQuestions.current = [firstQuestion];
      })
      .catch((error) => console.error(error));
  }, []);

  const handleAnswerChange = (event) => {
    setSelectedAnswer(event.target.value);
  };

  // Find the next question based on the selected answer
  const handleNextButtonClick = () => {
    setCount(count + 1);
    update(selectedAnswer);
    if (visitedQuestions.current.length < 15) {
      // Find the next question
      const nextQuestion = questions.current.find((question) => {
        return safelyCheckLevel(selectedAnswer, question)
      })

      // Set the next question and reset the selected answer
      // Push the next question to the visitedQuestions array to check later in safelyCheckLevel
      visitedQuestions.current.push(nextQuestion);
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

    // If the user got the answer correct
    if (selectedAnswer === currentQuestion.a) {
      // If the current question is level 5, then the next question must be level 5 and not visited.
      // Else, the next question must be the current level + 1 and not visited.
      if (currentLevel === 5) {
        return potentialQuestionLevel === 5 && !visitedQuestions.current.includes(question);
      } else {
        // Next question can be either the current level, or the next level
        return (potentialQuestionLevel === currentLevel + 1 || potentialQuestionLevel === currentLevel)  && !visitedQuestions.current.includes(question);
      }
    } else {
      // If the current question is level 1, then the next question must be level 1 and not visited.
      // Else, the next question must be the previous level and not visited.
      if (currentLevel === 1) {
        return potentialQuestionLevel === 1 && !visitedQuestions.current.includes(question);
      } else {
        // Next question can be either the current level, or the previous level
        return (potentialQuestionLevel === currentLevel - 1 || potentialQuestionLevel === currentLevel) && !visitedQuestions.current.includes(question);
      }
    }
  }

  const update = (answer) => {
    setTotalPoints(totalPoints + currentQuestion.level);
    if (answer === currentQuestion.a) {
      useranswers.current.push(true);
      setPoints(points + currentQuestion.level);
    } else {
      useranswers.current.push(false);
      setPoints(points + 0);
    }
    console.log("Updating with answer:", answer);
  };

  // Reset the quiz
  const handlePlayAgainClick = () => {
    visitedQuestions.current = [];
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
            {visitedQuestions.current.map((q , index) => (
              <tr key={q.q}>
                <td>{q.topic}</td>
                <td>{q.level}</td>
                <td>{useranswers.current[index] ? "Correct" : "Wrong"}</td>
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
