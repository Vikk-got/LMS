import mongoose, { Document, Schema } from 'mongoose';
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

const assignmentSchema: Schema<IAssignment> = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add description'],
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Please add course'],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please add creator'],
    },
    dueDate: {
      type: Date,
      required: [true, 'Please add due date'],
    },
    maxPoints: {
      type: Number,
      required: [true, 'Please add maximum points'],
      min: 0,
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

export default mongoose.model<IAssignment>('Assignment', assignmentSchema);