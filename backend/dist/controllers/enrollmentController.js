"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unenrollFromCourse = exports.updateEnrollmentProgress = exports.getEnrollmentsByUser = exports.getEnrollmentsByCourse = exports.getMyEnrollments = exports.enrollInCourse = void 0;
const Enrollment_1 = __importDefault(require("../models/Enrollment"));
const Course_1 = __importDefault(require("../models/Course"));
// @desc    Enroll in course
// @route   POST /api/enrollments
// @access  Private
const enrollInCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        // Check if course exists
        const course = await Course_1.default.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        // Check if already enrolled
        const existingEnrollment = await Enrollment_1.default.findOne({
            userId: req.user?._id,
            courseId
        });
        if (existingEnrollment) {
            return res.status(400).json({ message: 'Already enrolled in this course' });
        }
        // Create enrollment
        const enrollment = await Enrollment_1.default.create({
            userId: req.user?._id,
            courseId
        });
        res.status(201).json({
            success: true,
            data: enrollment
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.enrollInCourse = enrollInCourse;
// @desc    Get my enrollments
// @route   GET /api/enrollments/my-enrollments
// @access  Private
const getMyEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment_1.default.find({ userId: req.user?._id })
            .populate('courseId', 'title description category thumbnail')
            .populate('userId', 'firstName lastName email')
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: enrollments.length,
            data: enrollments
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getMyEnrollments = getMyEnrollments;
// @desc    Get enrollments by course
// @route   GET /api/enrollments/course/:courseId
// @access  Private - Admin/Faculty
const getEnrollmentsByCourse = async (req, res) => {
    try {
        if (req.user?.role !== 'admin' && req.user?.role !== 'faculty') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const enrollments = await Enrollment_1.default.find({ courseId: req.params.courseId })
            .populate('userId', 'firstName lastName email')
            .populate('courseId', 'title description')
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: enrollments.length,
            data: enrollments
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getEnrollmentsByCourse = getEnrollmentsByCourse;
// @desc    Get enrollments by user
// @route   GET /api/enrollments/user/:userId
// @access  Private - Admin/Faculty
const getEnrollmentsByUser = async (req, res) => {
    try {
        if (req.user?.role !== 'admin' && req.user?.role !== 'faculty') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const enrollments = await Enrollment_1.default.find({ userId: req.params.userId })
            .populate('courseId', 'title description category thumbnail')
            .populate('userId', 'firstName lastName email')
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: enrollments.length,
            data: enrollments
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getEnrollmentsByUser = getEnrollmentsByUser;
// @desc    Update enrollment progress
// @route   PUT /api/enrollments/:id
// @access  Private
const updateEnrollmentProgress = async (req, res) => {
    try {
        const { progress, grade } = req.body;
        const enrollment = await Enrollment_1.default.findById(req.params.id);
        if (!enrollment) {
            return res.status(404).json({ message: 'Enrollment not found' });
        }
        // Check if user is authorized to update this enrollment
        if (req.user?.role !== 'admin' && req.user?._id.toString() !== enrollment.userId.toString()) {
            return res.status(403).json({ message: 'Access denied' });
        }
        // For faculty, check if they're teaching the course
        if (req.user?.role === 'faculty') {
            const course = await Course_1.default.findById(enrollment.courseId);
            if (course?.instructorId.toString() !== req.user?._id.toString()) {
                return res.status(403).json({ message: 'Access denied' });
            }
        }
        const updatedEnrollment = await Enrollment_1.default.findByIdAndUpdate(req.params.id, { progress, grade }, { new: true, runValidators: true })
            .populate('userId', 'firstName lastName email')
            .populate('courseId', 'title description');
        res.status(200).json({
            success: true,
            data: updatedEnrollment
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateEnrollmentProgress = updateEnrollmentProgress;
// @desc    Unenroll from course
// @route   DELETE /api/enrollments/:id
// @access  Private
const unenrollFromCourse = async (req, res) => {
    try {
        const enrollment = await Enrollment_1.default.findById(req.params.id);
        if (!enrollment) {
            return res.status(404).json({ message: 'Enrollment not found' });
        }
        // Only the enrolled user or admin can unenroll
        if (req.user?.role !== 'admin' && req.user?._id.toString() !== enrollment.userId.toString()) {
            return res.status(403).json({ message: 'Access denied' });
        }
        await Enrollment_1.default.deleteOne({ _id: req.params.id });
        res.status(200).json({
            success: true,
            message: 'Successfully unenrolled from course'
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.unenrollFromCourse = unenrollFromCourse;
//# sourceMappingURL=enrollmentController.js.map