import mongoose, { Document } from 'mongoose';
import { IUser } from './User';
export interface ICourse extends Document {
    title: string;
    description: string;
    instructorId: mongoose.Types.ObjectId | IUser;
    category: string;
    thumbnail?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface IMaterial {
    title: string;
    type: 'video' | 'document' | 'image' | 'link';
    url: string;
    description?: string;
    uploadedAt: Date;
}
export interface IAssignment {
    title: string;
    description: string;
    dueDate: Date;
    maxMarks: number;
    submitted: boolean;
    submittedBy?: mongoose.Types.ObjectId | IUser;
    submittedAt?: Date;
    marks?: number;
}
export interface IQuiz {
    title: string;
    questions: IQuestion[];
    duration: number;
    passingMarks: number;
    maxMarks: number;
}
export interface IQuestion {
    question: string;
    options: string[];
    correctAnswer: number;
}
export interface ISchedule {
    days: string[];
    startTime: string;
    endTime: string;
}
declare const _default: mongoose.Model<ICourse, {}, {}, {}, mongoose.Document<unknown, {}, ICourse> & ICourse & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=Course.d.ts.map