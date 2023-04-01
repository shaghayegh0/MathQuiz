import React, { useState, useEffect } from "react";
import "./App.css";


function App() {
  const [questions, setQuestions] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState({});
  const [points, setPoints] = useState([]);

  useEffect(() => {
    fetch("/Database.json")
    .then(response => response.json())
    .then(data => {
      if (!Array.isArray(data)) {
        data = [data];
      }
      var result = {};
      data.forEach(question => {
        result = question;
      });
      setQuestions(result.algebra);
      // Set first question
      console.log(result.algebra);
    })
    .catch(error => console.error(error));
  }, []);

  

  // Randomly select 1 questions from the questions array
  const randomQuestions = questions.sort(() => 0.5 - Math.random()).slice(0, 1);
  
  
  const handleNextQuestion = () => {
    

    // If the answer was correct
    if (correctAnswer) {

      //set correctAnswer to false
      //to select a new random question
      setCorrectAnswer(true);

      //add the q.level to points
      setPoints([...points, currentQuestion.level]);

      //filter questions based on currentQuestion.level
      const filteredQuestions = questions.filter(
        (question) => question.level === currentQuestion.level
      );

      //next questions are from higher levels
      const nextQuestion =
        filteredQuestions[
          Math.floor(Math.random() * filteredQuestions.length)
        ];

      //update current Quesiton2  
      setCurrentQuestion(nextQuestion);
    }


    // Otherwise, keep the current question and wait for the user to submit a correct answer
     else {
      setCorrectAnswer(false);
      setPoints([...points, 0]);
      
      const filteredQuestions = questions.filter(
        (question) => {
          console.log(question);
          console.log(currentQuestion);
          return question.level <= currentQuestion.level
        }
      );
      const nextQuestion =
        filteredQuestions[
          Math.floor(Math.random() * filteredQuestions.length)
        ];
      setCurrentQuestion(nextQuestion);
    }

  };


  return (
    <div>
      
      <div>Points: {points.join(", ")}</div>

      {/* Use currentQuestion instead of a map */}


      {randomQuestions.map((question) => (      
        <div key={question.q}>
          <h2 class='ques'>Q:{question.q} (level: {question.level})</h2> 
          {/* <h3>a:{question.a}</h3> */}
          
          <ul
            class="options"
            style={{ listStyle: "none", padding: 10 }}
          >
            {question.answers.map((answer) => (
              <li key={answer}>
                <label>
                  <input
                    type="checkbox"
                    name={answer}
                    value={answer}
                    onChange={() => {
                      // Check if the answer is correct
                      //update the state variable accordingly
                      // if (answer === question.a) {
                      //   setCorrectAnswer(true);
                      // }
                    }}
                  />
                  {answer}
                </label>
              </li>
            ))}
          </ul>



          <button class='next' type="submit" 
          onClick={handleNextQuestion}>
            next
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;
