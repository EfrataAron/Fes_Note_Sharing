// import React, { createContext, useContext, useReducer, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import axios from "axios";

// Components
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import NoteEditor from "./components/NoteEditor";

// Context
import { AuthProvider, useAuth } from "./context/AuthContext";
import { NotesProvider } from "./context/NotesContext";

// Configure axios defaults
axios.defaults.baseURL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Set up axios interceptor for token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    
    return Promise.reject(error);
  }
);

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

// Public Route Component (redirect if logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return user ? <Navigate to="/dashboard" /> : children;
};

// Layout component to conditionally show navbar
const Layout = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();
  
  // Don't show navbar on login and register pages
  const hideNavbar = ['/login', '/register'].includes(location.pathname);
  
  return (
    <div className="min-h-screen bg-gray-50">
      {!hideNavbar && user && <Navbar />}
      <main>
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <NotesProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />

              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />

              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                }
              />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/note/:id"
                element={
                  <ProtectedRoute>
                    <NoteEditor />
                  </ProtectedRoute>
                }
              />


            </Routes>
          </Layout>
        </Router>
      </NotesProvider>
    </AuthProvider>
  );
}

export default App;
