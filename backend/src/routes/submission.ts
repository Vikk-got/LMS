import express from 'express';
import { body } from 'express-validator';
import { 
  submitAssignment, 
  getSubmissionsByAssignment, 
  getMySubmissions,
  gradeSubmission,
  getSubmissionById
} from '../controllers/submissionController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = express.Router();

// Validation middleware
const validateSubmission = [
  body('assignmentId').isMongoId().withMessage('Valid assignment ID is required'),
];

const validateGrading = [
  body('grade').isFloat({ min: 0, max: 100 }).withMessage('Grade must be between 0 and 100'),
  body('feedback').optional().trim(),
];

router.route('/')
  .post(authenticateToken, validateSubmission, submitAssignment)
  .get(authenticateToken, authorizeRoles('admin', 'faculty'), getSubmissionsByAssignment);

router.route('/my-submissions')
  .get(authenticateToken, getMySubmissions);

router.route('/:id')
  .get(authenticateToken, getSubmissionById)
  .put(authenticateToken, authorizeRoles('admin', 'faculty'), validateGrading, gradeSubmission);

export default router;