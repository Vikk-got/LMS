import jwt from 'jsonwebtoken';
export declare const generateToken: (userId: string) => string;
export declare const verifyToken: (token: string) => jwt.VerifyErrors | jwt.JwtPayload | string;
//# sourceMappingURL=jwt.d.ts.map