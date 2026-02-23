import { Request, Response } from 'express';
import Enrollment from '../models/Enrollment';
import Course from '../models/Course';
import { AuthRequest } from '../middleware/auth';

interface EnrollmentRequestBody {
  courseId: string;
}

// @desc    Enroll in course
// @route   POST /api/enrollments
// @access  Private
export const enrollInCourse = async (req: AuthRequest, res: Response) => {
  try {
    const { courseId } = req.body;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      userId: req.user?._id,
      courseId
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      userId: req.user?._id,
      courseId
    });

    res.status(201).json({
      success: true,
      data: enrollment
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get my enrollments
// @route   GET /api/enrollments/my-enrollments
// @access  Private
export const getMyEnrollments = async (req: AuthRequest, res: Response) => {
  try {
    const enrollments = await Enrollment.find({ userId: req.user?._id })
      .populate('courseId', 'title description category thumbnail')
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get enrollments by course
// @route   GET /api/enrollments/course/:courseId
// @access  Private - Admin/Faculty
export const getEnrollmentsByCourse = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'admin' && req.user?.role !== 'faculty') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const enrollments = await Enrollment.find({ courseId: req.params.courseId })
      .populate('userId', 'firstName lastName email')
      .populate('courseId', 'title description')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get enrollments by user
// @route   GET /api/enrollments/user/:userId
// @access  Private - Admin/Faculty
export const getEnrollmentsByUser = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'admin' && req.user?.role !== 'faculty') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const enrollments = await Enrollment.find({ userId: req.params.userId })
      .populate('courseId', 'title description category thumbnail')
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update enrollment progress
// @route   PUT /api/enrollments/:id
// @access  Private
export const updateEnrollmentProgress = async (req: AuthRequest, res: Response) => {
  try {
    const { progress, grade } = req.body;

    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // Check if user is authorized to update this enrollment
    if (req.user?.role !== 'admin' && req.user?._id.toString() !== enrollment.userId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // For faculty, check if they're teaching the course
    if (req.user?.role === 'faculty') {
      const course = await Course.findById(enrollment.courseId);
      if (course?.instructorId.toString() !== req.user?._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    const updatedEnrollment = await Enrollment.findByIdAndUpdate(
      req.params.id,
      { progress, grade },
      { new: true, runValidators: true }
    )
      .populate('userId', 'firstName lastName email')
      .populate('courseId', 'title description');

    res.status(200).json({
      success: true,
      data: updatedEnrollment
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Unenroll from course
// @route   DELETE /api/enrollments/:id
// @access  Private
export const unenrollFromCourse = async (req: AuthRequest, res: Response) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    // Only the enrolled user or admin can unenroll
    if (req.user?.role !== 'admin' && req.user?._id.toString() !== enrollment.userId.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Enrollment.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Successfully unenrolled from course'
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};