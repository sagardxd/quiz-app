import React, { useEffect, useState } from 'react';
import AddQuestion from '../components/AddQuestion'
import SingleQuestionCard from '../components/SingleQuestionCard';
import axios from 'axios';

const AddQuestionPage = () => {

  const [questions, setQuestions] = useState([]);
  let count = 1;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('http://localhost:3000/user/all-questions');
        setQuestions(response.data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, []);

  // whenever the question is added
  const handleQuestionAdded = async () => {
    try {
      const response = await axios.get('http://localhost:3000/user/all-questions');
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching questions after adding a question:', error);
    }
  };

  // delete question handler
  const handleDelete = (deletedQuestionId) => {
    setQuestions(questions.filter(question => question.id !== deletedQuestionId));
  };

  return (
    <div>
      <AddQuestion onQuestionAdded={handleQuestionAdded}/>
      <div>
        {questions.map((question) => (
          <div>
            <SingleQuestionCard
              key={question.id}
              question={question}
              count={count++}
              onDelete ={handleDelete}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default AddQuestionPage
