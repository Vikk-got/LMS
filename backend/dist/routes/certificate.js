"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const certificateController_1 = require("../controllers/certificateController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.route('/generate/:enrollmentId')
    .get(auth_1.authenticateToken, certificateController_1.generateCertificate);
exports.default = router;
//# sourceMappingURL=certificate.js.map