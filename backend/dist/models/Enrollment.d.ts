import mongoose, { Document } from 'mongoose';
import { IUser } from './User';
import { ICourse } from './Course';
export interface IEnrollment extends Document {
    userId: mongoose.Types.ObjectId | IUser;
    courseId: mongoose.Types.ObjectId | ICourse;
    enrolledAt: Date;
    completedAt?: Date;
    progress: number;
    grade?: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IEnrollment, {}, {}, {}, mongoose.Document<unknown, {}, IEnrollment> & IEnrollment & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=Enrollment.d.ts.map