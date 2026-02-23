"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const attendanceController_1 = require("../controllers/attendanceController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Validation middleware
const validateAttendance = [
    (0, express_validator_1.body)('courseId').isMongoId().withMessage('Valid course ID is required'),
    (0, express_validator_1.body)('date').isISO8601().withMessage('Valid date is required'),
    (0, express_validator_1.body)('attendanceRecords').isArray().withMessage('Attendance records must be an array'),
    (0, express_validator_1.body)('attendanceRecords.*.studentId').isMongoId().withMessage('Valid student ID is required'),
    (0, express_validator_1.body)('attendanceRecords.*.present').isBoolean().withMessage('Present must be a boolean'),
];
router.route('/')
    .post(auth_1.authenticateToken, (0, auth_1.authorizeRoles)('admin', 'faculty'), validateAttendance, attendanceController_1.markAttendance)
    .get(auth_1.authenticateToken, (0, auth_1.authorizeRoles)('admin', 'faculty'), attendanceController_1.getAttendanceByCourse);
router.route('/course/:courseId')
    .get(auth_1.authenticateToken, (0, auth_1.authorizeRoles)('admin', 'faculty'), attendanceController_1.getAttendanceByCourse);
router.route('/student/:studentId')
    .get(auth_1.authenticateToken, attendanceController_1.getAttendanceByStudent);
router.route('/date/:date')
    .get(auth_1.authenticateToken, attendanceController_1.getAttendanceByDate);
exports.default = router;
//# sourceMappingURL=attendance.js.map