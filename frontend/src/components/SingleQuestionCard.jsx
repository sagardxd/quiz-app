import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SingleQuestionCard = ({ question, count, onDelete }) => {
    const navigate = useNavigate(); 

    //handle update
    const handleUpdate = () => {
        navigate(`/update-question/${question.id}`, {state: question});
    }

    // handle delete handler
    const handleDelete = async() => {
        try {
        await axios.delete(`http://localhost:3000/admin/questions/${question.id}`);
        onDelete(question.id);
    } catch (error) {
        console.error('Error deleting question:', error);
      }
    }

    return (
        <div className="bg-white shadow-md rounded-lg p-6 mb-4">
        <h3 className="text-xl font-semibold mb-2">{`${count}. ${question.description}`}</h3>
        <p className="text-gray-600 mb-1">Timer: {question.timer} seconds</p>
        <p className="text-gray-600 mb-4">Marks: {question.marks}</p>
        <ul className="list-disc list-inside mb-4">
            {question.options.map((option) => (
                <li key={option.id} className="text-gray-700">
                    {option.questionText}
                    {option.isCorrect && <span className="text-green-500 font-semibold"> (Correct)</span>}
                </li>
            ))}
        </ul>
        <div className="flex space-x-4">
            <button
                onClick={handleUpdate}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
            >
                Update
            </button>
            <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
            >
                Delete
            </button>
        </div>
    </div>
    );
};

export default SingleQuestionCard;
