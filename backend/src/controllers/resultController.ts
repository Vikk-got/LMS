import { Request, Response } from 'express';
import Result from '../models/Result';
import Quiz from '../models/Quiz';
import { AuthRequest } from '../middleware/auth';

interface ResultRequestBody {
  quizId: string;
  answers: {
    questionIndex: number;
    selectedAnswer: string;
  }[];
}

// @desc    Submit quiz answers
// @route   POST /api/results
// @access  Private - Student
export const submitQuiz = async (req: AuthRequest, res: Response) => {
  try {
    const { quizId, answers } = req.body;

    // Check if quiz exists
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Check if quiz is active
    if (!quiz.isActive) {
      return res.status(400).json({ message: 'Quiz is not active' });
    }

    // Check if user has already taken this quiz
    const existingResult = await Result.findOne({
      quizId,
      userId: req.user?._id
    });

    if (existingResult) {
      return res.status(400).json({ message: 'Quiz already taken' });
    }

    // Calculate score
    let score = 0;
    const totalQuestions = quiz.questions.length;

    for (let i = 0; i < answers.length; i++) {
      const userAnswer = answers[i];
      const correctAnswer = quiz.questions[userAnswer.questionIndex].correctAnswer;

      if (userAnswer.selectedAnswer === correctAnswer) {
        score++;
      }
    }

    // Calculate percentage
    const percentage = (score / totalQuestions) * 100;

    const result = await Result.create({
      quizId,
      userId: req.user?._id,
      answers,
      score,
      percentage
    });

    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get results by quiz
// @route   GET /api/results
// @access  Private - Admin/Faculty
export const getResultsByQuiz = async (req: AuthRequest, res: Response) => {
  try {
    const { quizId } = req.query;

    if (!quizId) {
      return res.status(400).json({ message: 'Quiz ID is required' });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Check if user has permission to view results for this quiz
    if (req.user?.role !== 'admin' && quiz.createdBy.toString() !== req.user?._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view results for this quiz' });
    }

    const results = await Result.find({ quizId })
      .populate('userId', 'firstName lastName email')
      .populate('quizId', 'title description createdBy')
      .sort({ completedAt: -1 });

    res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get results by user
// @route   GET /api/results/user/:userId
// @access  Private
export const getResultsByUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.params.userId;

    // Check if user has permission to view results for this user
    if (req.user?.role !== 'admin' && 
        req.user?.role !== 'faculty' && 
        req.user?._id.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to view results for this user' });
    }

    const results = await Result.find({ userId })
      .populate('userId', 'firstName lastName email')
      .populate('quizId', 'title description createdBy')
      .sort({ completedAt: -1 });

    res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get result by ID
// @route   GET /api/results/:id
// @access  Private
export const getResultById = async (req: AuthRequest, res: Response) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate('userId', 'firstName lastName email')
      .populate('quizId', 'title description createdBy');

    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }

    // Check if user has permission to view this result
    if (req.user?.role !== 'admin' && 
        result.userId.toString() !== req.user?._id.toString() && 
        (result as any).quizId.createdBy.toString() !== req.user?._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this result' });
    }

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};