import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { Quiz, Course, ApiResponse } from '../types';

const Quizzes: React.FC = () => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');
  const [formData, setFormData] = useState({
    title: '',
    courseId: '',
    duration: 30,
    maxPoints: 100,
    questions: [{ question: '', options: ['', '', '', ''], correctAnswer: '' }]
  });
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      // Fetch quizzes
      let response;
      if (user?.role === 'student') {
        // For students, get quizzes for their enrolled courses
        response = await api.get<ApiResponse<Quiz[]>>('/quizzes');
      } else {
        response = await api.get<ApiResponse<Quiz[]>>('/quizzes');
      }
      setQuizzes(response.data.data || []);

      // Fetch courses for the dropdown
      const coursesRes = await api.get<ApiResponse<Course[]>>('/courses');
      setCourses(coursesRes.data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingQuiz) {
        // Update existing quiz
        await api.put(`/quizzes/${editingQuiz._id}`, formData);
      } else {
        // Create new quiz
        await api.post('/quizzes', formData);
      }
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving quiz:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      courseId: '',
      duration: 30,
      maxPoints: 100,
      questions: [{ question: '', options: ['', '', '', ''], correctAnswer: '' }]
    });
    setEditingQuiz(null);
    setActiveTab('list');
  };

  const handleEdit = (quiz: Quiz) => {
    setEditingQuiz(quiz);
    setFormData({
      title: quiz.title,
      courseId: quiz.courseId,
      duration: quiz.duration,
      maxPoints: quiz.maxPoints,
      questions: [...quiz.questions]
    });
    setActiveTab('create');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        await api.delete(`/quizzes/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting quiz:', error);
      }
    }
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        { question: '', options: ['', '', '', ''], correctAnswer: '' }
      ]
    });
  };

  const updateQuestion = (index: number, field: string, value: string) => {
    const updatedQuestions = [...formData.questions];
    if (field.startsWith('options.')) {
      const optionIndex = parseInt(field.split('.')[1]);
      updatedQuestions[index].options[optionIndex] = value;
    } else {
      (updatedQuestions[index] as any)[field] = value;
    }
    setFormData({
      ...formData,
      questions: updatedQuestions
    });
  };

  const removeQuestion = (index: number) => {
    if (formData.questions.length > 1) {
      const updatedQuestions = [...formData.questions];
      updatedQuestions.splice(index, 1);
      setFormData({
        ...formData,
        questions: updatedQuestions
      });
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
        <h1 className="text-3xl font-bold text-gray-800">Quizzes</h1>
        {(user?.role !== 'student') && (
          <button
            onClick={() => {
              setEditingQuiz(null);
              setFormData({
                title: '',
                courseId: '',
                duration: 30,
                maxPoints: 100,
                questions: [{ question: '', options: ['', '', '', ''], correctAnswer: '' }]
              });
              setActiveTab('create');
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition"
          >
            Create Quiz
          </button>
        )}
      </div>

      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('list')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'list'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Quiz List
          </button>
          {user?.role !== 'student' && (
            <button
              onClick={() => setActiveTab('create')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'create'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Create Quiz
            </button>
          )}
        </nav>
      </div>

      {activeTab === 'create' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            {editingQuiz ? 'Edit Quiz' : 'Create New Quiz'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="title">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="courseId">
                  Course
                </label>
                <select
                  id="courseId"
                  value={formData.courseId}
                  onChange={(e) => setFormData({...formData, courseId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a course</option>
                  {courses.map(course => (
                    <option key={course._id} value={course._id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="duration">
                  Duration (minutes)
                </label>
                <input
                  id="duration"
                  type="number"
                  min="1"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="maxPoints">
                  Max Points
                </label>
                <input
                  id="maxPoints"
                  type="number"
                  min="1"
                  value={formData.maxPoints}
                  onChange={(e) => setFormData({...formData, maxPoints: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-800">Questions</h3>
                <button
                  type="button"
                  onClick={addQuestion}
                  className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded-md text-sm"
                >
                  Add Question
                </button>
              </div>

              {formData.questions.map((question, qIndex) => (
                <div key={qIndex} className="mb-6 p-4 border border-gray-200 rounded-md">
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-gray-700 font-medium">Question {qIndex + 1}</label>
                    {formData.questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestion(qIndex)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <textarea
                    value={question.question}
                    onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                    placeholder="Enter question"
                    rows={2}
                    required
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    {question.options.map((option, oIndex) => (
                      <div key={oIndex} className="flex items-center">
                        <input
                          type="radio"
                          name={`correct-${qIndex}`}
                          checked={question.correctAnswer === option}
                          onChange={() => updateQuestion(qIndex, 'correctAnswer', option)}
                          className="mr-2"
                          required
                        />
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => updateQuestion(qIndex, `options.${oIndex}`, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={`Option ${oIndex + 1}`}
                          required
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition"
              >
                {editingQuiz ? 'Update' : 'Create'} Quiz
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'list' && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Title</th>
                <th className="py-3 px-4 text-left">Course</th>
                <th className="py-3 px-4 text-left">Duration</th>
                <th className="py-3 px-4 text-left">Max Points</th>
                <th className="py-3 px-4 text-left">Questions</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {quizzes.map(quiz => {
                const course = courses.find(c => c._id === quiz.courseId);
                return (
                  <tr key={quiz._id}>
                    <td className="py-3 px-4">
                      <Link to={`/quizzes/${quiz._id}`} className="text-blue-600 hover:underline">
                        {quiz.title}
                      </Link>
                    </td>
                    <td className="py-3 px-4">{course?.title || quiz.courseId}</td>
                    <td className="py-3 px-4">{quiz.duration} min</td>
                    <td className="py-3 px-4">{quiz.maxPoints}</td>
                    <td className="py-3 px-4">{quiz.questions.length}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end space-x-2">
                        {user?.role === 'student' ? (
                          <Link
                            to={`/quizzes/${quiz._id}/take`}
                            className="text-green-600 hover:text-green-800"
                          >
                            Take Quiz
                          </Link>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEdit(quiz)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(quiz._id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {quizzes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No quizzes found</p>
              {user?.role !== 'student' && (
                <button
                  onClick={() => setActiveTab('create')}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition"
                >
                  Create Your First Quiz
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Quizzes;