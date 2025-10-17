import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, error, clearError } = useAuth();
  const navigate = useNavigate();



  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    setIsLoading(true);

    const result = await register(username, email, password);
    
    if (result.success) {
      navigate('/dashboard');
    }
    
    setIsLoading(false);
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
      <div className="absolute inset-0 bg-black/10"></div>
      
      <div className="w-full max-w-md relative z-10">
        {/* Centered Branding */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <img 
              src="/images/logo.jfif" 
              alt="Fes Notes Logo" 
              className="w-20 h-20 rounded-2xl shadow-2xl mr-6"
            />
            <div className="relative">
              <h1 className="text-7xl font-bold text-purple-800 tracking-tight relative z-10">
                Fes Notes
              </h1>
              {/* Subtle glow effect */}
              <div className="absolute inset-0 text-7xl font-bold text-purple-300 blur-sm opacity-30 tracking-tight">
                Fes Notes
              </div>
            </div>
          </div>
          <p className="text-2xl text-gray-900 mb-2">Create account</p>
          <p className="text-gray-800">Start your journey with beautiful notes</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="w-full px-0 py-4 text-lg border-0 border-b-2 border-gray-200 focus:border-purple-800 focus:outline-none transition-colors bg-transparent placeholder-gray-400"
                placeholder="Username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (error) clearError();
                }}
              />
            </div>

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

            <div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="w-full px-0 py-4 text-lg border-0 border-b-2 border-gray-200 focus:border-purple-800 focus:outline-none transition-colors bg-transparent placeholder-gray-400"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (error) clearError();
                }}
              />
            </div>

            {password && confirmPassword && password !== confirmPassword && (
              <div className="text-red-600 text-sm font-medium mt-2">
                Passwords do not match
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || password !== confirmPassword}
              className="w-full bg-purple-800 hover:bg-purple-900 text-white font-semibold py-4 px-6 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl text-lg mt-8"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Creating account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-purple-800 hover:text-purple-900 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;