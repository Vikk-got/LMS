"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Validation middleware
const validateUserCreation = [
    (0, express_validator_1.body)('firstName').trim().isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),
    (0, express_validator_1.body)('lastName').trim().isLength({ min: 2 }).withMessage('Last name must be at least 2 characters'),
    (0, express_validator_1.body)('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    (0, express_validator_1.body)('role').isIn(['admin', 'faculty', 'student']).withMessage('Invalid role')
];
const validateUserUpdate = [
    (0, express_validator_1.body)('firstName').optional().trim().isLength({ min: 2 }).withMessage('First name must be at least 2 characters'),
    (0, express_validator_1.body)('lastName').optional().trim().isLength({ min: 2 }).withMessage('Last name must be at least 2 characters'),
    (0, express_validator_1.body)('email').optional().isEmail().normalizeEmail().withMessage('Please provide a valid email'),
    (0, express_validator_1.body)('role').optional().isIn(['admin', 'faculty', 'student']).withMessage('Invalid role'),
    (0, express_validator_1.body)('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
];
router.route('/')
    .get(auth_1.authenticateToken, (0, auth_1.authorizeRoles)('admin'), userController_1.getAllUsers)
    .post(auth_1.authenticateToken, (0, auth_1.authorizeRoles)('admin'), validateUserCreation, userController_1.createUser);
router.route('/:id')
    .get(auth_1.authenticateToken, userController_1.getUserById)
    .put(auth_1.authenticateToken, (0, auth_1.authorizeRoles)('admin'), validateUserUpdate, userController_1.updateUser)
    .delete(auth_1.authenticateToken, (0, auth_1.authorizeRoles)('admin'), userController_1.deleteUser);
router.put('/change-role/:id', auth_1.authenticateToken, (0, auth_1.authorizeRoles)('admin'), userController_1.changeUserRole);
exports.default = router;
//# sourceMappingURL=user.js.map