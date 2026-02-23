import mongoose, { Document, Schema } from 'mongoose';
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

const submissionSchema: Schema<ISubmission> = new Schema(
  {
    assignmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Assignment',
      required: [true, 'Please add assignment'],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please add user'],
    },
    content: {
      type: String,
    },
    filePath: {
      type: String,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    grade: {
      type: Number,
      min: 0,
      max: 100,
    },
    feedback: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ISubmission>('Submission', submissionSchema);