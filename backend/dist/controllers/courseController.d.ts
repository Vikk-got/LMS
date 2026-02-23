import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const getAllCourses: (req: Request, res: Response) => Promise<void>;
export declare const getCourseById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const createCourse: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateCourse: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteCourse: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getCoursesByInstructor: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getCoursesByCategory: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=courseController.d.ts.map