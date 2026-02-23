"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.route('/stats')
    .get(auth_1.authenticateToken, (0, auth_1.authorizeRoles)('admin'), userController_1.getAdminStats);
exports.default = router;
//# sourceMappingURL=admin.js.map