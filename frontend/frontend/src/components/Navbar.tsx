import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/dashboard" className="text-xl font-bold">LMS Dashboard</Link>
          
          {isAuthenticated && user && (
            <div className="flex items-center space-x-4">
              <span>Welcome, {user.firstName} ({user.role})</span>
              <div className="relative group">
                <button className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-md transition">
                  Menu
                </button>
                <div className="absolute right-0 mt-1 w-48 bg-white text-gray-800 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-10">
                  <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-100">Dashboard</Link>
                  <Link to="/courses" className="block px-4 py-2 hover:bg-gray-100">Courses</Link>
                  {user.role !== 'student' && (
                    <>
                      <Link to="/assignments" className="block px-4 py-2 hover:bg-gray-100">Assignments</Link>
                      <Link to="/quizzes" className="block px-4 py-2 hover:bg-gray-100">Quizzes</Link>
                    </>
                  )}
                  <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;