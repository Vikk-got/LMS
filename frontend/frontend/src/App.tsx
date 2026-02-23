import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Assignments from './pages/Assignments';
import Quizzes from './pages/Quizzes';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import Enrollments from './pages/Enrollments';
import Attendance from './pages/Attendance';
import Submissions from './pages/Submissions';
import Results from './pages/Results';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/courses" 
              element={
                <PrivateRoute>
                  <Courses />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/assignments" 
              element={
                <PrivateRoute>
                  <Assignments />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/quizzes" 
              element={
                <PrivateRoute>
                  <Quizzes />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/enrollments" 
              element={
                <PrivateRoute>
                  <Enrollments />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/attendance" 
              element={
                <PrivateRoute>
                  <Attendance />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/submissions" 
              element={
                <PrivateRoute>
                  <Submissions />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/results" 
              element={
                <PrivateRoute>
                  <Results />
                </PrivateRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
