import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { Enrollment, Course, ApiResponse } from '../types';

const Enrollments: React.FC = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrollmentModalOpen, setEnrollmentModalOpen] = useState(false);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      if (user?.role === 'student') {
        // Get student's enrollments
        const response = await api.get<ApiResponse<Enrollment[]>>('/enrollments/my-enrollments');
        setEnrollments(response.data.data || []);
        
        // Get available courses for enrollment
        const coursesResponse = await api.get<ApiResponse<Course[]>>('/courses');
        const enrolledCourseIds = response.data.data?.map(e => e.courseId) || [];
        setAvailableCourses(
          (coursesResponse.data.data || []).filter(course => 
            !enrolledCourseIds.includes(course._id) && course.isActive
          )
        );
      } else {
        // For admin/faculty, get all enrollments
        // This might require different permissions based on the backend
        const response = await api.get<ApiResponse<Enrollment[]>>('/enrollments');
        setEnrollments(response.data.data || []);
        
        const coursesResponse = await api.get<ApiResponse<Course[]>>('/courses');
        setCourses(coursesResponse.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId: string) => {
    try {
      await api.post('/enrollments', { courseId });
      setEnrollmentModalOpen(false);
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error enrolling in course:', error);
    }
  };

  const handleUnenroll = async (enrollmentId: string) => {
    if (window.confirm('Are you sure you want to unenroll from this course?')) {
      try {
        await api.delete(`/enrollments/${enrollmentId}`);
        fetchData(); // Refresh data
      } catch (error) {
        console.error('Error unenrolling from course:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          {user?.role === 'student' ? 'My Enrollments' : 'All Enrollments'}
        </h1>
        {user?.role === 'student' && (
          <button
            onClick={() => setEnrollmentModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition"
          >
            Enroll in Course
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left">Course</th>
              {user?.role !== 'student' && <th className="py-3 px-4 text-left">Student</th>}
              <th className="py-3 px-4 text-left">Enrolled Date</th>
              <th className="py-3 px-4 text-left">Progress</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {enrollments.map(enrollment => {
              const course = courses.find(c => c._id === enrollment.courseId) || 
                             availableCourses.find(c => c._id === enrollment.courseId);
              return (
                <tr key={enrollment._id}>
                  <td className="py-3 px-4">
                    {course ? course.title : enrollment.courseId}
                  </td>
                  {user?.role !== 'student' && (
                    <td className="py-3 px-4">
                      {/* Would need to fetch user info to show student name */}
                      Student ID: {enrollment.userId}
                    </td>
                  )}
                  <td className="py-3 px-4">
                    {new Date(enrollment.enrolledAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${enrollment.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm">{enrollment.progress}%</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block text-xs px-2 py-1 rounded ${
                      enrollment.completed 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {enrollment.completed ? 'Completed' : 'In Progress'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {user?.role === 'student' && (
                      <button
                        onClick={() => handleUnenroll(enrollment._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Unenroll
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {enrollments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {user?.role === 'student' 
                ? 'You are not enrolled in any courses yet.' 
                : 'No enrollments found.'}
            </p>
          </div>
        )}
      </div>

      {/* Enrollment Modal */}
      {enrollmentModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Available Courses</h3>
                <button 
                  onClick={() => setEnrollmentModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>
              
              {availableCourses.length > 0 ? (
                <ul className="space-y-3">
                  {availableCourses.map(course => (
                    <li key={course._id} className="flex justify-between items-center border-b pb-3">
                      <div>
                        <h4 className="font-medium">{course.title}</h4>
                        <p className="text-sm text-gray-600 truncate">{course.description}</p>
                      </div>
                      <button
                        onClick={() => handleEnroll(course._id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm"
                      >
                        Enroll
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No courses available for enrollment.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Enrollments;