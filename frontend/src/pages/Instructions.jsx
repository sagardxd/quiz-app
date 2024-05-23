import React from 'react';
import { Link } from 'react-router-dom';

const Instructions = () => {

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Instructions</h2>
        <ul className="list-disc pl-6">
          <li>You cannot open any other browser tabs or windows during the exam.</li>
          <li>Press the "Esc" key to attend to a call of nature, but your timer won't stop.</li>
          <li>If you attempt to cheat, the exam will be submitted, and you'll be expelled.</li>
          <li>Submit your answers only once you have completed the exam.</li>
        </ul>
        <Link to={"/start-exam"}>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600">
          Start Exam
        </button>
        </Link>
      </div>
    </div>
  );
};

export default Instructions;
