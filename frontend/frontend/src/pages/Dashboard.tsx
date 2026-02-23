import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { User, Course, Assignment, Quiz, ApiResponse } from '../types';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    courses: 0,
    assignments: 0,
    quizzes: 0,
    students: 0
  });
  const [recentItems, setRecentItems] = useState<{
    courses: Course[];
    assignments: Assignment[];
    quizzes: Quiz[];
  }>({
    courses: [],
    assignments: [],
    quizzes: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (user?.role === 'admin') {
          // Fetch admin stats
          const [coursesRes, assignmentsRes, quizzesRes, usersRes] = await Promise.all([
            api.get<ApiResponse<Course[]>>('/courses'),
            api.get<ApiResponse<Assignment[]>>('/assignments'),
            api.get<ApiResponse<Quiz[]>>('/quizzes'),
            api.get<ApiResponse<User[]>>('/users')
          ]);
          
          setStats({
            courses: coursesRes.data.data?.length || 0,
            assignments: assignmentsRes.data.data?.length || 0,
            quizzes: quizzesRes.data.data?.length || 0,
            students: usersRes.data.data?.filter((u: User) => u.role === 'student').length || 0
          });
        } else if (user?.role === 'faculty') {
          // Fetch faculty stats
          const [coursesRes, assignmentsRes, quizzesRes] = await Promise.all([
            api.get<ApiResponse<Course[]>>('/courses/my-courses'),
            api.get<ApiResponse<Assignment[]>>('/assignments'),
            api.get<ApiResponse<Quiz[]>>('/quizzes')
          ]);
                  
          setStats({
            courses: coursesRes.data.data?.length || 0,
            assignments: assignmentsRes.data.data?.length || 0,
            quizzes: quizzesRes.data.data?.length || 0,
            students: 0 // Will calculate based on enrolled students
          });
        } else if (user?.role === 'student') {
          // Fetch student stats
          const [enrollmentsRes, assignmentsRes, quizzesRes] = await Promise.all([
            api.get<ApiResponse<any>>('/enrollments/my-enrollments'),
            api.get<ApiResponse<Assignment[]>>('/assignments'),
            api.get<ApiResponse<Quiz[]>>('/quizzes')
          ]);
                  
          setStats({
            courses: enrollmentsRes.data.data?.length || 0,
            assignments: assignmentsRes.data.data?.length || 0,
            quizzes: quizzesRes.data.data?.length || 0,
            students: 0
          });
        }

        // Fetch recent items regardless of role
        const [coursesRes, assignmentsRes, quizzesRes] = await Promise.all([
          api.get<ApiResponse<Course[]>>('/courses'),
          api.get<ApiResponse<Assignment[]>>('/assignments'),
          api.get<ApiResponse<Quiz[]>>('/quizzes')
        ]);

        setRecentItems({
          courses: coursesRes.data.data?.slice(0, 5) || [],
          assignments: assignmentsRes.data.data?.slice(0, 5) || [],
          quizzes: quizzesRes.data.data?.slice(0, 5) || []
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Courses</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.courses}</p>
          <Link to="/courses" className="text-blue-500 hover:underline mt-2 inline-block">View All</Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Assignments</h3>
          <p className="text-3xl font-bold text-green-600">{stats.assignments}</p>
          <Link to={user.role !== 'student' ? "/assignments" : "/assignments"} className="text-blue-500 hover:underline mt-2 inline-block">View All</Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700">Quizzes</h3>
          <p className="text-3xl font-bold text-yellow-600">{stats.quizzes}</p>
          <Link to={user.role !== 'student' ? "/quizzes" : "/quizzes"} className="text-blue-500 hover:underline mt-2 inline-block">View All</Link>
        </div>
        
        {user.role === 'admin' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Students</h3>
            <p className="text-3xl font-bold text-purple-600">{stats.students}</p>
            <Link to="/users" className="text-blue-500 hover:underline mt-2 inline-block">View All</Link>
          </div>
        )}
      </div>

      {/* Recent Items */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Courses */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Courses</h3>
          {recentItems.courses.length > 0 ? (
            <ul className="space-y-3">
              {recentItems.courses.map(course => (
                <li key={course._id} className="border-b pb-2">
                  <Link to={`/courses/${course._id}`} className="text-blue-600 hover:underline">
                    {course.title}
                  </Link>
                  <p className="text-sm text-gray-600 truncate">{course.description}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No courses found</p>
          )}
        </div>

        {/* Recent Assignments */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Assignments</h3>
          {recentItems.assignments.length > 0 ? (
            <ul className="space-y-3">
              {recentItems.assignments.map(assignment => (
                <li key={assignment._id} className="border-b pb-2">
                  <Link to={`/assignments/${assignment._id}`} className="text-blue-600 hover:underline">
                    {assignment.title}
                  </Link>
                  <p className="text-sm text-gray-600">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No assignments found</p>
          )}
        </div>

        {/* Recent Quizzes */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Quizzes</h3>
          {recentItems.quizzes.length > 0 ? (
            <ul className="space-y-3">
              {recentItems.quizzes.map(quiz => (
                <li key={quiz._id} className="border-b pb-2">
                  <Link to={`/quizzes/${quiz._id}`} className="text-blue-600 hover:underline">
                    {quiz.title}
                  </Link>
                  <p className="text-sm text-gray-600">{quiz.questions.length} Questions</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No quizzes found</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link 
            to="/courses" 
            className="bg-blue-100 hover:bg-blue-200 text-blue-800 py-3 px-4 rounded-lg text-center transition"
          >
            Browse Courses
          </Link>
          {user.role !== 'student' && (
            <>
              <Link 
                to="/assignments" 
                className="bg-green-100 hover:bg-green-200 text-green-800 py-3 px-4 rounded-lg text-center transition"
              >
                Manage Assignments
              </Link>
              <Link 
                to="/quizzes" 
                className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 py-3 px-4 rounded-lg text-center transition"
              >
                Manage Quizzes
              </Link>
            </>
          )}
          <Link 
            to="/profile" 
            className="bg-purple-100 hover:bg-purple-200 text-purple-800 py-3 px-4 rounded-lg text-center transition"
          >
            My Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;