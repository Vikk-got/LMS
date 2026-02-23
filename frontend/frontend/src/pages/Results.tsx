import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { Result, Quiz, ApiResponse } from '../types';

const Results: React.FC = () => {
  const { user } = useAuth();
  const [results, setResults] = useState<Result[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      if (user?.role === 'student') {
        // Get student's results
        const response = await api.get<ApiResponse<Result[]>>('/results/user/' + user._id);
        setResults(response.data.data || []);
        
        // Get quizzes
        const quizzesResponse = await api.get<ApiResponse<Quiz[]>>('/quizzes');
        setQuizzes(quizzesResponse.data.data || []);
      } else {
        // For admin/faculty, might get different results depending on permissions
        // This would need adjustment based on backend implementation
        const response = await api.get<ApiResponse<Result[]>>('/results');
        setResults(response.data.data || []);
        
        const quizzesResponse = await api.get<ApiResponse<Quiz[]>>('/quizzes');
        setQuizzes(quizzesResponse.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
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
          {user?.role === 'student' ? 'My Quiz Results' : 'Quiz Results'}
        </h1>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left">Quiz</th>
              <th className="py-3 px-4 text-left">Date Completed</th>
              <th className="py-3 px-4 text-left">Score</th>
              <th className="py-3 px-4 text-left">Percentage</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {results.map(result => {
              const quiz = quizzes.find(q => q._id === result.quizId);
              const percentage = result.totalPoints > 0 
                ? Math.round((result.score / result.totalPoints) * 100) 
                : 0;
              
              return (
                <tr key={result._id}>
                  <td className="py-3 px-4">
                    {quiz ? quiz.title : 'Unknown Quiz'}
                  </td>
                  <td className="py-3 px-4">
                    {new Date(result.completedAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`font-medium ${percentage >= 60 ? 'text-green-600' : 'text-red-600'}`}>
                      {result.score}/{result.totalPoints}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`font-medium ${percentage >= 60 ? 'text-green-600' : 'text-red-600'}`}>
                      {percentage}%
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block text-xs px-2 py-1 rounded ${
                      percentage >= 60
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {percentage >= 60 ? 'Passed' : 'Failed'}
                    </span>
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

        {results.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {user?.role === 'student' 
                ? 'You have not completed any quizzes yet.' 
                : 'No quiz results found.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;