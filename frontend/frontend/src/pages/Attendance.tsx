import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { Attendance, Course, ApiResponse } from '../types';

const AttendancePage: React.FC = () => {
  const { user } = useAuth();
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      if (user?.role === 'student') {
        // Get student's attendance records
        const response = await api.get<ApiResponse<Attendance[]>>('/attendance/student/' + user._id);
        setAttendances(response.data.data || []);
      } else if (user?.role === 'faculty') {
        // Get attendances for faculty's courses
        const coursesResponse = await api.get<ApiResponse<Course[]>>('/courses/my-courses');
        setCourses(coursesResponse.data.data || []);
        
        // If we have courses, get attendance for them
        if (coursesResponse.data.data && coursesResponse.data.data.length > 0) {
          const courseIds = coursesResponse.data.data.map(course => course._id);
          const attendancePromises = courseIds.map(id => 
            api.get<ApiResponse<Attendance[]>>(`/attendance/course/${id}`)
          );
          const attendanceResponses = await Promise.all(attendancePromises);
          const allAttendances = attendanceResponses.flatMap(res => res.data.data || []);
          setAttendances(allAttendances);
        }
      } else {
        // Admin gets all attendance records
        const response = await api.get<ApiResponse<Attendance[]>>('/attendance');
        setAttendances(response.data.data || []);
        
        const coursesResponse = await api.get<ApiResponse<Course[]>>('/courses');
        setCourses(coursesResponse.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = async () => {
    if (!selectedCourse || !selectedDate) {
      alert('Please select a course and date');
      return;
    }
    
    try {
      // This would require a more complex form to mark attendance for multiple students
      // For now, showing a basic implementation
      const attendanceData = {
        courseId: selectedCourse,
        date: selectedDate,
        attendanceRecords: [] // Would need to populate with student IDs and present status
      };
      
      await api.post('/attendance', attendanceData);
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error marking attendance:', error);
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
        <h1 className="text-3xl font-bold text-gray-800">Attendance</h1>
        {(user?.role === 'admin' || user?.role === 'faculty') && (
          <div className="flex space-x-4">
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Course</option>
              {courses.map(course => (
                <option key={course._id} value={course._id}>
                  {course.title}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleMarkAttendance}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition"
            >
              Mark Attendance
            </button>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left">Course</th>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-left">Total Students</th>
              <th className="py-3 px-4 text-left">Present</th>
              <th className="py-3 px-4 text-left">Absent</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {attendances.map(attendance => {
              const course = courses.find(c => c._id === attendance.courseId);
              const totalStudents = attendance.attendanceRecords.length;
              const presentCount = attendance.attendanceRecords.filter(record => record.present).length;
              const absentCount = totalStudents - presentCount;
              
              return (
                <tr key={attendance._id}>
                  <td className="py-3 px-4">
                    {course ? course.title : attendance.courseId}
                  </td>
                  <td className="py-3 px-4">
                    {new Date(attendance.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    {totalStudents}
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-green-600">{presentCount}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-red-600">{absentCount}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="text-blue-600 hover:text-blue-800">
                      View Details
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {attendances.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {user?.role === 'student' 
                ? 'No attendance records found.' 
                : 'No attendance records available.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendancePage;