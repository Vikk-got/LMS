"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAttendanceByDate = exports.getAttendanceByStudent = exports.getAttendanceByCourse = exports.markAttendance = void 0;
const Attendance_1 = __importDefault(require("../models/Attendance"));
const Course_1 = __importDefault(require("../models/Course"));
// @desc    Mark attendance for students in a course
// @route   POST /api/attendance
// @access  Private - Admin/Faculty
const markAttendance = async (req, res) => {
    try {
        const { courseId, date, attendanceRecords } = req.body;
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        // Check if course exists and user has permission
        const course = await Course_1.default.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        if (req.user?.role !== 'admin' && course.instructorId.toString() !== req.user?._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to mark attendance for this course' });
        }
        // Process each attendance record
        const attendancePromises = attendanceRecords.map(async (record) => {
            // Check if attendance already exists for this student on this date
            let attendance = await Attendance_1.default.findOne({
                userId: record.studentId,
                courseId,
                date: new Date(date).toISOString().split('T')[0] // Compare dates only
            });
            if (attendance) {
                // Update existing attendance
                attendance.present = record.present;
                await attendance.save();
            }
            else {
                // Create new attendance record
                attendance = await Attendance_1.default.create({
                    userId: record.studentId,
                    courseId,
                    date,
                    present: record.present
                });
            }
            return attendance;
        });
        const attendanceRecordsCreated = await Promise.all(attendancePromises);
        res.status(201).json({
            success: true,
            data: attendanceRecordsCreated
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.markAttendance = markAttendance;
// @desc    Get attendance by course
// @route   GET /api/attendance/course/:courseId
// @access  Private - Admin/Faculty
const getAttendanceByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        // Check if course exists and user has permission
        const course = await Course_1.default.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        if (req.user?.role !== 'admin' && course.instructorId.toString() !== req.user?._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view attendance for this course' });
        }
        const attendance = await Attendance_1.default.find({ courseId })
            .populate('userId', 'firstName lastName email')
            .populate('courseId', 'title')
            .sort({ date: -1, createdAt: -1 });
        res.status(200).json({
            success: true,
            count: attendance.length,
            data: attendance
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAttendanceByCourse = getAttendanceByCourse;
// @desc    Get attendance by student
// @route   GET /api/attendance/student/:studentId
// @access  Private - Admin/Faculty
const getAttendanceByStudent = async (req, res) => {
    try {
        const { studentId } = req.params;
        // Check if user has permission to view this student's attendance
        if (req.user?.role !== 'admin' && req.user?._id.toString() !== studentId) {
            return res.status(403).json({ message: 'Not authorized to view attendance for this student' });
        }
        const attendance = await Attendance_1.default.find({ userId: studentId })
            .populate('userId', 'firstName lastName email')
            .populate('courseId', 'title')
            .sort({ date: -1, createdAt: -1 });
        res.status(200).json({
            success: true,
            count: attendance.length,
            data: attendance
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAttendanceByStudent = getAttendanceByStudent;
// @desc    Get attendance by date
// @route   GET /api/attendance/date/:date
// @access  Private - Admin/Faculty
const getAttendanceByDate = async (req, res) => {
    try {
        const { date } = req.params;
        // Parse the date
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({ message: 'Invalid date format' });
        }
        // Format date to match the stored date (without time)
        const startDate = new Date(parsedDate.setHours(0, 0, 0, 0));
        const endDate = new Date(parsedDate.setHours(23, 59, 59, 999));
        const attendance = await Attendance_1.default.find({
            date: {
                $gte: startDate,
                $lte: endDate
            }
        })
            .populate('userId', 'firstName lastName email')
            .populate('courseId', 'title')
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: attendance.length,
            data: attendance
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAttendanceByDate = getAttendanceByDate;
//# sourceMappingURL=attendanceController.js.map