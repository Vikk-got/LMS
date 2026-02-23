import express from 'express';
import { body } from 'express-validator';
import { 
  getAllAssignments, 
  getAssignmentById, 
  createAssignment, 
  updateAssignment, 
  deleteAssignment,
  getAssignmentsByCourse
} from '../controllers/assignmentController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = express.Router();

// Validation middleware
const validateAssignmentCreation = [
  body('title').trim().isLength({ min: 5 }).withMessage('Title must be at least 5 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('courseId').isMongoId().withMessage('Valid course ID is required'),
  body('dueDate').isISO8601().withMessage('Valid due date is required'),
  body('maxPoints').isNumeric().withMessage('Max points must be a number')
];

const validateAssignmentUpdate = [
  body('title').optional().trim().isLength({ min: 5 }).withMessage('Title must be at least 5 characters'),
  body('description').optional().trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('dueDate').optional().isISO8601().withMessage('Valid due date is required'),
  body('maxPoints').optional().isNumeric().withMessage('Max points must be a number'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
];

router.route('/')
  .get(authenticateToken, getAllAssignments)
  .post(authenticateToken, authorizeRoles('admin', 'faculty'), validateAssignmentCreation, createAssignment);

router.route('/course/:courseId')
  .get(authenticateToken, getAssignmentsByCourse);

router.route('/:id')
  .get(authenticateToken, getAssignmentById)
  .put(authenticateToken, authorizeRoles('admin', 'faculty'), validateAssignmentUpdate, updateAssignment)
  .delete(authenticateToken, authorizeRoles('admin', 'faculty'), deleteAssignment);

export default router;