"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const assignmentController_1 = require("../controllers/assignmentController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Validation middleware
const validateAssignmentCreation = [
    (0, express_validator_1.body)('title').trim().isLength({ min: 5 }).withMessage('Title must be at least 5 characters'),
    (0, express_validator_1.body)('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
    (0, express_validator_1.body)('courseId').isMongoId().withMessage('Valid course ID is required'),
    (0, express_validator_1.body)('dueDate').isISO8601().withMessage('Valid due date is required'),
    (0, express_validator_1.body)('maxPoints').isNumeric().withMessage('Max points must be a number')
];
const validateAssignmentUpdate = [
    (0, express_validator_1.body)('title').optional().trim().isLength({ min: 5 }).withMessage('Title must be at least 5 characters'),
    (0, express_validator_1.body)('description').optional().trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
    (0, express_validator_1.body)('dueDate').optional().isISO8601().withMessage('Valid due date is required'),
    (0, express_validator_1.body)('maxPoints').optional().isNumeric().withMessage('Max points must be a number'),
    (0, express_validator_1.body)('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
];
router.route('/')
    .get(auth_1.authenticateToken, assignmentController_1.getAllAssignments)
    .post(auth_1.authenticateToken, (0, auth_1.authorizeRoles)('admin', 'faculty'), validateAssignmentCreation, assignmentController_1.createAssignment);
router.route('/course/:courseId')
    .get(auth_1.authenticateToken, assignmentController_1.getAssignmentsByCourse);
router.route('/:id')
    .get(auth_1.authenticateToken, assignmentController_1.getAssignmentById)
    .put(auth_1.authenticateToken, (0, auth_1.authorizeRoles)('admin', 'faculty'), validateAssignmentUpdate, assignmentController_1.updateAssignment)
    .delete(auth_1.authenticateToken, (0, auth_1.authorizeRoles)('admin', 'faculty'), assignmentController_1.deleteAssignment);
exports.default = router;
//# sourceMappingURL=assignment.js.map