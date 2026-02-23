import mongoose, { Document, Schema } from 'mongoose';
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

const attendanceSchema: Schema<IAttendance> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please add user'],
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Please add course'],
    },
    date: {
      type: Date,
      required: [true, 'Please add date'],
    },
    present: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IAttendance>('Attendance', attendanceSchema);