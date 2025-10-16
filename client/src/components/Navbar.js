import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-purple-800 rounded-xl flex items-center justify-center group-hover:bg-purple-700 transition-all duration-300 shadow-lg group-hover:shadow-xl">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-800 group-hover:text-purple-800 transition-colors">Fes Notes</span>
              <span className="text-xs text-gray-500 -mt-1">Beautiful notes</span>
            </div>
          </Link>

          {/* Navigation Links */}
          {user && (
            <div className="flex items-center space-x-4">
              <Link
                to="/note/new"
                className="bg-purple-800 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl flex items-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
              >
                <Plus size={16} />
                <span>New Note</span>
              </Link>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-800 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white font-semibold text-sm">{user.username.charAt(0).toUpperCase()}</span>
                  </div>
                  <span className="text-gray-700 font-medium">{user.username}</span>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-gray-800 transition-colors flex items-center space-x-1"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;