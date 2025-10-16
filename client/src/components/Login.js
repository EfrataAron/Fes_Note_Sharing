import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      navigate('/dashboard');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern - Note Cards */}
      <div className="absolute inset-0 opacity-8">
        <div className="grid grid-cols-5 gap-6 h-full p-8 transform rotate-12 scale-110">
          {[...Array(35)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-lg border border-purple-100 p-4 animate-float"
              style={{
                height: `${Math.random() * 120 + 100}px`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: `${6 + Math.random() * 4}s`,
              }}
            >
              {/* Simulated note content */}
              <div className="space-y-2">
                <div className="h-3 bg-purple-200 rounded w-3/4"></div>
                <div className="h-2 bg-purple-100 rounded w-full"></div>
                <div className="h-2 bg-purple-100 rounded w-2/3"></div>
                <div className="h-2 bg-purple-100 rounded w-4/5"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Centered Branding */}
        <div className="text-center mb-12">
          <div className="relative">
            <h1 className="text-7xl font-bold text-purple-800 mb-6 tracking-tight relative z-10">
              Fes Notes
            </h1>
            {/* Subtle glow effect */}
            <div className="absolute inset-0 text-7xl font-bold text-purple-300 blur-sm opacity-30 tracking-tight">
              Fes Notes
            </div>
          </div>
          <p className="text-xl text-gray-600 mb-2">Welcome back</p>
          <p className="text-gray-500">Sign in to continue to your notes</p>
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
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-semibold text-purple-800 hover:text-purple-900 transition-colors"
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