import { Request, Response, NextFunction } from 'express';
export declare const rateLimiter: (windowMs?: number, max?: number) => (req: Request, res: Response, next: NextFunction) => void;
export declare const helmetMiddleware: (req: Request, res: Response, next: NextFunction) => void;
export declare const corsMiddleware: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=security.d.ts.map