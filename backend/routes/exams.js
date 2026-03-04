const express = require('express');
const { z } = require('zod');
const { verifyToken } = require('../middleware/auth');
const Exam = require('../models/Exam');

const router = express.Router();

const questionSchema = z.object({
  question: z.string().min(1),
  options: z.array(z.string()).length(4),
  correctAnswer: z.number().int().min(0).max(3)
});

const createExamSchema = z.object({
  examTitle: z.string().min(1),
  description: z.string().optional().default(''),
  duration: z.coerce.number().int().min(1).optional().default(60),
  questions: z.array(questionSchema).min(1)
});

const updateExamSchema = z.object({
  examTitle: z.string().min(1).optional(),
  description: z.string().optional(),
  duration: z.coerce.number().int().min(1).optional(),
  questions: z.array(questionSchema).min(1).optional()
});

// Get all available exams
router.get('/', async (req, res) => {
  try {
    const exams = await Exam.find({}).sort({ createdAt: -1 });
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch exams', error: error.message });
  }
});

// Get exam by ID
router.get('/:id', async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    res.json(exam);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch exam', error: error.message });
  }
});

// Create new exam
router.post('/', verifyToken, async (req, res) => {
  try {
    const parsed = createExamSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Please provide exam title and questions' });
    }

    const { examTitle, description, duration, questions } = parsed.data;

    const newExam = await Exam.create({
      examTitle,
      description,
      duration,
      createdBy: req.userId,
      questions: questions.map((q, index) => ({
        id: index + 1,
        question: q.question,
        type: 'mcq',
        options: q.options,
        correctAnswer: q.correctAnswer
      }))
    });

    res.status(201).json({
      message: 'Exam created successfully',
      exam: newExam
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create exam', error: error.message });
  }
});

// Update exam
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const parsed = updateExamSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: 'Please provide valid exam data' });
    }

    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    if (exam.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this exam' });
    }

    const { examTitle, description, duration, questions } = parsed.data;

    if (examTitle !== undefined) exam.examTitle = examTitle;
    if (description !== undefined) exam.description = description;
    if (duration !== undefined) exam.duration = duration;
    if (questions !== undefined) {
      exam.questions = questions.map((q, index) => ({
        id: index + 1,
        question: q.question,
        type: 'mcq',
        options: q.options,
        correctAnswer: q.correctAnswer
      }));
    }

    await exam.save();
    res.json({ message: 'Exam updated successfully', exam });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update exam', error: error.message });
  }
});

// Delete exam
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    if (exam.createdBy.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this exam' });
    }

    await Exam.findByIdAndDelete(req.params.id);
    res.json({ message: 'Exam deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete exam', error: error.message });
  }
});

module.exports = router;
