import mongoose, { Document } from 'mongoose';
import { IUser } from './User';
import { IQuiz } from './Quiz';
export interface IResult extends Document {
    quizId: mongoose.Types.ObjectId | IQuiz;
    userId: mongoose.Types.ObjectId | IUser;
    answers: IAnswer[];
    score: number;
    percentage: number;
    completedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
export interface IAnswer {
    questionIndex: number;
    selectedAnswer: string;
}
declare const _default: mongoose.Model<IResult, {}, {}, {}, mongoose.Document<unknown, {}, IResult> & IResult & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=Result.d.ts.map