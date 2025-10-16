// Import necessary React hooks and components
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  // State for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Get authentication functions from context
  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();



  // Handle form submission for user login
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setIsLoading(true); // Show loading state

    // Attempt to log in user with provided credentials
    const result = await login(email, password);
    
    // Redirect to dashboard if login successful
    if (result.success) {
      navigate('/dashboard');
    }
    
    setIsLoading(false); // Reset loading state
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Image - Sticky Notes */}
      <div 
        className="absolute inset-0 opacity-40 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/images/notes.jpg)',
        }}
      ></div>
      
      {/* Black Transparent Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Centered Branding */}
        <div className="text-center mb-12">
          <div className="relative">
            <h1 className="text-8xl font-bold text-purple-900 mb-6 tracking-tight relative z-10">
              Fes Notes
            </h1>
            {/* Subtle glow effect */}
            <div className="absolute inset-0 text-8xl font-bold text-purple-500 blur-sm opacity-30 tracking-tight">
              Fes Notes
            </div>
          </div>
          <p className="text-3xl font-bold text-black mb-4">Welcome back</p>
          <p className="text-xl font-bold text-gray-900">Sign in to continue to your notes</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-0 py-4 text-lg border-0 border-b-2 border-gray-200 focus:border-purple-800 focus:outline-none transition-colors bg-transparent placeholder-gray-400"
                placeholder="Email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) clearError();
                }}
              />
            </div>

            <div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-0 py-4 text-lg border-0 border-b-2 border-gray-200 focus:border-purple-800 focus:outline-none transition-colors bg-transparent placeholder-gray-400"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) clearError();
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-800 hover:bg-purple-900 text-white font-semibold py-4 px-6 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl text-lg mt-10"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center">
          <p className="text-black">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-semibold text-white hover:text-purple-900 transition-colors"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;