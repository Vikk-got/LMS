import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const enrollInCourse: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getMyEnrollments: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getEnrollmentsByCourse: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getEnrollmentsByUser: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateEnrollmentProgress: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const unenrollFromCourse: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=enrollmentController.d.ts.map