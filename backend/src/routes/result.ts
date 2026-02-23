import express from 'express';
import { body } from 'express-validator';
import { 
  submitQuiz, 
  getResultsByQuiz, 
  getResultsByUser,
  getResultById
} from '../controllers/resultController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = express.Router();

// Validation middleware
const validateQuizSubmission = [
  body('quizId').isMongoId().withMessage('Valid quiz ID is required'),
  body('answers').isArray().withMessage('Answers must be an array'),
  body('answers.*.questionIndex').isInt().withMessage('Question index must be an integer'),
  body('answers.*.selectedAnswer').trim().notEmpty().withMessage('Selected answer cannot be empty'),
];

router.route('/')
  .post(authenticateToken, validateQuizSubmission, submitQuiz)
  .get(authenticateToken, authorizeRoles('admin', 'faculty'), getResultsByQuiz);

router.route('/user/:userId')
  .get(authenticateToken, getResultsByUser);

router.route('/:id')
  .get(authenticateToken, getResultById);

export default router;