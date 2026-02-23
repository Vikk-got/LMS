import express from 'express';
import { generateCertificate } from '../controllers/certificateController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.route('/generate/:enrollmentId')
  .get(authenticateToken, generateCertificate);

export default router;