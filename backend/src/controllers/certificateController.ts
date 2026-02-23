import { Request, Response } from 'express';
import Enrollment from '../models/Enrollment';
import Course from '../models/Course';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';
import fs from 'fs';
import path from 'path';

// @desc    Generate certificate for course completion
// @route   GET /api/certificate/generate/:enrollmentId
// @access  Private - Student
export const generateCertificate = async (req: AuthRequest, res: Response) => {
  try {
    const { enrollmentId } = req.params;

    // Find the enrollment
    const enrollment = await Enrollment.findById(enrollmentId)
      .populate('userId', 'firstName lastName')
      .populate('courseId', 'title description instructorId')
      .populate({ path: 'courseId', populate: { path: 'instructorId', select: 'firstName lastName' } });

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // Check if user has permission to access this enrollment
    if (req.user?.role !== 'admin' && enrollment.userId._id.toString() !== req.user?._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to access this enrollment' });
    }

    // Check if the course is completed
    if (enrollment.progress < 100) {
      return res.status(400).json({ message: 'Course not completed' });
    }

    // For simplicity, we'll return a placeholder response
    // In a real implementation, you would generate a PDF certificate
    res.status(200).json({
      success: true,
      message: 'Certificate generated successfully',
      data: {
        enrollmentId: enrollment._id,
        studentName: `${(enrollment.userId as any).firstName} ${(enrollment.userId as any).lastName}`,
        courseTitle: (enrollment.courseId as any).title,
        completionDate: enrollment.completedAt || new Date(),
        grade: enrollment.grade
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};