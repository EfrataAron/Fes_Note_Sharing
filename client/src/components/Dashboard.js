// Import necessary React hooks and components
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Trash2, FileText, X, AlertTriangle } from 'lucide-react';
import { useNotes } from '../context/NotesContext';

const Dashboard = () => {
  // Get notes data and functions from context
  const { notes, loading, error, fetchNotes, deleteNote } = useNotes();

  // State for search functionality
  const [searchTerm, setSearchTerm] = useState('');

  // State for delete confirmation modal
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, noteId: null, noteTitle: '' });

  // Function to get CSS classes for note card background colors
  const getColorClasses = (color) => {
    const colorMap = {
      yellow: 'bg-yellow-200 border-yellow-300',
      pink: 'bg-pink-200 border-pink-300',
      blue: 'bg-blue-200 border-blue-300',
      green: 'bg-green-200 border-green-300',
      purple: 'bg-purple-200 border-purple-300',
      orange: 'bg-orange-200 border-orange-300',
    };
    // Return mapped color or default white if color not found
    return colorMap[color] || 'bg-white border-gray-100';
  };



  // Load all notes when component first renders
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Handle search input changes and filter notes
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    fetchNotes(e.target.value); // Fetch notes with search term
  };

  // Open delete confirmation modal with note details
  const openDeleteModal = (id, title) => {
    setDeleteModal({ isOpen: true, noteId: id, noteTitle: title });
  };

  // Close delete modal and reset state
  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, noteId: null, noteTitle: '' });
  };

  // Confirm and execute note deletion
  const handleDelete = async () => {
    if (deleteModal.noteId) {
      await deleteNote(deleteModal.noteId);
      closeDeleteModal();
    }
  };

  // Format timestamp to readable date string
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-purple-800 mb-3">Welcome Back!</h1>
          <p className="text-gray-600 text-lg">
            You have <span className="font-semibold text-purple-800">{notes.length}</span> {notes.length === 1 ? 'note' : 'notes'} in your collection
          </p>
        </div>

        {/* Search and Add Note */}
        <div className="flex gap-4 mb-10">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search your beautiful notes..."
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-800 focus:border-transparent shadow-sm bg-white transition-all duration-300"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <Link
            to="/note/new"
            className="bg-purple-800 hover:bg-purple-700 text-white px-8 py-4 rounded-2xl flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
          >
            <Plus size={20} />
            New Note
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl mb-8 shadow-sm">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-4 border-purple-800"></div>
            <p className="mt-4 text-purple-800 font-medium text-lg">Loading your beautiful notes...</p>
          </div>
        )}

        {/* Notes Grid */}
        {!loading && notes.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <FileText className="text-purple-800" size={48} />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-3">No notes yet</h3>
            <p className="text-gray-500 mb-8 text-lg">
              {searchTerm ? 'No notes match your search.' : 'Create your first beautiful note to get started.'}
            </p>
            {!searchTerm && (
              <Link
                to="/note/new"
                className="bg-purple-800 hover:bg-purple-700 text-white px-8 py-4 rounded-2xl inline-flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl font-medium text-lg"
              >
                <Plus size={24} />
                Create First Note
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {notes.map((note, index) => {
              // Assign color: use saved color or cycle through colors based on note ID
              const noteColor = note.color || ['yellow', 'pink', 'blue', 'green', 'purple', 'orange'][note.id % 6];

              return (
                <Link
                  to={`/note/${note.id}`}
                  key={note.id}
                  className={`block rounded-2xl shadow-lg border p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group animate-fade-in cursor-pointer ${getColorClasses(noteColor)}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-800 line-clamp-2 group-hover:text-purple-800 transition-colors">
                      {note.title}
                    </h3>
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          openDeleteModal(note.id, note.title);
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-110"
                        title="Delete note"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-600 line-clamp-3 mb-6 leading-relaxed">
                    {note.content}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500 bg-white/50 px-4 py-2 rounded-full font-medium">
                      {formatDate(note.created_at)}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 animate-fade-in">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="text-red-600" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Delete Note</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>
              <button
                onClick={closeDeleteModal}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <p className="text-gray-700 mb-2">
                Are you sure you want to delete this note?
              </p>
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <p className="font-semibold text-gray-900 truncate">"{deleteModal.noteTitle}"</p>
              </div>
              <p className="text-sm text-gray-500">
                This note will be permanently deleted and cannot be recovered.
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 p-6 pt-0">
              <button
                onClick={closeDeleteModal}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-all duration-300 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
              >
                Delete Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;