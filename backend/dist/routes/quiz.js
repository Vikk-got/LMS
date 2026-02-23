"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const quizController_1 = require("../controllers/quizController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Validation middleware
const validateQuizCreation = [
    (0, express_validator_1.body)('title').trim().isLength({ min: 5 }).withMessage('Title must be at least 5 characters'),
    (0, express_validator_1.body)('courseId').isMongoId().withMessage('Valid course ID is required'),
    (0, express_validator_1.body)('questions').isArray({ min: 1 }).withMessage('At least one question is required'),
    (0, express_validator_1.body)('questions.*.question').trim().notEmpty().withMessage('Question cannot be empty'),
    (0, express_validator_1.body)('questions.*.options').isArray({ min: 2 }).withMessage('At least two options are required'),
    (0, express_validator_1.body)('questions.*.correctAnswer').trim().notEmpty().withMessage('Correct answer cannot be empty'),
    (0, express_validator_1.body)('maxPoints').isNumeric().withMessage('Max points must be a number'),
    (0, express_validator_1.body)('duration').isNumeric().withMessage('Duration must be a number')
];
const validateQuizUpdate = [
    (0, express_validator_1.body)('title').optional().trim().isLength({ min: 5 }).withMessage('Title must be at least 5 characters'),
    (0, express_validator_1.body)('questions').optional().isArray({ min: 1 }).withMessage('At least one question is required'),
    (0, express_validator_1.body)('questions.*.question').optional().trim().notEmpty().withMessage('Question cannot be empty'),
    (0, express_validator_1.body)('questions.*.options').optional().isArray({ min: 2 }).withMessage('At least two options are required'),
    (0, express_validator_1.body)('questions.*.correctAnswer').optional().trim().notEmpty().withMessage('Correct answer cannot be empty'),
    (0, express_validator_1.body)('maxPoints').optional().isNumeric().withMessage('Max points must be a number'),
    (0, express_validator_1.body)('duration').optional().isNumeric().withMessage('Duration must be a number'),
    (0, express_validator_1.body)('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
];
router.route('/')
    .get(auth_1.authenticateToken, quizController_1.getAllQuizzes)
    .post(auth_1.authenticateToken, (0, auth_1.authorizeRoles)('admin', 'faculty'), validateQuizCreation, quizController_1.createQuiz);
router.route('/course/:courseId')
    .get(auth_1.authenticateToken, quizController_1.getQuizzesByCourse);
router.route('/:id')
    .get(auth_1.authenticateToken, quizController_1.getQuizById)
    .put(auth_1.authenticateToken, (0, auth_1.authorizeRoles)('admin', 'faculty'), validateQuizUpdate, quizController_1.updateQuiz)
    .delete(auth_1.authenticateToken, (0, auth_1.authorizeRoles)('admin', 'faculty'), quizController_1.deleteQuiz);
exports.default = router;
//# sourceMappingURL=quiz.js.map