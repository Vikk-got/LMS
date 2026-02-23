import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { Submission, Assignment, ApiResponse } from '../types';

const Submissions: React.FC = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<string>('');
  const [submissionContent, setSubmissionContent] = useState('');

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      if (user?.role === 'student') {
        // Get student's submissions
        const response = await api.get<ApiResponse<Submission[]>>('/submissions/my-submissions');
        setSubmissions(response.data.data || []);
        
        // Get assignments for this student
        const assignmentsResponse = await api.get<ApiResponse<Assignment[]>>('/assignments');
        setAssignments(assignmentsResponse.data.data || []);
      } else {
        // Get all submissions for instructors/admins
        const response = await api.get<ApiResponse<Submission[]>>('/submissions');
        setSubmissions(response.data.data || []);
        
        // Get all assignments
        const assignmentsResponse = await api.get<ApiResponse<Assignment[]>>('/assignments');
        setAssignments(assignmentsResponse.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAssignment = async () => {
    if (!selectedAssignment || !submissionContent.trim()) {
      alert('Please select an assignment and enter content');
      return;
    }
    
    try {
      await api.post('/submissions', {
        assignmentId: selectedAssignment,
        content: submissionContent
      });
      setShowSubmitModal(false);
      setSubmissionContent('');
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error submitting assignment:', error);
    }
  };

  const handleGradeSubmission = async (submissionId: string, grade: number, feedback: string) => {
    try {
      await api.put(`/submissions/${submissionId}`, {
        grade,
        feedback
      });
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error grading submission:', error);
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
          {user?.role === 'student' ? 'My Submissions' : 'Manage Submissions'}
        </h1>
        {user?.role === 'student' && (
          <button
            onClick={() => setShowSubmitModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition"
          >
            Submit Assignment
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left">Assignment</th>
              <th className="py-3 px-4 text-left">Submitted Date</th>
              <th className="py-3 px-4 text-left">Grade</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {submissions.map(submission => {
              const assignment = assignments.find(a => a._id === submission.assignmentId);
              return (
                <tr key={submission._id}>
                  <td className="py-3 px-4">
                    {assignment ? assignment.title : 'Unknown Assignment'}
                  </td>
                  <td className="py-3 px-4">
                    {new Date(submission.submittedAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    {submission.grade !== undefined ? (
                      <span className={`font-medium ${submission.grade >= 60 ? 'text-green-600' : 'text-red-600'}`}>
                        {submission.grade}/100
                      </span>
                    ) : (
                      <span className="text-gray-500">Pending</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block text-xs px-2 py-1 rounded ${
                      submission.grade !== undefined
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {submission.grade !== undefined ? 'Graded' : 'Pending'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="text-blue-600 hover:text-blue-800 mr-3">
                      View
                    </button>
                    {user?.role !== 'student' && submission.grade === undefined && (
                      <button 
                        onClick={() => {
                          const grade = prompt('Enter grade (0-100):');
                          if (grade) {
                            handleGradeSubmission(submission._id, parseInt(grade), '');
                          }
                        }}
                        className="text-green-600 hover:text-green-800"
                      >
                        Grade
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {submissions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {user?.role === 'student' 
                ? 'You have not submitted any assignments yet.' 
                : 'No submissions found.'}
            </p>
          </div>
        )}
      </div>

      {/* Submit Assignment Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Submit Assignment</h3>
                <button 
                  onClick={() => setShowSubmitModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="assignment-select">
                  Select Assignment
                </label>
                <select
                  id="assignment-select"
                  value={selectedAssignment}
                  onChange={(e) => setSelectedAssignment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose an assignment</option>
                  {assignments
                    .filter(assignment => 
                      new Date(assignment.dueDate) > new Date() && 
                      !submissions.some(sub => sub.assignmentId === assignment._id)
                    )
                    .map(assignment => (
                      <option key={assignment._id} value={assignment._id}>
                        {assignment.title} (Due: {new Date(assignment.dueDate).toLocaleDateString()})
                      </option>
                    ))
                  }
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="submission-content">
                  Submission Content
                </label>
                <textarea
                  id="submission-content"
                  value={submissionContent}
                  onChange={(e) => setSubmissionContent(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={6}
                  placeholder="Enter your assignment content here..."
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowSubmitModal(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitAssignment}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition"
                >
                  Submit Assignment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Submissions;