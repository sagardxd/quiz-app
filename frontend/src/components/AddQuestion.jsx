import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';


const AddQuestionComponent = ({ onQuestionAdded }) => {

  const navigate = useNavigate();

  const [description, setDescription] = useState('');
  const [timer, setTimer] = useState('');
  const [marks, setMarks] = useState('');
  const [options, setOptions] = useState([
    { questionText: '', isCorrect: false },
    { questionText: '', isCorrect: false },
    { questionText: '', isCorrect: false },
    { questionText: '', isCorrect: false }
  ]);
  const [message, setMessage] = useState('');
  const [isMultipleChoice, setIsMultipleChoice] = useState(false); // Track mode

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...options];
    newOptions[index][field] = value;
    setOptions(newOptions);
  };

  const handleCorrectnessChange = (index) => {
    const newOptions = [...options];
    if (isMultipleChoice) {
      // Toggle checkbox value for multiple correct mode
      newOptions[index].isCorrect = !newOptions[index].isCorrect;
    } else {
      // For single correct mode, update all options accordingly
      newOptions.forEach((option, i) => {
        newOptions[i].isCorrect = i === index;
      });
    }
    setOptions(newOptions);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/admin/add-questions', {
        description,
        timer: parseInt(timer, 10),
        marks: parseInt(marks, 10),
        options,
        isMultipleChoice // Include the isMultipleChoice property
      });

      setMessage('Question added successfully!');
      setDescription('');
      setTimer('');
      setMarks('');
      setOptions([
        { questionText: '', isCorrect: false },
        { questionText: '', isCorrect: false },
        { questionText: '', isCorrect: false },
        { questionText: '', isCorrect: false }
      ]);
      setIsMultipleChoice(false); // Reset choice mode to default

      if (onQuestionAdded) {
        onQuestionAdded();
      }
    } catch (error) {
      console.error(error);
      setMessage('Failed to add question.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Add a New Question</h2>
      {message && <p className="text-green-600 mb-4">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1">Description:</label>
          <input
            className="border border-gray-300 rounded px-3 py-2 w-full"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Timer (seconds):</label>
          <input
            className="border border-gray-300 rounded px-3 py-2 w-full"
            type="number"
            value={timer}
            onChange={(e) => setTimer(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Marks:</label>
          <input
            className="border border-gray-300 rounded px-3 py-2 w-full"
            type="number"
            value={marks}
            onChange={(e) => setMarks(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">
            Choices mode:
            <select
              className="border border-gray-300 rounded px-3 py-2 w-full mt-1"
              value={isMultipleChoice}
              onChange={(e) => setIsMultipleChoice(e.target.value === 'true')}>
              <option value={false}>Single Correct</option>
              <option value={true}>Multiple Correct</option>
            </select>
          </label>
        </div>
        {options.map((option, index) => (
          <div key={index} className="mb-4">
            <label className="block mb-1">Option {index + 1}:</label>
            <input
              className="border border-gray-300 rounded px-3 py-2 w-full"
              type="text"
              value={option.questionText}
              onChange={(e) => handleOptionChange(index, 'questionText', e.target.value)}
              required
            />
            <label className="inline-flex items-center">
              {isMultipleChoice ? 'Correct:' : 'Select:'} {/* Label based on mode */}
              {isMultipleChoice ? (
                <input
                  type="checkbox"
                  checked={option.isCorrect}
                  onChange={() => handleCorrectnessChange(index)}
                  className="ml-2"
                />
              ) : (
                <input
                  type="radio"
                  name="isCorrect"
                  checked={option.isCorrect}
                  onChange={() => handleCorrectnessChange(index)}
                  className="ml-2"
                />
              )}
            </label>
          </div>
        ))}
        <div className='flex gap-5'>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Add Question
          </button>
          <Link to={"/add-questions-excel"}>
          <button type="button" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Add Question By Excel
          </button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default AddQuestionComponent;
