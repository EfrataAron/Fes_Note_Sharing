// import React, { createContext, useContext, useState } from 'react';
// import axios from 'axios';

// // Create Notes Context
// const NotesContext = createContext();

// // Notes Provider Component
// export const NotesProvider = ({ children }) => {
//   // Simple state management
//   const [notes, setNotes] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // Get all notes
//   const fetchNotes = async (searchTerm = '') => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const params = searchTerm ? `?search=${searchTerm}` : '';
//       const response = await axios.get(`/notes${params}`);
//       setNotes(response.data.notes);
//     } catch (error) {
//       setError('Failed to fetch notes');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Create new note
//   const createNote = async (noteData) => {
//     try {
//       setLoading(true);
//       const response = await axios.post('/notes', noteData);
//       setNotes([response.data.note, ...notes]);
//       return { success: true, note: response.data.note };
//     } catch (error) {
//       setError('Failed to create note');
//       return { success: false, error: 'Failed to create note' };
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Update note
//   const updateNote = async (id, noteData) => {
//     try {
//       setLoading(true);
//       const response = await axios.put(`/notes/${id}`, noteData);
//       setNotes(notes.map(note => note.id === id ? response.data.note : note));
//       return { success: true, note: response.data.note };
//     } catch (error) {
//       setError('Failed to update note');
//       return { success: false, error: 'Failed to update note' };
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Delete note
//   const deleteNote = async (id) => {
//     try {
//       setLoading(true);
//       await axios.delete(`/notes/${id}`);
//       setNotes(notes.filter(note => note.id !== id));
//       return { success: true };
//     } catch (error) {
//       setError('Failed to delete note');
//       return { success: false, error: 'Failed to delete note' };
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Clear error
//   const clearError = () => {
//     setError(null);
//   };

//   // Simple context value
//   const value = {
//     notes,
//     loading,
//     error,
//     fetchNotes,
//     createNote,
//     updateNote,
//     deleteNote,
//     clearError
//   };

//   return (
//     <NotesContext.Provider value={value}>
//       {children}
//     </NotesContext.Provider>
//   );
// };

// // Custom hook to use notes context
// export const useNotes = () => {
//   const context = useContext(NotesContext);
//   if (!context) {
//     throw new Error('useNotes must be used within a NotesProvider');
//   }
//   return context;
// };


import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

// Helper: debounce function
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Create Notes Context
const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debounced fetchNotes
  const fetchNotes = useCallback((searchTerm = '') => {
    if (!fetchNotes.debounced) {
      fetchNotes.debounced = debounce(async (term) => {
        try {
          setLoading(true);
          setError(null);

          const params = term ? `?search=${term}` : '';
          const response = await axios.get(`/notes${params}`);
          setNotes(response.data.notes || []);
        } catch (err) {
          console.error('Fetch notes error:', err);
          if (err.response?.status === 429) {
            setError('Too many requests. Please wait a moment.');
          } else {
            setError('Failed to fetch notes');
          }
        } finally {
          setLoading(false);
        }
      }, 300);
    }
    fetchNotes.debounced(searchTerm);
  }, []); // ESLint-safe: no external dependencies

  // Create note
  const createNote = async (noteData) => {
    try {
      setLoading(true);
      const response = await axios.post('/notes', noteData);
      setNotes([response.data.note, ...notes]);
      return { success: true, note: response.data.note };
    } catch (err) {
      console.error('Create note error:', err);
      setError(err.response?.data?.message || 'Failed to create note');
      return { success: false, error: 'Failed to create note' };
    } finally {
      setLoading(false);
    }
  };

  // Update note
  const updateNote = async (id, noteData) => {
    const noteId = parseInt(id);
    if (!noteId) return { success: false, error: 'Invalid note ID' };

    try {
      setLoading(true);
      const response = await axios.put(`/notes/${noteId}`, noteData);
      setNotes(notes.map(note => note.id === noteId ? response.data.note : note));
      return { success: true, note: response.data.note };
    } catch (err) {
      console.error('Update note error:', err);
      if (err.response?.status === 429) {
        setError('Too many requests. Please wait a moment.');
      } else {
        setError('Failed to update note');
      }
      return { success: false, error: 'Failed to update note' };
    } finally {
      setLoading(false);
    }
  };

  // Delete note
  const deleteNote = async (id) => {
    const noteId = parseInt(id);
    if (!noteId) return { success: false, error: 'Invalid note ID' };

    try {
      setLoading(true);
      await axios.delete(`/notes/${noteId}`);
      setNotes(notes.filter(note => note.id !== noteId));
      return { success: true };
    } catch (err) {
      console.error('Delete note error:', err);
      if (err.response?.status === 429) {
        setError('Too many requests. Please wait a moment.');
      } else {
        setError('Failed to delete note');
      }
      return { success: false, error: 'Failed to delete note' };
    } finally {
      setLoading(false);
    }
  };

  // Share note with one or multiple users
  const shareNote = async (noteId, usernames, permission = 'read') => {
    try {
      setLoading(true);
      const response = await axios.post(`/notes/${noteId}/share`, {
        usernames, // Can be string or array
        permission
      });
      return { 
        success: true, 
        message: response.data.message,
        successful: response.data.successful,
        failed: response.data.failed
      };
    } catch (err) {
      console.error('Share note error:', err);
      const errorMessage = err.response?.data?.error || 'Failed to share note';
      setError(errorMessage);
      return { 
        success: false, 
        error: errorMessage,
        details: err.response?.data?.details
      };
    } finally {
      setLoading(false);
    }
  };

  // Get shared notes
  const fetchSharedNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/notes/shared');
      return { success: true, notes: response.data.notes };
    } catch (err) {
      console.error('Fetch shared notes error:', err);
      setError('Failed to fetch shared notes');
      return { success: false, error: 'Failed to fetch shared notes' };
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  const value = {
    notes,
    loading,
    error,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
    shareNote,
    fetchSharedNotes,
    clearError,
  };

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
};

// Custom hook
export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) throw new Error('useNotes must be used within NotesProvider');
  return context;
};
