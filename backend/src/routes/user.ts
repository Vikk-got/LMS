import express from 'express';
import { body } from 'express-validator';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser, changeUserRole } from '../controllers/userController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = express.Router();

// Validation middleware
const validateUserCreation = [
  body('firstName').trim().isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),
  body('lastName').trim().isLength({ min: 2 }).withMessage('Last name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['admin', 'faculty', 'student']).withMessage('Invalid role')
];

const validateUserUpdate = [
  body('firstName').optional().trim().isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),
  body('lastName').optional().trim().isLength({ min: 2 }).withMessage('Last name must be at least 2 characters'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('role').optional().isIn(['admin', 'faculty', 'student']).withMessage('Invalid role'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
];

router.route('/')
  .get(authenticateToken, authorizeRoles('admin'), getAllUsers)
  .post(authenticateToken, authorizeRoles('admin'), validateUserCreation, createUser);

router.route('/:id')
  .get(authenticateToken, getUserById)
  .put(authenticateToken, authorizeRoles('admin'), validateUserUpdate, updateUser)
  .delete(authenticateToken, authorizeRoles('admin'), deleteUser);

router.put('/change-role/:id', authenticateToken, authorizeRoles('admin'), changeUserRole);

export default router;