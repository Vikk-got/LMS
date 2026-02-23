import express from 'express';
import { body } from 'express-validator';
import { 
  enrollInCourse, 
  getMyEnrollments, 
  getEnrollmentsByCourse,
  getEnrollmentsByUser,
  updateEnrollmentProgress,
  unenrollFromCourse
} from '../controllers/enrollmentController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = express.Router();

// Validation middleware
const validateEnrollment = [
  body('courseId').isMongoId().withMessage('Valid course ID is required'),
];

router.route('/')
  .post(authenticateToken, validateEnrollment, enrollInCourse);

router.route('/my-enrollments')
  .get(authenticateToken, getMyEnrollments);

router.route('/course/:courseId')
  .get(authenticateToken, authorizeRoles('admin', 'faculty'), getEnrollmentsByCourse);

router.route('/user/:userId')
  .get(authenticateToken, authorizeRoles('admin', 'faculty'), getEnrollmentsByUser);

router.route('/:id')
  .put(authenticateToken, updateEnrollmentProgress)
  .delete(authenticateToken, unenrollFromCourse);

export default router;