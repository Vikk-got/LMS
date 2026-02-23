"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminStats = exports.changeUserRole = exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getAllUsers = void 0;
const User_1 = __importDefault(require("../models/User"));
const Course_1 = __importDefault(require("../models/Course"));
const Enrollment_1 = __importDefault(require("../models/Enrollment"));
// @desc    Get all users
// @route   GET /api/users
// @access  Private - Admin
const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const users = await User_1.default.find()
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip);
        const total = await User_1.default.countDocuments();
        res.status(200).json({
            success: true,
            count: users.length,
            page,
            totalPages: Math.ceil(total / limit),
            data: users,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAllUsers = getAllUsers;
// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Only admin can access any user, others can only access themselves
        if (req.user?.role !== 'admin' && req.user?._id.toString() !== req.params.id) {
            return res.status(403).json({ message: 'Access denied' });
        }
        res.status(200).json({
            success: true,
            data: user,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getUserById = getUserById;
// @desc    Create new user
// @route   POST /api/users
// @access  Private - Admin
const createUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, role, phone } = req.body;
        // Check if user already exists
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }
        const user = await User_1.default.create({
            firstName,
            lastName,
            email,
            password,
            role,
            phone
        });
        res.status(201).json({
            success: true,
            data: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                phone: user.phone,
                isActive: user.isActive,
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createUser = createUser;
// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private - Admin
const updateUser = async (req, res) => {
    try {
        const { firstName, lastName, email, role, phone, isActive } = req.body;
        const user = await User_1.default.findByIdAndUpdate(req.params.id, { firstName, lastName, email, role, phone, isActive }, {
            new: true,
            runValidators: true,
        }).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({
            success: true,
            data: user,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateUser = updateUser;
// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private - Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Prevent admin from deleting themselves
        if (req.user?._id.toString() === req.params.id) {
            return res.status(400).json({ message: 'You cannot delete yourself' });
        }
        await User_1.default.deleteOne({ _id: user._id });
        res.status(200).json({
            success: true,
            message: 'User removed',
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteUser = deleteUser;
// @desc    Change user role
// @route   PUT /api/users/change-role/:id
// @access  Private - Admin
const changeUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const user = await User_1.default.findByIdAndUpdate(req.params.id, { role }, {
            new: true,
            runValidators: true,
        }).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({
            success: true,
            data: user,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.changeUserRole = changeUserRole;
// @desc    Get admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private - Admin
const getAdminStats = async (req, res) => {
    try {
        if (req.user?.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }
        const totalUsers = await User_1.default.countDocuments();
        const totalCourses = await Course_1.default.countDocuments();
        const totalEnrollments = await Enrollment_1.default.countDocuments();
        const usersByRole = await User_1.default.aggregate([
            {
                $group: {
                    _id: '$role',
                    count: { $sum: 1 }
                }
            }
        ]);
        const coursesByCategory = await Course_1.default.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            }
        ]);
        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalCourses,
                totalEnrollments,
                usersByRole,
                coursesByCategory
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAdminStats = getAdminStats;
//# sourceMappingURL=userController.js.map