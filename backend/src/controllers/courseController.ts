import { Request, Response } from 'express';
import Course from '../models/Course';
import { AuthRequest } from '../middleware/auth';

interface CourseRequestBody {
  title: string;
  description: string;
  category: string;
  instructorId: string;
  thumbnail?: string;
}

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
export const getAllCourses = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const courses = await Course.find()
      .populate('instructorId', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Course.countDocuments();

    res.status(200).json({
      success: true,
      count: courses.length,
      page,
      totalPages: Math.ceil(total / limit),
      data: courses,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
export const getCourseById = async (req: Request, res: Response) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructorId', 'firstName lastName email');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new course
// @route   POST /api/courses
// @access  Private - Admin/Faculty
export const createCourse = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, category, thumbnail } = req.body;

    // Add instructor ID from authenticated user
    const courseData = {
      title,
      description,
      category,
      thumbnail,
      instructorId: req.user?._id,
    };

    const course = await Course.create(courseData);

    res.status(201).json({
      success: true,
      data: course,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private - Admin/Faculty
export const updateCourse = async (req: AuthRequest, res: Response) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is the instructor or admin
    if (course.instructorId.toString() !== req.user?._id.toString() && req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private - Admin/Faculty
export const deleteCourse = async (req: AuthRequest, res: Response) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user is the instructor or admin
    if (course.instructorId.toString() !== req.user?._id.toString() && req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this course' });
    }

    await Course.deleteOne({ _id: course._id });

    res.status(200).json({
      success: true,
      message: 'Course removed',
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get courses by instructor
// @route   GET /api/courses/my-courses
// @access  Private
export const getCoursesByInstructor = async (req: AuthRequest, res: Response) => {
  try {
    const courses = await Course.find({ instructorId: req.user?._id })
      .populate('instructorId', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get courses by category
// @route   GET /api/courses/category/:category
// @access  Public
export const getCoursesByCategory = async (req: Request, res: Response) => {
  try {
    const courses = await Course.find({ category: req.params.category })
      .populate('instructorId', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};