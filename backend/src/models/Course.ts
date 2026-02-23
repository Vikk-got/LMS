import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';

export interface ICourse extends Document {
  title: string;
  description: string;
  instructorId: mongoose.Types.ObjectId | IUser;
  category: string;
  thumbnail?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMaterial {
  title: string;
  type: 'video' | 'document' | 'image' | 'link';
  url: string;
  description?: string;
  uploadedAt: Date;
}

export interface IAssignment {
  title: string;
  description: string;
  dueDate: Date;
  maxMarks: number;
  submitted: boolean;
  submittedBy?: mongoose.Types.ObjectId | IUser;
  submittedAt?: Date;
  marks?: number;
}

export interface IQuiz {
  title: string;
  questions: IQuestion[];
  duration: number;
  passingMarks: number;
  maxMarks: number;
}

export interface IQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface ISchedule {
  days: string[];
  startTime: string;
  endTime: string;
}

const courseSchema: Schema<ICourse> = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add course title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add course description'],
    },
    instructorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please add instructor'],
    },
    category: {
      type: String,
      required: [true, 'Please add category'],
      trim: true,
    },
    thumbnail: {
      type: String,
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

export default mongoose.model<ICourse>('Course', courseSchema);
