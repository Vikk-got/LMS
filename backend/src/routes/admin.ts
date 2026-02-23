import express from 'express';
import { getAdminStats } from '../controllers/userController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = express.Router();

router.route('/stats')
  .get(authenticateToken, authorizeRoles('admin'), getAdminStats);

export default router;