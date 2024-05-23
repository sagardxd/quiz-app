const express = require('express');
const prisma = require('../prisma')
const xlsx = require('xlsx');
const path = require('path');
const multer = require('multer');
const router = express.Router();


// Multer setup for file uploads
const upload = multer({ dest: 'uploads/' });



// Route to add a question
router.post('/add-questions', async (req, res) => {
  const { marks, timer, description, options , isMultipleChoice} = req.body;

  if (!Array.isArray(options) || options.length !== 4) {
    return res.status(400).json({ error: 'Options must be an array of 4 items.' });
  }

  try {
    const question = await prisma.question.create({
      data: {
        marks,
        timer,
        description,
        isMultipleChoice,
        options: {
          create: options.map(option => ({
            questionText: option.questionText,
            isCorrect: option.isCorrect || false,  
          })),
        },
      },
    });

    res.status(201).json(question);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.post('/add-questions-excel', upload.single('file'), async (req, res) => {
  try {
    const { file } = req;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Load the Excel file
    const workbook = xlsx.readFile(file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    // Convert sheet to JSON
    const data = xlsx.utils.sheet_to_json(sheet);

    for (const entry of data) {
      const description = entry['description '];
      const timer = entry['timer '];
      const marks = entry['marks '];
      const isMultipleChoice = entry['isMultipleChoice '] === 't';
      const option1 = entry.option1;
      const option2 = entry.option2;
      const option3 = entry.option3;
      const option4 = entry.option4;
      const answers = isMultipleChoice ? entry['answers '].split(',') : [entry['answers ']];

      const question = await prisma.question.create({
        data: {
          description,
          timer,
          marks,
          isMultipleChoice,
          options: {
            create: [
              { questionText: option1, isCorrect: answers.includes('a') },
              { questionText: option2, isCorrect: answers.includes('b') },
              { questionText: option3, isCorrect: answers.includes('c') },
              { questionText: option4, isCorrect: answers.includes('d') },
            ],
          },
        },
      });

      console.log('Added question:', question);
    }

    res.status(200).json({ message: 'Questions logged successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.put('/questions/:questionId', async (req, res) => {
  const { questionId } = req.params;
  const { marks, timer, description, options , isMultipleChoice} = req.body;

  if (!Array.isArray(options) || options.length !== 4) {
    return res.status(400).json({ error: 'Options must be an array of 4 items.' });
  }

  try {
    const updatedQuestion = await prisma.question.update({
      data: {
        marks,
        timer,
        description,   
        isMultipleChoice
      },
      where: {
        id: parseInt(questionId, 10),
      },
    });

      // Delete existing options
      await prisma.option.deleteMany({
        where: {
          questionId: parseInt(questionId, 10),
        },
      });

      for (const optionData of options) {
        await prisma.option.create({
          data: {
            questionText: optionData.questionText,
            isCorrect: optionData.isCorrect,
            questionId: parseInt(questionId, 10),
          },
        });
      }
    

    res.json({ updatedQuestion,  });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Route to delete a question
router.delete('/questions/:questionId', async (req, res) => {
  const { examId, questionId } = req.params;

  try {


    await prisma.question.delete({
      where: { id: parseInt(questionId, 10) },
    });

    return res.status(204).json("deleted question");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;

