import React from 'react';

const QuizResult = ({ totalScore, totalMarks, correctQuestionsCount, attemptedQuestionsCount, totalQuestions }) => {
  return (
    <div className="max-w-md mx-auto mt-8 bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Quiz completed!</h2>
      <p className="text-lg mb-4">Your score is <span className="text-blue-500">{totalScore}</span> out of <span className="text-blue-500">{totalMarks}</span> marks.</p>
      <p className="text-lg mb-4">You attempted <span className="text-blue-500">{attemptedQuestionsCount}</span> questions, correct answers <span className="text-blue-500">{correctQuestionsCount}</span></p>
      <p className="text-lg mb-4">Total number of questions: <span className="text-blue-500">{totalQuestions}</span></p>
    </div>
  );
};

export default QuizResult;
