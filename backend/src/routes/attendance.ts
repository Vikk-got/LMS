import express from 'express';
import { body } from 'express-validator';
import { 
  markAttendance, 
  getAttendanceByCourse, 
  getAttendanceByStudent,
  getAttendanceByDate
} from '../controllers/attendanceController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = express.Router();

// Validation middleware
const validateAttendance = [
  body('courseId').isMongoId().withMessage('Valid course ID is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('attendanceRecords').isArray().withMessage('Attendance records must be an array'),
  body('attendanceRecords.*.studentId').isMongoId().withMessage('Valid student ID is required'),
  body('attendanceRecords.*.present').isBoolean().withMessage('Present must be a boolean'),
];

router.route('/')
  .post(authenticateToken, authorizeRoles('admin', 'faculty'), validateAttendance, markAttendance)
  .get(authenticateToken, authorizeRoles('admin', 'faculty'), getAttendanceByCourse);

router.route('/course/:courseId')
  .get(authenticateToken, authorizeRoles('admin', 'faculty'), getAttendanceByCourse);

router.route('/student/:studentId')
  .get(authenticateToken, getAttendanceByStudent);

router.route('/date/:date')
  .get(authenticateToken, getAttendanceByDate);

export default router;