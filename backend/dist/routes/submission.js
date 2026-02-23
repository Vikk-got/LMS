"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const submissionController_1 = require("../controllers/submissionController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Validation middleware
const validateSubmission = [
    (0, express_validator_1.body)('assignmentId').isMongoId().withMessage('Valid assignment ID is required'),
];
const validateGrading = [
    (0, express_validator_1.body)('grade').isFloat({ min: 0, max: 100 }).withMessage('Grade must be between 0 and 100'),
    (0, express_validator_1.body)('feedback').optional().trim(),
];
router.route('/')
    .post(auth_1.authenticateToken, validateSubmission, submissionController_1.submitAssignment)
    .get(auth_1.authenticateToken, (0, auth_1.authorizeRoles)('admin', 'faculty'), submissionController_1.getSubmissionsByAssignment);
router.route('/my-submissions')
    .get(auth_1.authenticateToken, submissionController_1.getMySubmissions);
router.route('/:id')
    .get(auth_1.authenticateToken, submissionController_1.getSubmissionById)
    .put(auth_1.authenticateToken, (0, auth_1.authorizeRoles)('admin', 'faculty'), validateGrading, submissionController_1.gradeSubmission);
exports.default = router;
//# sourceMappingURL=submission.js.map