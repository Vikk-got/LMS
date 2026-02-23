"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("./config/database"));
const errorHandler_1 = require("./middleware/errorHandler");
// Import routes
const auth_1 = __importDefault(require("./routes/auth"));
const user_1 = __importDefault(require("./routes/user"));
const course_1 = __importDefault(require("./routes/course"));
const enrollment_1 = __importDefault(require("./routes/enrollment"));
const assignment_1 = __importDefault(require("./routes/assignment"));
const submission_1 = __importDefault(require("./routes/submission"));
const attendance_1 = __importDefault(require("./routes/attendance"));
const quiz_1 = __importDefault(require("./routes/quiz"));
const result_1 = __importDefault(require("./routes/result"));
const admin_1 = __importDefault(require("./routes/admin"));
const certificate_1 = __importDefault(require("./routes/certificate"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Connect to database
(0, database_1.default)();
// Security middlewares
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);
// Body parsing middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// Compression middleware
app.use((0, compression_1.default)());
// API routes
app.use('/api/auth', auth_1.default);
app.use('/api/users', user_1.default);
app.use('/api/courses', course_1.default);
app.use('/api/enrollments', enrollment_1.default);
app.use('/api/assignments', assignment_1.default);
app.use('/api/submissions', submission_1.default);
app.use('/api/attendance', attendance_1.default);
app.use('/api/quizzes', quiz_1.default);
app.use('/api/results', result_1.default);
app.use('/api/admin', admin_1.default);
app.use('/api/certificates', certificate_1.default);
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
});
// Error handling middleware
app.use(errorHandler_1.errorHandler);
// Handle 404
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
exports.default = server;
//# sourceMappingURL=server.js.map