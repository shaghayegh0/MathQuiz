import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import ResultsTable from "./ResultsTable";
import QuizQuestion from "./QuizQuestion"

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
        // Randomize the order of the answers each time the page loads
        const algebra = randomizeAnswersOrder(data.algebra);
        const calculus = randomizeAnswersOrder(data.calculus);
        const geometry = randomizeAnswersOrder(data.geometry);
        // Add the questions together and shuffle them
        questions.current = calculus.concat(algebra, geometry).sort(() => 0.5 - Math.random());
        // Find the first question and set it as the current question
        const firstQuestion = questions.current.find((question) => question.level === 1);
        setCurrentQuestion(firstQuestion);
        // Add the first question to the visitedQuestions array
        visitedQuestions.current = [firstQuestion];
      })
      .catch((error) => console.error(error));
  }, []);

  // Randomize the order of the answers of every question in [questions]
  // Returns a new array of questions with randomized answers
  function randomizeAnswersOrder(questions) {
    return questions.map((question) => {
      question.answers.sort(() => 0.5 - Math.random());
      return question
    });
  }

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
        return potentialQuestionLevel === 5
          && !visitedQuestions.current.includes(question);
      } else {
        // Next question can be either the current level, or the next level
        return (potentialQuestionLevel === currentLevel + 1
          || potentialQuestionLevel === currentLevel)
          && !visitedQuestions.current.includes(question);
      }
    } else {
      // If the current question is level 1, then the next question must be level 1 and not visited.
      // Else, the next question must be the previous level and not visited.
      if (currentLevel === 1) {
        return potentialQuestionLevel === 1
          && !visitedQuestions.current.includes(question);
      } else {
        // Next question can be either the current level, or the previous level
        return (potentialQuestionLevel === currentLevel - 1
          || potentialQuestionLevel === currentLevel)
          && !visitedQuestions.current.includes(question);
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
    window.location.reload();
  };

  if (showPoints) {
    return (
      <ResultsTable
        visitedQuestions={visitedQuestions.current}
        userAnswers={useranswers.current}
        userPoints={points}
        totalPoints={totalPoints}
        handlePlayAgainClick={handlePlayAgainClick} />
    );
  }

  return (
    <QuizQuestion
      count={count}
      currentQuestion={currentQuestion}
      selectedAnswer={selectedAnswer}
      handleAnswerChange={handleAnswerChange}
      handleNextButtonClick={handleNextButtonClick}
    />
  );
}

export default App;
