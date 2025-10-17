import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
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
            <div className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-105 transition-all duration-300 shadow-lg group-hover:shadow-xl">
              <img 
                src="/images/logo.jfif" 
                alt="Fes Notes Logo" 
                className="w-10 h-10 rounded-xl object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-800 group-hover:text-purple-800 transition-colors">Fes Notes</span>
              <span className="text-xs text-gray-500 -mt-1">Beautiful notes</span>
            </div>
          </Link>

          {/* User Profile and Logout */}
          {user && (
            <div className="flex items-center space-x-4">
              {/* <div className="flex items-center space-x-3 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-200 hover:bg-gray-100 transition-all duration-300"> */}
                <div className="w-10 h-10 bg-purple-800 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">{user.username.charAt(0).toUpperCase()}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-800 font-semibold text-sm">{user.username}</span>
                  <span className="text-gray-500 text-xs">Active now</span>
                </div>
              {/* </div> */}
              
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-xl transition-all duration-300 group"
                title="Logout"
              >
                <LogOut size={18} className="group-hover:scale-110 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;