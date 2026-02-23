import mongoose, { Document } from 'mongoose';
import { IUser } from './User';
import { IAssignment } from './Assignment';
export interface ISubmission extends Document {
    assignmentId: mongoose.Types.ObjectId | IAssignment;
    userId: mongoose.Types.ObjectId | IUser;
    content?: string;
    filePath?: string;
    submittedAt: Date;
    grade?: number;
    feedback?: string;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<ISubmission, {}, {}, {}, mongoose.Document<unknown, {}, ISubmission> & ISubmission & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=Submission.d.ts.map