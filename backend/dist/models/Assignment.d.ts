import mongoose, { Document } from 'mongoose';
import { IUser } from './User';
import { ICourse } from './Course';
export interface IAssignment extends Document {
    title: string;
    description: string;
    courseId: mongoose.Types.ObjectId | ICourse;
    createdBy: mongoose.Types.ObjectId | IUser;
    dueDate: Date;
    maxPoints: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IAssignment, {}, {}, {}, mongoose.Document<unknown, {}, IAssignment> & IAssignment & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=Assignment.d.ts.map