import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({});
  const [visitedQuestions, setVisitedQuestions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [points, setPoints] = useState(0);
  const [count , setCount] = useState(0);

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
    setCount(count+1);
    update(selectedAnswer);
    if (visitedQuestions.length < 9) {
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
      alert(`Quiz is done! You got ${points} points.`);
      // new page
      window.location.reload();
    }
  };

  const update = (answer) => {
    if (answer === currentQuestion.a) {
      setPoints(points + currentQuestion.level);
    } else {
      setPoints(points + 0);
    }
    console.log("Updating with answer:", answer);
  };

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
