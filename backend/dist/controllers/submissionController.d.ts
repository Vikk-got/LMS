import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
export declare const submitAssignment: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getSubmissionsByAssignment: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getMySubmissions: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getSubmissionById: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const gradeSubmission: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=submissionController.d.ts.map