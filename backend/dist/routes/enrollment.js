"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const enrollmentController_1 = require("../controllers/enrollmentController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Validation middleware
const validateEnrollment = [
    (0, express_validator_1.body)('courseId').isMongoId().withMessage('Valid course ID is required'),
];
router.route('/')
    .post(auth_1.authenticateToken, validateEnrollment, enrollmentController_1.enrollInCourse);
router.route('/my-enrollments')
    .get(auth_1.authenticateToken, enrollmentController_1.getMyEnrollments);
router.route('/course/:courseId')
    .get(auth_1.authenticateToken, (0, auth_1.authorizeRoles)('admin', 'faculty'), enrollmentController_1.getEnrollmentsByCourse);
router.route('/user/:userId')
    .get(auth_1.authenticateToken, (0, auth_1.authorizeRoles)('admin', 'faculty'), enrollmentController_1.getEnrollmentsByUser);
router.route('/:id')
    .put(auth_1.authenticateToken, enrollmentController_1.updateEnrollmentProgress)
    .delete(auth_1.authenticateToken, enrollmentController_1.unenrollFromCourse);
exports.default = router;
//# sourceMappingURL=enrollment.js.map