"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsMiddleware = exports.helmetMiddleware = exports.rateLimiter = void 0;
const config_1 = require("../config/config");
const rateLimiter = (windowMs = 15 * 60 * 1000, max = 100) => {
    return (req, res, next) => {
        res.setHeader('X-RateLimit-Limit', max);
        res.setHeader('X-RateLimit-Remaining', max);
        next();
    };
};
exports.rateLimiter = rateLimiter;
const helmetMiddleware = (req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
};
exports.helmetMiddleware = helmetMiddleware;
const corsMiddleware = (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', config_1.config.corsOrigin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    next();
};
exports.corsMiddleware = corsMiddleware;
//# sourceMappingURL=security.js.map