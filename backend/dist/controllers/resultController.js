"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResultById = exports.getResultsByUser = exports.getResultsByQuiz = exports.submitQuiz = void 0;
const Result_1 = __importDefault(require("../models/Result"));
const Quiz_1 = __importDefault(require("../models/Quiz"));
// @desc    Submit quiz answers
// @route   POST /api/results
// @access  Private - Student
const submitQuiz = async (req, res) => {
    try {
        const { quizId, answers } = req.body;
        // Check if quiz exists
        const quiz = await Quiz_1.default.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        // Check if quiz is active
        if (!quiz.isActive) {
            return res.status(400).json({ message: 'Quiz is not active' });
        }
        // Check if user has already taken this quiz
        const existingResult = await Result_1.default.findOne({
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
        const result = await Result_1.default.create({
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
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.submitQuiz = submitQuiz;
// @desc    Get results by quiz
// @route   GET /api/results
// @access  Private - Admin/Faculty
const getResultsByQuiz = async (req, res) => {
    try {
        const { quizId } = req.query;
        if (!quizId) {
            return res.status(400).json({ message: 'Quiz ID is required' });
        }
        const quiz = await Quiz_1.default.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        // Check if user has permission to view results for this quiz
        if (req.user?.role !== 'admin' && quiz.createdBy.toString() !== req.user?._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view results for this quiz' });
        }
        const results = await Result_1.default.find({ quizId })
            .populate('userId', 'firstName lastName email')
            .populate('quizId', 'title description createdBy')
            .sort({ completedAt: -1 });
        res.status(200).json({
            success: true,
            count: results.length,
            data: results
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getResultsByQuiz = getResultsByQuiz;
// @desc    Get results by user
// @route   GET /api/results/user/:userId
// @access  Private
const getResultsByUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        // Check if user has permission to view results for this user
        if (req.user?.role !== 'admin' &&
            req.user?.role !== 'faculty' &&
            req.user?._id.toString() !== userId) {
            return res.status(403).json({ message: 'Not authorized to view results for this user' });
        }
        const results = await Result_1.default.find({ userId })
            .populate('userId', 'firstName lastName email')
            .populate('quizId', 'title description createdBy')
            .sort({ completedAt: -1 });
        res.status(200).json({
            success: true,
            count: results.length,
            data: results
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getResultsByUser = getResultsByUser;
// @desc    Get result by ID
// @route   GET /api/results/:id
// @access  Private
const getResultById = async (req, res) => {
    try {
        const result = await Result_1.default.findById(req.params.id)
            .populate('userId', 'firstName lastName email')
            .populate('quizId', 'title description createdBy');
        if (!result) {
            return res.status(404).json({ message: 'Result not found' });
        }
        // Check if user has permission to view this result
        if (req.user?.role !== 'admin' &&
            result.userId.toString() !== req.user?._id.toString() &&
            result.quizId.createdBy.toString() !== req.user?._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view this result' });
        }
        res.status(200).json({
            success: true,
            data: result
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getResultById = getResultById;
//# sourceMappingURL=resultController.js.map