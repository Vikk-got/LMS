"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCoursesByCategory = exports.getCoursesByInstructor = exports.deleteCourse = exports.updateCourse = exports.createCourse = exports.getCourseById = exports.getAllCourses = void 0;
const Course_1 = __importDefault(require("../models/Course"));
// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getAllCourses = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const courses = await Course_1.default.find()
            .populate('instructorId', 'firstName lastName email')
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip);
        const total = await Course_1.default.countDocuments();
        res.status(200).json({
            success: true,
            count: courses.length,
            page,
            totalPages: Math.ceil(total / limit),
            data: courses,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAllCourses = getAllCourses;
// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = async (req, res) => {
    try {
        const course = await Course_1.default.findById(req.params.id)
            .populate('instructorId', 'firstName lastName email');
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json({
            success: true,
            data: course,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getCourseById = getCourseById;
// @desc    Create new course
// @route   POST /api/courses
// @access  Private - Admin/Faculty
const createCourse = async (req, res) => {
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
        const course = await Course_1.default.create(courseData);
        res.status(201).json({
            success: true,
            data: course,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createCourse = createCourse;
// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private - Admin/Faculty
const updateCourse = async (req, res) => {
    try {
        const course = await Course_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
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
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateCourse = updateCourse;
// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private - Admin/Faculty
const deleteCourse = async (req, res) => {
    try {
        const course = await Course_1.default.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        // Check if user is the instructor or admin
        if (course.instructorId.toString() !== req.user?._id.toString() && req.user?.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this course' });
        }
        await Course_1.default.deleteOne({ _id: course._id });
        res.status(200).json({
            success: true,
            message: 'Course removed',
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteCourse = deleteCourse;
// @desc    Get courses by instructor
// @route   GET /api/courses/my-courses
// @access  Private
const getCoursesByInstructor = async (req, res) => {
    try {
        const courses = await Course_1.default.find({ instructorId: req.user?._id })
            .populate('instructorId', 'firstName lastName email')
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: courses.length,
            data: courses,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getCoursesByInstructor = getCoursesByInstructor;
// @desc    Get courses by category
// @route   GET /api/courses/category/:category
// @access  Public
const getCoursesByCategory = async (req, res) => {
    try {
        const courses = await Course_1.default.find({ category: req.params.category })
            .populate('instructorId', 'firstName lastName email')
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: courses.length,
            data: courses,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getCoursesByCategory = getCoursesByCategory;
//# sourceMappingURL=courseController.js.map