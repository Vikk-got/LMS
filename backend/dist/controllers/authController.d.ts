import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
interface LoginRequestBody {
    email: string;
    password: string;
}
interface RegisterRequestBody {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
}
export declare const register: (req: Request<{}, {}, RegisterRequestBody>, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const login: (req: Request<{}, {}, LoginRequestBody>, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const logout: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getProfile: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const refreshToken: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export {};
//# sourceMappingURL=authController.d.ts.map