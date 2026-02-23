export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'faculty' | 'student';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  instructorId: string;
  instructorName?: string;
  studentsEnrolled?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Assignment {
  _id: string;
  title: string;
  description: string;
  courseId: string;
  courseTitle?: string;
  dueDate: string;
  maxPoints: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Quiz {
  _id: string;
  title: string;
  courseId: string;
  courseTitle?: string;
  questions: Question[];
  maxPoints: number;
  duration: number; // in minutes
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface Submission {
  _id: string;
  assignmentId: string;
  userId: string;
  content: string;
  submittedAt: string;
  grade?: number;
  feedback?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Result {
  _id: string;
  quizId: string;
  userId: string;
  answers: Answer[];
  score: number;
  totalPoints: number;
  completedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Answer {
  questionIndex: number;
  selectedAnswer: string;
}

export interface Enrollment {
  _id: string;
  userId: string;
  courseId: string;
  courseTitle?: string;
  progress: number;
  enrolledAt: string;
  completed: boolean;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Attendance {
  _id: string;
  courseId: string;
  date: string;
  attendanceRecords: AttendanceRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceRecord {
  studentId: string;
  present: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}