# Learning Management System (LMS) - Complete System Design Documentation

## 1. Project Overview

### 1.1 Purpose
The Learning Management System (LMS) is a comprehensive web-based platform designed to facilitate online learning, course management, and educational administration. The system enables administrators, faculty members, and students to interact in a structured digital learning environment.

### 1.2 Objectives
- Provide role-based access to different user types (Admin, Faculty, Student)
- Enable efficient course management and content delivery
- Facilitate student enrollment and progress tracking
- Implement secure authentication and authorization mechanisms
- Ensure scalability and maintainability of the system

### 1.3 Technology Stack
- **Frontend**: React.js with TypeScript
- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Multer for handling file uploads
- **Validation**: Express-validator for input validation
- **Security**: Helmet, rate limiting, CORS, bcrypt for password hashing

## 2. System Architecture

### 2.1 High-Level Architecture
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend       │    │    Database     │
│   (React)       │◄──►│   (Node/Express) │◄──►│   (MongoDB)     │
│                 │    │                  │    │                 │
│ - Components    │    │ - Controllers    │    │ - Collections   │
│ - State Props   │    │ - Routes         │    │ - Documents     │
│ - API Calls     │    │ - Middleware     │    │ - Schemas       │
└─────────────────┘    │ - Services       │    └─────────────────┘
                       │ - Models         │
                       └──────────────────┘
```

### 2.2 Project Structure
```
LMS/
├── backend/
│   ├── src/
│   │   ├── config/           # Configuration files
│   │   ├── controllers/      # Business logic
│   │   ├── middleware/       # Authentication & validation
│   │   ├── models/          # Database schemas
│   │   ├── routes/          # API route definitions
│   │   ├── services/        # Business services
│   │   ├── utils/           # Utility functions
│   │   ├── seed/            # Data seeding scripts
│   │   └── server.ts        # Main server file
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API service functions
│   │   ├── types/          # TypeScript type definitions
│   │   ├── utils/          # Utility functions
│   │   ├── assets/         # Static assets
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── package.json
│   └── tsconfig.json
└── PROJECT_DOCUMENTATION.md
```

## 3. Database Schema Design

### 3.1 User Schema
```typescript
interface User {
  _id: ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'admin' | 'faculty' | 'student';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### 3.2 Course Schema
```typescript
interface Course {
  _id: ObjectId;
  title: string;
  description: string;
  instructorId: ObjectId; // Reference to User
  category: string;
  thumbnail: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### 3.3 Enrollment Schema
```typescript
interface Enrollment {
  _id: ObjectId;
  userId: ObjectId; // Reference to User
  courseId: ObjectId; // Reference to Course
  enrolledAt: Date;
  completedAt?: Date;
  progress: number; // Percentage
  grade?: number;
}
```

### 3.4 Attendance Schema
```typescript
interface Attendance {
  _id: ObjectId;
  userId: ObjectId; // Reference to Student
  courseId: ObjectId; // Reference to Course
  date: Date;
  present: boolean;
}
```

### 3.5 Assignment Schema
```typescript
interface Assignment {
  _id: ObjectId;
  title: string;
  description: string;
  courseId: ObjectId; // Reference to Course
  dueDate: Date;
  maxPoints: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### 3.6 Submission Schema
```typescript
interface Submission {
  _id: ObjectId;
  assignmentId: ObjectId; // Reference to Assignment
  userId: ObjectId; // Reference to Student
  content: string;
  filePath?: string; // File path for uploaded submissions
  submittedAt: Date;
  grade?: number;
  feedback?: string;
}
```

### 3.7 Quiz Schema
```typescript
interface Quiz {
  _id: ObjectId;
  title: string;
  courseId: ObjectId; // Reference to Course
  questions: [
    {
      question: string;
      options: [string];
      correctAnswer: string;
    }
  ];
  maxPoints: number;
  duration: number; // in minutes
  isActive: boolean;
  createdAt: Date;
}
```

### 3.8 Result Schema
```typescript
interface Result {
  _id: ObjectId;
  quizId: ObjectId; // Reference to Quiz
  userId: ObjectId; // Reference to Student
  answers: [
    {
      questionIndex: number;
      selectedAnswer: string;
    }
  ];
  score: number;
  percentage: number;
  completedAt: Date;
}
```

## 4. API Endpoints

### 4.1 Authentication Endpoints
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | User login | Public |
| POST | `/api/auth/logout` | User logout | Private |
| GET | `/api/auth/profile` | Get user profile | Private |

### 4.2 User Management Endpoints (Admin Only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get specific user |
| POST | `/api/users` | Create new user |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |

### 4.3 Course Management Endpoints
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/courses` | Get all courses | Authenticated |
| GET | `/api/courses/:id` | Get specific course | Authenticated |
| POST | `/api/courses` | Create new course | Faculty/Admin |
| PUT | `/api/courses/:id` | Update course | Faculty/Admin |
| DELETE | `/api/courses/:id` | Delete course | Faculty/Admin |

### 4.4 Enrollment Endpoints
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/enrollments` | Enroll in course | Student |
| GET | `/api/enrollments/my-courses` | Get student's enrolled courses | Student |
| GET | `/api/enrollments/course/:courseId` | Get students enrolled in course | Faculty |

### 4.5 Assignment Endpoints
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/assignments` | Get all assignments | Faculty/Admin |
| GET | `/api/assignments/course/:courseId` | Get assignments for course | Authenticated |
| POST | `/api/assignments` | Create assignment | Faculty/Admin |
| PUT | `/api/assignments/:id` | Update assignment | Faculty/Admin |

### 4.6 Submission Endpoints
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/submissions` | Submit assignment | Student |
| GET | `/api/submissions/assignment/:assignmentId` | Get submissions for assignment | Faculty |
| PUT | `/api/submissions/:id/grade` | Grade submission | Faculty |

### 4.7 Attendance Endpoints
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/attendance/mark` | Mark attendance | Faculty |
| GET | `/api/attendance/course/:courseId` | Get attendance for course | Faculty |
| GET | `/api/attendance/student/:studentId` | Get student attendance | Faculty/Admin |

### 4.8 Quiz Endpoints
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/quizzes/course/:courseId` | Get quizzes for course | Authenticated |
| POST | `/api/quizzes` | Create quiz | Faculty/Admin |
| PUT | `/api/quizzes/:id` | Update quiz | Faculty/Admin |

### 4.9 Result Endpoints
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/results` | Submit quiz answers | Student |
| GET | `/api/results/user/:userId` | Get user's results | User/Faculty |
| GET | `/api/results/quiz/:quizId` | Get results for quiz | Faculty |

## 5. Role-Based Access Control (RBAC)

### 5.1 Role Definitions
- **Admin**: System administrator with full access to all features
- **Faculty**: Instructor with access to course creation, content management, and student grading
- **Student**: Learner with access to enroll in courses, submit assignments, and view grades

### 5.2 Access Matrix
| Feature | Admin | Faculty | Student |
|---------|-------|---------|---------|
| View Dashboard | ✓ | ✓ | ✓ |
| Manage Users | ✓ | ✗ | ✗ |
| Create Courses | ✓ | ✓ | ✗ |
| Edit Courses | ✓ | ✓ | ✗ |
| Delete Courses | ✓ | ✓ | ✗ |
| Enroll in Courses | ✓ | ✓ | ✓ |
| Upload Content | ✓ | ✓ | ✗ |
| Create Assignments | ✓ | ✓ | ✗ |
| Submit Assignments | ✓ | ✓ | ✓ |
| Grade Students | ✓ | ✓ | ✗ |
| View Reports | ✓ | ✓ | ✓ |
| Mark Attendance | ✓ | ✓ | ✗ |
| Take Quizzes | ✓ | ✓ | ✓ |
| Download Certificates | ✓ | ✓ | ✓ |

## 6. Security Implementation

### 6.1 Authentication
- JWT-based authentication with refresh tokens
- Password hashing using bcrypt
- Secure password policies
- Session management

### 6.2 Authorization
- Role-based middleware
- Route protection
- Permission validation

### 6.3 Security Measures
- Rate limiting to prevent brute force attacks
- Input validation and sanitization
- CORS configuration
- Helmet for HTTP header security
- SQL injection prevention (using Mongoose)

## 7. Frontend Component Structure

### 7.1 Layout Components
- Header with navigation
- Sidebar for dashboard navigation
- Footer
- Loading spinner
- Modal dialogs

### 7.2 Authentication Components
- Login form
- Registration form
- Forgot password
- Profile management

### 7.3 Dashboard Components
- Admin Dashboard
- Faculty Dashboard
- Student Dashboard
- Statistics cards
- Recent activity feed

### 7.4 Course Components
- Course listing
- Course detail view
- Course enrollment
- Content management
- Progress tracking

### 7.5 Assignment Components
- Assignment listing
- Assignment submission
- Grading interface
- Feedback system

### 7.6 Quiz Components
- Quiz taking interface
- Question display
- Timer
- Results display

### 7.7 Reporting Components
- Student progress reports
- Course analytics
- Grade book
- Attendance reports

## 8. Development Process Flow

### 8.1 Overall Project Flow
```
Start
  ↓
Requirement Analysis
  ↓
System Design
  ↓
Development Phase
  ↓
Testing Phase
  ↓
Deployment
  ↓
System Live
  ↓
End
```

### 8.2 Development Modules

#### 8.2.1 Backend Development
1. Set up project structure
2. Configure database connection
3. Implement authentication system
4. Create data models
5. Develop API endpoints
6. Implement role-based access control
7. Add file upload functionality
8. Implement validation and error handling

#### 8.2.2 Frontend Development
1. Set up React project with TypeScript
2. Create component structure
3. Implement routing system
4. Develop authentication flows
5. Create role-based dashboards
6. Implement form handling
7. Add state management (props-based)
8. Create responsive UI components

#### 8.2.3 Integration
1. Connect frontend to backend APIs
2. Test all functionality
3. Optimize performance
4. Conduct security review
5. Prepare for deployment

## 9. Testing Strategy

### 9.1 Unit Testing
- Test individual functions and components
- Validate business logic
- Test utility functions

### 9.2 Integration Testing
- Test API endpoints
- Validate database interactions
- Test authentication flow

### 9.3 End-to-End Testing
- Test complete user workflows
- Validate role-based access
- Test file upload functionality

## 10. Deployment Strategy

### 10.1 Server Requirements
- Node.js runtime environment
- MongoDB database
- SSL certificate for HTTPS
- Reverse proxy (nginx)

### 10.2 Deployment Steps
1. Set up production server
2. Install dependencies
3. Configure environment variables
4. Set up reverse proxy
5. Configure SSL certificate
6. Start application services
7. Monitor application health

### 10.3 Environment Variables
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/lms
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRE=30d
FRONTEND_URL=http://localhost:3000
MAX_FILE_SIZE=5242880  # 5MB
UPLOAD_DIR=./uploads
```

## 11. Performance Optimization

### 11.1 Backend Optimization
- Database indexing
- Query optimization
- Caching strategies
- Efficient API design
- File upload optimization

### 11.2 Frontend Optimization
- Component lazy loading
- Code splitting
- Image optimization
- Bundle size reduction
- Efficient state management

## 12. Maintenance and Monitoring

### 12.1 Logging
- Application logs
- Error tracking
- User activity logs
- Performance metrics

### 12.2 Backup Strategy
- Regular database backups
- File backup procedures
- Version control management

This completes the system design documentation for the Learning Management System.