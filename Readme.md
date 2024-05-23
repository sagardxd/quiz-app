# Quiz App

## Overview

This is a comprehensive Quiz App that allows users to take exams, view results, and manage questions. The app supports single and multiple-choice questions, and includes features like full-screen mode during exams, timer management, and cheating prevention mechanisms.

## Features

- **User Authentication**: Secure login and registration for users.
- **Add Questions**: Admin can add questions manually or via an Excel file.
- **Shuffle Questions**: Questions are shuffled to ensure randomness.
- **Multiple Choice Support**: Questions can have single or multiple correct answers.
- **Timer**: Each question has a timer, and users must answer within the time limit.
- **Full-Screen Mode**: The exam runs in full-screen mode to prevent cheating.
- **Cheating Prevention**: Exiting full-screen mode or switching tabs will submit the exam automatically.
- **Quiz Results**: Users can view their scores and detailed results after completing the quiz.

## Tech Stack

- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: Postgres
- **File Upload**: Multer
- **HTTP Client**: Axios

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/quiz-app.git
   cd quiz-app
   ````
2. **Install dependencies in frontend**:

   ```bash
   cd frontend
   npm install
   npm run dev
   ````
2. **Install dependencies in backend**:

   ```bash
   cd backend
   npm install
   npm start
   ````
2. **Change the postgres url in backend env**:

   ```bash
   DATABASE_URL="Your url";
   ````
3. 


