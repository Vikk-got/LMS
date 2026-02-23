import mongoose, { Document } from 'mongoose';
import { IUser } from './User';
import { ICourse } from './Course';
export interface IQuiz extends Document {
    title: string;
    description?: string;
    courseId: mongoose.Types.ObjectId | ICourse;
    createdBy: mongoose.Types.ObjectId | IUser;
    questions: IQuestion[];
    maxPoints: number;
    duration: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface IQuestion {
    question: string;
    options: string[];
    correctAnswer: string;
}
declare const _default: mongoose.Model<IQuiz, {}, {}, {}, mongoose.Document<unknown, {}, IQuiz> & IQuiz & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=Quiz.d.ts.map