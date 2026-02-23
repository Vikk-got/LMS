import express from 'express';
import { body } from 'express-validator';
import { 
  getAllQuizzes, 
  getQuizById, 
  createQuiz, 
  updateQuiz, 
  deleteQuiz,
  getQuizzesByCourse
} from '../controllers/quizController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = express.Router();

// Validation middleware
const validateQuizCreation = [
  body('title').trim().isLength({ min: 5 }).withMessage('Title must be at least 5 characters'),
  body('courseId').isMongoId().withMessage('Valid course ID is required'),
  body('questions').isArray({ min: 1 }).withMessage('At least one question is required'),
  body('questions.*.question').trim().notEmpty().withMessage('Question cannot be empty'),
  body('questions.*.options').isArray({ min: 2 }).withMessage('At least two options are required'),
  body('questions.*.correctAnswer').trim().notEmpty().withMessage('Correct answer cannot be empty'),
  body('maxPoints').isNumeric().withMessage('Max points must be a number'),
  body('duration').isNumeric().withMessage('Duration must be a number')
];

const validateQuizUpdate = [
  body('title').optional().trim().isLength({ min: 5 }).withMessage('Title must be at least 5 characters'),
  body('questions').optional().isArray({ min: 1 }).withMessage('At least one question is required'),
  body('questions.*.question').optional().trim().notEmpty().withMessage('Question cannot be empty'),
  body('questions.*.options').optional().isArray({ min: 2 }).withMessage('At least two options are required'),
  body('questions.*.correctAnswer').optional().trim().notEmpty().withMessage('Correct answer cannot be empty'),
  body('maxPoints').optional().isNumeric().withMessage('Max points must be a number'),
  body('duration').optional().isNumeric().withMessage('Duration must be a number'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
];

router.route('/')
  .get(authenticateToken, getAllQuizzes)
  .post(authenticateToken, authorizeRoles('admin', 'faculty'), validateQuizCreation, createQuiz);

router.route('/course/:courseId')
  .get(authenticateToken, getQuizzesByCourse);

router.route('/:id')
  .get(authenticateToken, getQuizById)
  .put(authenticateToken, authorizeRoles('admin', 'faculty'), validateQuizUpdate, updateQuiz)
  .delete(authenticateToken, authorizeRoles('admin', 'faculty'), deleteQuiz);

export default router;