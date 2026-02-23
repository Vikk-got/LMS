import express from 'express';
import { body } from 'express-validator';
import { 
  getAllCourses, 
  getCourseById, 
  createCourse, 
  updateCourse, 
  deleteCourse,
  getCoursesByInstructor
} from '../controllers/courseController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = express.Router();

// Validation middleware
const validateCourseCreation = [
  body('title').trim().isLength({ min: 5 }).withMessage('Title must be at least 5 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('instructorId').isMongoId().withMessage('Valid instructor ID is required')
];

const validateCourseUpdate = [
  body('title').optional().trim().isLength({ min: 5 }).withMessage('Title must be at least 5 characters'),
  body('description').optional().trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('category').optional().trim().notEmpty().withMessage('Category is required'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
];

router.route('/')
  .get(getAllCourses)
  .post(authenticateToken, authorizeRoles('admin', 'faculty'), validateCourseCreation, createCourse);

router.route('/my-courses')
  .get(authenticateToken, getCoursesByInstructor);



router.route('/:id')
  .get(getCourseById)
  .put(authenticateToken, authorizeRoles('admin', 'faculty'), validateCourseUpdate, updateCourse)
  .delete(authenticateToken, authorizeRoles('admin', 'faculty'), deleteCourse);

export default router;