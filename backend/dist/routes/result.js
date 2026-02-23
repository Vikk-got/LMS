"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const resultController_1 = require("../controllers/resultController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Validation middleware
const validateQuizSubmission = [
    (0, express_validator_1.body)('quizId').isMongoId().withMessage('Valid quiz ID is required'),
    (0, express_validator_1.body)('answers').isArray().withMessage('Answers must be an array'),
    (0, express_validator_1.body)('answers.*.questionIndex').isInt().withMessage('Question index must be an integer'),
    (0, express_validator_1.body)('answers.*.selectedAnswer').trim().notEmpty().withMessage('Selected answer cannot be empty'),
];
router.route('/')
    .post(auth_1.authenticateToken, validateQuizSubmission, resultController_1.submitQuiz)
    .get(auth_1.authenticateToken, (0, auth_1.authorizeRoles)('admin', 'faculty'), resultController_1.getResultsByQuiz);
router.route('/user/:userId')
    .get(auth_1.authenticateToken, resultController_1.getResultsByUser);
router.route('/:id')
    .get(auth_1.authenticateToken, resultController_1.getResultById);
exports.default = router;
//# sourceMappingURL=result.js.map