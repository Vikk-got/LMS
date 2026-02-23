import mongoose, { Document } from 'mongoose';
import { IUser } from './User';
import { ICourse } from './Course';
export interface IAttendance extends Document {
    userId: mongoose.Types.ObjectId | IUser;
    courseId: mongoose.Types.ObjectId | ICourse;
    date: Date;
    present: boolean;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IAttendance, {}, {}, {}, mongoose.Document<unknown, {}, IAttendance> & IAttendance & {
    _id: mongoose.Types.ObjectId;
}, any>;
export default _default;
//# sourceMappingURL=Attendance.d.ts.map