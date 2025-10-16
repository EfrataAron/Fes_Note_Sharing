// Import necessary React hooks and components
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Save, ArrowLeft } from "lucide-react";
import { useNotes } from "../context/NotesContext";

const NoteEditor = () => {
  // Get note ID from URL parameters and navigation function
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Get notes context functions
  const { notes, createNote, updateNote } = useNotes();

  // State for form inputs
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState("yellow"); // Default color
  const [isSaving, setIsSaving] = useState(false);

  // Check if this is a new note or editing existing one
  const isNewNote = id === "new";

  // Load existing note data when editing (not for new notes)
  useEffect(() => {
    if (!isNewNote && id) {
      // Find the note by ID in the notes array
      const note = notes.find((n) => n.id === parseInt(id));
      if (note) {
        // Populate form with existing note data
        setTitle(note.title);
        setContent(note.content);
        setColor(note.color || "yellow"); // Use saved color or default
      } else {
        console.warn("Note not found for id:", id);
      }
    }
  }, [id, isNewNote, notes]);

  // Handle save button click - create new note or update existing
  const handleSave = async () => {
    // Validate that both title and content are provided
    if (!title.trim() || !content.trim()) {
      alert("Please fill in both title and content");
      return;
    }

    setIsSaving(true); // Show loading state

    try {
      if (isNewNote) {
        // Create new note with title, content, and color
        const result = await createNote({ title, content, color });
        if (result.success) navigate("/dashboard");
      } else {
        // Validate note ID before updating
        if (!id || id === "undefined") {
          alert("Cannot update: Invalid note ID.");
          setIsSaving(false);
          return;
        }
        // Update existing note
        const result = await updateNote(id, { title, content, color });
        if (result.success) {
          // Navigate back to dashboard after successful save
          navigate("/dashboard");
        } else {
          alert("Failed to save note");
        }
      }
    } catch (err) {
      console.error("Error saving note:", err);
      alert("Failed to save note");
    }

    setIsSaving(false); // Reset loading state
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="p-3 text-gray-600 hover:text-purple-800 hover:bg-purple-50 rounded-xl transition-all duration-300"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-purple-800">
                {isNewNote ? "Create New Note" : "Edit Note"}
              </h1>
              <p className="text-gray-600 mt-1">
                {isNewNote ? "Start writing your beautiful note" : "Make your changes"}
              </p>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving || !title.trim() || !content.trim()}
            className="bg-purple-800 hover:bg-purple-700 text-white px-8 py-3 rounded-2xl flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
          >
            <Save size={20} />
            {isSaving ? "Saving..." : "Save Note"}
          </button>
        </div>

      {/* Editor */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <div className="space-y-8">
          {/* Title */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              Note Title
            </label>
            <input
              type="text"
              className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-800 focus:border-transparent text-xl font-medium transition-all duration-300 shadow-sm"
              placeholder="Give your note a beautiful title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              Note Color
            </label>
            <div className="flex gap-3">
              {[
                { name: 'yellow', bg: 'bg-yellow-200', border: 'border-yellow-300' },
                { name: 'pink', bg: 'bg-pink-200', border: 'border-pink-300' },
                { name: 'blue', bg: 'bg-blue-200', border: 'border-blue-300' },
                { name: 'green', bg: 'bg-green-200', border: 'border-green-300' },
                { name: 'purple', bg: 'bg-purple-200', border: 'border-purple-300' },
                { name: 'orange', bg: 'bg-orange-200', border: 'border-orange-300' },
              ].map((colorOption) => (
                <button
                  key={colorOption.name}
                  type="button"
                  onClick={() => setColor(colorOption.name)}
                  className={`w-12 h-12 rounded-xl ${colorOption.bg} ${colorOption.border} border-2 transition-all duration-300 hover:scale-110 ${
                    color === colorOption.name 
                      ? 'ring-4 ring-purple-800 ring-opacity-50 scale-110' 
                      : 'hover:shadow-lg'
                  }`}
                  title={`${colorOption.name} note`}
                />
              ))}
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-3">
              Content
            </label>
            <textarea
              className="w-full px-6 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-800 focus:border-transparent resize-none text-lg leading-relaxed transition-all duration-300 shadow-sm"
              rows={18}
              placeholder="Start writing your thoughts here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default NoteEditor;
