"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const courseController_1 = require("../controllers/courseController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Validation middleware
const validateCourseCreation = [
    (0, express_validator_1.body)('title').trim().isLength({ min: 5 }).withMessage('Title must be at least 5 characters'),
    (0, express_validator_1.body)('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
    (0, express_validator_1.body)('category').trim().notEmpty().withMessage('Category is required'),
    (0, express_validator_1.body)('instructorId').isMongoId().withMessage('Valid instructor ID is required')
];
const validateCourseUpdate = [
    (0, express_validator_1.body)('title').optional().trim().isLength({ min: 5 }).withMessage('Title must be at least 5 characters'),
    (0, express_validator_1.body)('description').optional().trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
    (0, express_validator_1.body)('category').optional().trim().notEmpty().withMessage('Category is required'),
    (0, express_validator_1.body)('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
];
router.route('/')
    .get(courseController_1.getAllCourses)
    .post(auth_1.authenticateToken, (0, auth_1.authorizeRoles)('admin', 'faculty'), validateCourseCreation, courseController_1.createCourse);
router.route('/my-courses')
    .get(auth_1.authenticateToken, courseController_1.getCoursesByInstructor);
router.route('/:id')
    .get(courseController_1.getCourseById)
    .put(auth_1.authenticateToken, (0, auth_1.authorizeRoles)('admin', 'faculty'), validateCourseUpdate, courseController_1.updateCourse)
    .delete(auth_1.authenticateToken, (0, auth_1.authorizeRoles)('admin', 'faculty'), courseController_1.deleteCourse);
exports.default = router;
//# sourceMappingURL=course.js.map