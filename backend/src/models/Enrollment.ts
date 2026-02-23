import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';
import { ICourse } from './Course';

export interface IEnrollment extends Document {
  userId: mongoose.Types.ObjectId | IUser;
  courseId: mongoose.Types.ObjectId | ICourse;
  enrolledAt: Date;
  completedAt?: Date;
  progress: number; // Percentage
  grade?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const enrollmentSchema: Schema<IEnrollment> = new Schema(
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
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    grade: {
      type: Number,
      min: 0,
      max: 100,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IEnrollment>('Enrollment', enrollmentSchema);