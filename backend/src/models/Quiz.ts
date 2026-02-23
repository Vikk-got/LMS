import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';
import { ICourse } from './Course';

export interface IQuiz extends Document {
  title: string;
  description?: string;
  courseId: mongoose.Types.ObjectId | ICourse;
  createdBy: mongoose.Types.ObjectId | IUser;
  questions: IQuestion[];
  maxPoints: number;
  duration: number; // in minutes
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

const quizSchema: Schema<IQuiz> = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add title'],
      trim: true,
    },
    description: {
      type: String,
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
    questions: [
      {
        question: {
          type: String,
          required: true,
        },
        options: [
          {
            type: String,
            required: true,
          },
        ],
        correctAnswer: {
          type: String,
          required: true,
        },
      },
    ],
    maxPoints: {
      type: Number,
      required: [true, 'Please add maximum points'],
      min: 0,
    },
    duration: {
      type: Number,
      required: [true, 'Please add duration in minutes'],
      min: 1,
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

export default mongoose.model<IQuiz>('Quiz', quizSchema);