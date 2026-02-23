"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAssignment = exports.updateAssignment = exports.createAssignment = exports.getAssignmentById = exports.getAssignmentsByCourse = exports.getAllAssignments = void 0;
const Assignment_1 = __importDefault(require("../models/Assignment"));
const Course_1 = __importDefault(require("../models/Course"));
// @desc    Get all assignments
// @route   GET /api/assignments
// @access  Private
const getAllAssignments = async (req, res) => {
    try {
        // Only admins and faculty can see all assignments
        let assignmentsQuery = {};
        if (req.user?.role === 'student') {
            // Students can only see assignments from their enrolled courses
            // This would require getting enrolled courses first
            // For now, we'll just return all active assignments
            assignmentsQuery = { isActive: true };
        }
        const assignments = await Assignment_1.default.find(assignmentsQuery)
            .populate('createdBy', 'firstName lastName email')
            .populate('courseId', 'title description')
            .sort({ dueDate: 1, createdAt: -1 });
        res.status(200).json({
            success: true,
            count: assignments.length,
            data: assignments
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAllAssignments = getAllAssignments;
// @desc    Get assignments by course
// @route   GET /api/assignments/course/:courseId
// @access  Private
const getAssignmentsByCourse = async (req, res) => {
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
        const assignments = await Assignment_1.default.find({ courseId: req.params.courseId })
            .populate('createdBy', 'firstName lastName email')
            .populate('courseId', 'title description')
            .sort({ dueDate: 1, createdAt: -1 });
        res.status(200).json({
            success: true,
            count: assignments.length,
            data: assignments
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAssignmentsByCourse = getAssignmentsByCourse;
// @desc    Get single assignment
// @route   GET /api/assignments/:id
// @access  Private
const getAssignmentById = async (req, res) => {
    try {
        const assignment = await Assignment_1.default.findById(req.params.id)
            .populate('createdBy', 'firstName lastName email')
            .populate('courseId', 'title description');
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }
        // Check if user has access to this assignment
        if (req.user?.role !== 'admin' && req.user?.role !== 'faculty') {
            // For students, check if they're enrolled in the course
            // This would require enrollment check
        }
        res.status(200).json({
            success: true,
            data: assignment
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAssignmentById = getAssignmentById;
// @desc    Create new assignment
// @route   POST /api/assignments
// @access  Private - Admin/Faculty
const createAssignment = async (req, res) => {
    try {
        const { title, description, courseId, dueDate, maxPoints } = req.body;
        // Check if course exists and user has permission to create assignment for it
        const course = await Course_1.default.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        if (req.user?.role !== 'admin' && course.instructorId.toString() !== req.user?._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to create assignment for this course' });
        }
        const assignment = await Assignment_1.default.create({
            title,
            description,
            courseId,
            createdBy: req.user?._id,
            dueDate,
            maxPoints
        });
        res.status(201).json({
            success: true,
            data: assignment
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createAssignment = createAssignment;
// @desc    Update assignment
// @route   PUT /api/assignments/:id
// @access  Private - Admin/Faculty
const updateAssignment = async (req, res) => {
    try {
        const { title, description, dueDate, maxPoints, isActive } = req.body;
        const assignment = await Assignment_1.default.findById(req.params.id);
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }
        // Check if user has permission to update this assignment
        if (req.user?.role !== 'admin' && assignment.createdBy.toString() !== req.user?._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this assignment' });
        }
        const updatedAssignment = await Assignment_1.default.findByIdAndUpdate(req.params.id, { title, description, dueDate, maxPoints, isActive }, { new: true, runValidators: true })
            .populate('createdBy', 'firstName lastName email')
            .populate('courseId', 'title description');
        res.status(200).json({
            success: true,
            data: updatedAssignment
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateAssignment = updateAssignment;
// @desc    Delete assignment
// @route   DELETE /api/assignments/:id
// @access  Private - Admin/Faculty
const deleteAssignment = async (req, res) => {
    try {
        const assignment = await Assignment_1.default.findById(req.params.id);
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }
        // Check if user has permission to delete this assignment
        if (req.user?.role !== 'admin' && assignment.createdBy.toString() !== req.user?._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this assignment' });
        }
        await Assignment_1.default.deleteOne({ _id: req.params.id });
        res.status(200).json({
            success: true,
            message: 'Assignment removed'
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteAssignment = deleteAssignment;
//# sourceMappingURL=assignmentController.js.map