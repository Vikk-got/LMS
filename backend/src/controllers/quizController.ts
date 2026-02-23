import { Request, Response } from 'express';
import Quiz from '../models/Quiz';
import Course from '../models/Course';
import { AuthRequest } from '../middleware/auth';

interface QuizRequestBody {
  title: string;
  description?: string;
  courseId: string;
  questions: {
    question: string;
    options: string[];
    correctAnswer: string;
  }[];
  maxPoints: number;
  duration: number;
}

// @desc    Get all quizzes
// @route   GET /api/quizzes
// @access  Private
export const getAllQuizzes = async (req: AuthRequest, res: Response) => {
  try {
    // Only admins and faculty can see all quizzes
    let quizzesQuery = {};
    
    if (req.user?.role === 'student') {
      // Students can only see quizzes from their enrolled courses
      // For now, we'll return all active quizzes
      quizzesQuery = { isActive: true };
    }

    const quizzes = await Quiz.find(quizzesQuery)
      .populate('createdBy', 'firstName lastName email')
      .populate('courseId', 'title description')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: quizzes.length,
      data: quizzes
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get quizzes by course
// @route   GET /api/quizzes/course/:courseId
// @access  Private
export const getQuizzesByCourse = async (req: AuthRequest, res: Response) => {
  try {
    const course = await Course.findById(req.params.courseId);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user has access to this course
    if (req.user?.role !== 'admin' && 
        req.user?.role !== 'faculty' && 
        course.instructorId.toString() !== req.user?._id.toString()) {
      // For students, check if they're enrolled in the course
      // This would require enrollment check
    }

    const quizzes = await Quiz.find({ courseId: req.params.courseId })
      .populate('createdBy', 'firstName lastName email')
      .populate('courseId', 'title description')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: quizzes.length,
      data: quizzes
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single quiz
// @route   GET /api/quizzes/:id
// @access  Private
export const getQuizById = async (req: AuthRequest, res: Response) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate('createdBy', 'firstName lastName email')
      .populate('courseId', 'title description');

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Check if user has access to this quiz
    if (req.user?.role !== 'admin' && req.user?.role !== 'faculty') {
      // For students, check if they're enrolled in the course
      // This would require enrollment check
    }

    res.status(200).json({
      success: true,
      data: quiz
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new quiz
// @route   POST /api/quizzes
// @access  Private - Admin/Faculty
export const createQuiz = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, courseId, questions, maxPoints, duration } = req.body;

    // Check if course exists and user has permission to create quiz for it
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (req.user?.role !== 'admin' && course.instructorId.toString() !== req.user?._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to create quiz for this course' });
    }

    const quiz = await Quiz.create({
      title,
      description,
      courseId,
      createdBy: req.user?._id,
      questions,
      maxPoints,
      duration
    });

    res.status(201).json({
      success: true,
      data: quiz
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update quiz
// @route   PUT /api/quizzes/:id
// @access  Private - Admin/Faculty
export const updateQuiz = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, questions, maxPoints, duration, isActive } = req.body;

    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Check if user has permission to update this quiz
    if (req.user?.role !== 'admin' && quiz.createdBy.toString() !== req.user?._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this quiz' });
    }

    const updatedQuiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      { title, description, questions, maxPoints, duration, isActive },
      { new: true, runValidators: true }
    )
      .populate('createdBy', 'firstName lastName email')
      .populate('courseId', 'title description');

    res.status(200).json({
      success: true,
      data: updatedQuiz
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete quiz
// @route   DELETE /api/quizzes/:id
// @access  Private - Admin/Faculty
export const deleteQuiz = async (req: AuthRequest, res: Response) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Check if user has permission to delete this quiz
    if (req.user?.role !== 'admin' && quiz.createdBy.toString() !== req.user?._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this quiz' });
    }

    await Quiz.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Quiz removed'
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};