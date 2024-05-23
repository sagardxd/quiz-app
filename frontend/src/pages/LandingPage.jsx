import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Link to="/add-questions" className="mb-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Add Exam</button>
      </Link>
      <Link to="/instructions">
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Take Exam</button>
      </Link>
    </div>
  );
};

export default LandingPage;
