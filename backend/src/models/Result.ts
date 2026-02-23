import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';
import { IQuiz } from './Quiz';

export interface IResult extends Document {
  quizId: mongoose.Types.ObjectId | IQuiz;
  userId: mongoose.Types.ObjectId | IUser;
  answers: IAnswer[];
  score: number;
  percentage: number;
  completedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAnswer {
  questionIndex: number;
  selectedAnswer: string;
}

const resultSchema: Schema<IResult> = new Schema(
  {
    quizId: {
      type: Schema.Types.ObjectId,
      ref: 'Quiz',
      required: [true, 'Please add quiz'],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please add user'],
    },
    answers: [
      {
        questionIndex: {
          type: Number,
          required: true,
        },
        selectedAnswer: {
          type: String,
          required: true,
        },
      },
    ],
    score: {
      type: Number,
      required: [true, 'Please add score'],
      min: 0,
    },
    percentage: {
      type: Number,
      required: [true, 'Please add percentage'],
      min: 0,
      max: 100,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IResult>('Result', resultSchema);