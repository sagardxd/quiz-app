import React, { useEffect, useState } from 'react';
import axios from 'axios';
import QuizResult from '../components/QuizResult';

const shuffleArray = (array) => {
  const shuffledArray = [...array];
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

const StartExamPage = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isLoading, setIsLoading] = useState(true); 
  const [quizResult, setQuizResult] = useState();

  // Fetch all questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('http://localhost:3000/user/all-questions');
        const shuffledQuestions = shuffleArray(response.data);
        setQuestions(shuffledQuestions);
        setIsLoading(false); // Mark loading as complete
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  // Timer management
  useEffect(() => {
    if (!isLoading && currentQuestionIndex < questions.length) {
      setTimeLeft(questions[currentQuestionIndex].timer);

      const timer = setInterval(() => {
        setTimeLeft(prevTimeLeft => {
          if (prevTimeLeft === 0) {
            clearInterval(timer);
            handleNextQuestion();
            return prevTimeLeft;
          } else {
            return prevTimeLeft - 1;
          }
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentQuestionIndex, questions, isLoading]);

  // Full screen toggle
  useEffect(() => {
    if (isQuizCompleted) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  }, [isQuizCompleted]);

  const handleSingleChoiceChange = (questionId, optionId) => {
    setAnswers({
      ...answers,
      [questionId]: optionId
    });
  };
  
  const handleMultipleChoiceChange = (questionId, optionId) => {
    setAnswers(prevAnswers => {
      const currentAnswers = prevAnswers[questionId] || []; // Get the current answers for the question
      const updatedAnswers = currentAnswers.includes(optionId)
        ? currentAnswers.filter(id => id !== optionId) // If the option is already selected, deselect it
        : [...currentAnswers, optionId]; // If not selected, add it to the selected options
      return {
        ...prevAnswers,
        [questionId]: updatedAnswers
      };
    });
  };

  // Next question handler
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsQuizCompleted(true);
      submitAnswers();
    }
  };

  const submitAnswers = async () => {
    try {
      const response = await axios.post('http://localhost:3000/user/submit-answers', { answers });
      console.log('Quiz results:', response.data);
      setScore(response.data.totalScore);
      setQuizResult(response.data)
    } catch (error) {
      console.error('Error submitting answers:', error);
    }
  };

  if (isQuizCompleted) {
    return <QuizResult {...quizResult} totalQuestions={questions.length}/>; // Pass quiz result data as props to QuizResult component
  }
  if (questions.length === 0 || isLoading) {
    return <h2>Loading questions...</h2>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">{currentQuestion.description}</h2>
      <div>
        {currentQuestion.isMultipleChoice 
          ? currentQuestion.options.map(option => (
              <div key={option.id} className="mb-4">
                <input
                  type="checkbox"
                  name={`question-${currentQuestion.id}`}
                  value={option.id}
                  checked={(answers[currentQuestion.id] || []).includes(option.id)}
                  onChange={() => handleMultipleChoiceChange(currentQuestion.id, option.id)}
                  className="mr-2"
                />
                <span>{option.questionText}</span>
              </div>
            ))
          : currentQuestion.options.map(option => (
              <div key={option.id} className="mb-4">
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  value={option.id}
                  checked={answers[currentQuestion.id] === option.id}
                  onChange={() => handleSingleChoiceChange(currentQuestion.id, option.id)}
                  className="mr-2"
                />
                <span>{option.questionText}</span>
              </div>
            ))
        }
      </div>
      <div>Time Left: {timeLeft} seconds</div>
      <button onClick={handleNextQuestion} className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600">Next</button>
    </div>
  );
};

export default StartExamPage;