import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

// Create Notes Context
const NotesContext = createContext();

// Notes Provider Component
export const NotesProvider = ({ children }) => {
  // Simple state management
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get all notes
  const fetchNotes = async (searchTerm = '') => {
    try {
      setLoading(true);
      setError(null);
      
      const params = searchTerm ? `?search=${searchTerm}` : '';
      const response = await axios.get(`/notes${params}`);
      setNotes(response.data.notes);
    } catch (error) {
      setError('Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  // Create new note
  const createNote = async (noteData) => {
    try {
      setLoading(true);
      const response = await axios.post('/notes', noteData);
      setNotes([response.data.note, ...notes]);
      return { success: true, note: response.data.note };
    } catch (error) {
      setError('Failed to create note');
      return { success: false, error: 'Failed to create note' };
    } finally {
      setLoading(false);
    }
  };

  // Update note
  const updateNote = async (id, noteData) => {
    try {
      setLoading(true);
      const response = await axios.put(`/notes/${id}`, noteData);
      setNotes(notes.map(note => note.id === id ? response.data.note : note));
      return { success: true, note: response.data.note };
    } catch (error) {
      setError('Failed to update note');
      return { success: false, error: 'Failed to update note' };
    } finally {
      setLoading(false);
    }
  };

  // Delete note
  const deleteNote = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`/notes/${id}`);
      setNotes(notes.filter(note => note.id !== id));
      return { success: true };
    } catch (error) {
      setError('Failed to delete note');
      return { success: false, error: 'Failed to delete note' };
    } finally {
      setLoading(false);
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Simple context value
  const value = {
    notes,
    loading,
    error,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
    clearError
  };

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
};

// Custom hook to use notes context
export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};