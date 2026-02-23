"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteQuiz = exports.updateQuiz = exports.createQuiz = exports.getQuizById = exports.getQuizzesByCourse = exports.getAllQuizzes = void 0;
const Quiz_1 = __importDefault(require("../models/Quiz"));
const Course_1 = __importDefault(require("../models/Course"));
// @desc    Get all quizzes
// @route   GET /api/quizzes
// @access  Private
const getAllQuizzes = async (req, res) => {
    try {
        // Only admins and faculty can see all quizzes
        let quizzesQuery = {};
        if (req.user?.role === 'student') {
            // Students can only see quizzes from their enrolled courses
            // For now, we'll return all active quizzes
            quizzesQuery = { isActive: true };
        }
        const quizzes = await Quiz_1.default.find(quizzesQuery)
            .populate('createdBy', 'firstName lastName email')
            .populate('courseId', 'title description')
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: quizzes.length,
            data: quizzes
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAllQuizzes = getAllQuizzes;
// @desc    Get quizzes by course
// @route   GET /api/quizzes/course/:courseId
// @access  Private
const getQuizzesByCourse = async (req, res) => {
    try {
        const course = await Course_1.default.findById(req.params.courseId);
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
        const quizzes = await Quiz_1.default.find({ courseId: req.params.courseId })
            .populate('createdBy', 'firstName lastName email')
            .populate('courseId', 'title description')
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: quizzes.length,
            data: quizzes
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getQuizzesByCourse = getQuizzesByCourse;
// @desc    Get single quiz
// @route   GET /api/quizzes/:id
// @access  Private
const getQuizById = async (req, res) => {
    try {
        const quiz = await Quiz_1.default.findById(req.params.id)
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
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getQuizById = getQuizById;
// @desc    Create new quiz
// @route   POST /api/quizzes
// @access  Private - Admin/Faculty
const createQuiz = async (req, res) => {
    try {
        const { title, description, courseId, questions, maxPoints, duration } = req.body;
        // Check if course exists and user has permission to create quiz for it
        const course = await Course_1.default.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        if (req.user?.role !== 'admin' && course.instructorId.toString() !== req.user?._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to create quiz for this course' });
        }
        const quiz = await Quiz_1.default.create({
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
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createQuiz = createQuiz;
// @desc    Update quiz
// @route   PUT /api/quizzes/:id
// @access  Private - Admin/Faculty
const updateQuiz = async (req, res) => {
    try {
        const { title, description, questions, maxPoints, duration, isActive } = req.body;
        const quiz = await Quiz_1.default.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        // Check if user has permission to update this quiz
        if (req.user?.role !== 'admin' && quiz.createdBy.toString() !== req.user?._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this quiz' });
        }
        const updatedQuiz = await Quiz_1.default.findByIdAndUpdate(req.params.id, { title, description, questions, maxPoints, duration, isActive }, { new: true, runValidators: true })
            .populate('createdBy', 'firstName lastName email')
            .populate('courseId', 'title description');
        res.status(200).json({
            success: true,
            data: updatedQuiz
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateQuiz = updateQuiz;
// @desc    Delete quiz
// @route   DELETE /api/quizzes/:id
// @access  Private - Admin/Faculty
const deleteQuiz = async (req, res) => {
    try {
        const quiz = await Quiz_1.default.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        // Check if user has permission to delete this quiz
        if (req.user?.role !== 'admin' && quiz.createdBy.toString() !== req.user?._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this quiz' });
        }
        await Quiz_1.default.deleteOne({ _id: req.params.id });
        res.status(200).json({
            success: true,
            message: 'Quiz removed'
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteQuiz = deleteQuiz;
//# sourceMappingURL=quizController.js.map