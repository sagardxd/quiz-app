const express = require('express');
const prisma = require('../prisma')
const router = express.Router();


router.get('/all-questions', async (req, res) => {
    try {
        const questions = await prisma.question.findMany({
            include: {
                options: true 
            }
        });
        res.status(200).json(questions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.post('/submit-answers', async (req, res) => {
  const { answers } = req.body;

  try {
    let totalScore = 0;
    let totalMarks = 0;
    let correctQuestionsCount = 0;

    for (const questionId in answers) {
      // Convert string IDs to integers
      const parsedQuestionId = parseInt(questionId, 10);

      // Fetch the correct options for the question
      const correctOptions = await prisma.option.findMany({
        where: {
          questionId: parsedQuestionId,
          isCorrect: true,
        },
        select: {
          id: true,
          question: {
            select: {
              marks: true,
            },
          },
        },
      });

      // Ensure answers[questionId] is always an array
      const selectedOptionIds = Array.isArray(answers[questionId])
        ? answers[questionId].map(optionId => parseInt(optionId, 10))
        : [parseInt(answers[questionId], 10)];

      // Increment total marks
      if (correctOptions[0]?.question) {
        totalMarks += correctOptions[0].question.marks;
      }

      // Check if the question is single-choice or multiple-choice
      const isMultipleChoice = correctOptions.length > 1;

      if (isMultipleChoice) {
        // For multiple-choice questions, check if the selected options match the correct options
        const userAnswerIds = new Set(selectedOptionIds);
        const correctAnswerIds = new Set(correctOptions.map(option => option.id));

        if (
          userAnswerIds.size === correctAnswerIds.size &&
          [...userAnswerIds].every(id => correctAnswerIds.has(id))
        ) {
          // If the selected options match all correct options, add the question's marks to the total score
          if (correctOptions[0].question) {
            totalScore += correctOptions[0].question.marks;
            correctQuestionsCount++;
          }
        }
      } else {
        // For single-choice questions, check if the selected option matches the correct option
        const selectedOptionId = selectedOptionIds[0]; // Since it's single-choice, get the first selected option ID

        const correctOptionId = correctOptions[0]?.id;

        if (selectedOptionId === correctOptionId) {
          // If the selected option matches the correct option, add the question's marks to the total score
          if (correctOptions[0].question) {
            totalScore += correctOptions[0].question.marks;
            correctQuestionsCount++;
          }
        }
      }
    }

    res.status(200).json({ 
      totalScore,
      totalMarks,
      correctQuestionsCount,
      attemptedQuestionsCount: Object.keys(answers).length
    });
  } catch (error) {
    console.error('Error evaluating answers:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/question/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const question = await prisma.question.findFirst
        ({
            where: { id: parseInt(id, 10) },
            include: {
                options: true 
            }
        });

        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }

        res.status(200).json(question);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;      