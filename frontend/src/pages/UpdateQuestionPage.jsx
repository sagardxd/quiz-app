import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateQuestionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState({
    description: '',
    timer: 0,
    marks: 0,
    options: []
  });
  const [isMultipleChoice, setIsMultipleChoice] = useState(false);

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/user/question/${id}`);
        setQuestion(response.data);
        
        // Determine if the question is multiple choice
        const hasMultipleCorrectOptions = response.data.options.filter(option => option.isCorrect).length > 1;
        setIsMultipleChoice(hasMultipleCorrectOptions);
      } catch (error) {
        console.error('Error fetching question:', error);
      }
    };

    fetchQuestion();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = name === 'marks' || name === 'timer' ? parseInt(value, 10) : value;
    setQuestion({
      ...question,
      [name]: parsedValue
    });
  };

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...question.options];
    newOptions[index][field] = value;
    setQuestion({
      ...question,
      options: newOptions
    });
  };

  const handleCorrectnessChange = (index) => {
    const newOptions = [...question.options];
    if (isMultipleChoice) {
      newOptions[index].isCorrect = !newOptions[index].isCorrect;
    } else {
      newOptions.forEach((option, i) => {
        option.isCorrect = i === index;
      });
    }
    setQuestion({
      ...question,
      options: newOptions
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/admin/questions/${id}`, {
        ...question,
        isMultipleChoice // Include the isMultipleChoice property
      });
      navigate('/add-questions');
    } catch (error) {
      console.error('Error updating question:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-white rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Update Question</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Description:</label>
          <input
            type="text"
            name="description"
            value={question.description}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Timer (seconds):</label>
          <input
            type="number"
            name="timer"
            value={question.timer}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Marks:</label>
          <input
            type="number"
            name="marks"
            value={question.marks}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Correctness Mode:</label>
          <select
            value={isMultipleChoice}
            onChange={(e) => setIsMultipleChoice(e.target.value === 'true')}
            className="w-full px-4 py-2 border rounded"
          >
            <option value={false}>Single Correct</option>
            <option value={true}>Multiple Correct</option>
          </select>
        </div>
        {question.options.map((option, index) => (
          <div key={index} className="mb-4">
            <label className="block mb-2">Option {index + 1}:</label>
            <input
              type="text"
              name="questionText"
              value={option.questionText}
              onChange={(e) => handleOptionChange(index, 'questionText', e.target.value)}
              className="w-full px-4 py-2 border rounded"
              required
            />
            <label className="block mb-2">
              {isMultipleChoice ? 'Correct:' : 'Select:'}
              <input
                type={isMultipleChoice ? 'checkbox' : 'radio'}
                name={`isCorrect-${index}`}
                checked={option.isCorrect}
                onChange={() => handleCorrectnessChange(index)}
                className="ml-2"
              />
            </label>
          </div>
        ))}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Update Question</button>
      </form>
    </div>
  );
};

export default UpdateQuestionPage;
