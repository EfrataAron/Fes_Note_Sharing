// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Save, ArrowLeft } from 'lucide-react';
// import { useNotes } from '../context/NotesContext';

// const NoteEditor = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { notes, createNote, updateNote } = useNotes();

//   const [title, setTitle] = useState('');
//   const [content, setContent] = useState('');
//   const [isSaving, setIsSaving] = useState(false);

//   const isNewNote = id === 'new';

//   // Load existing note if editing
//   useEffect(() => {
//     if (!isNewNote && id) {
//       const note = notes.find(n => n.id === parseInt(id));
//       if (note) {
//         setTitle(note.title);
//         setContent(note.content);
//       }
//     }
//   }, [id, isNewNote, notes]);

//   // Save note
//   const handleSave = async () => {
//     if (!title.trim() || !content.trim()) {
//       alert('Please fill in both title and content');
//       return;
//     }

//     setIsSaving(true);

//     try {
//       if (isNewNote) {
//         const result = await createNote({ title, content });
//         if (result.success) {
//           navigate(`/note/${result.note.id}`);
//         }
//       } else {
//         const result = await updateNote(id, { title, content });
//         if (result.success) {
//           alert('Note saved successfully!');
//         }
//       }
//     } catch (error) {
//       alert('Failed to save note');
//     }

//     setIsSaving(false);
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center gap-4">
//           <button
//             onClick={() => navigate('/dashboard')}
//             className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
//           >
//             <ArrowLeft size={24} />
//           </button>
//           <h1 className="text-2xl font-bold text-gray-800">
//             {isNewNote ? 'New Note' : 'Edit Note'}
//           </h1>
//         </div>

//         <button
//           onClick={handleSave}
//           disabled={isSaving || !title.trim() || !content.trim()}
//           className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//         >
//           <Save size={20} />
//           {isSaving ? 'Saving...' : 'Save'}
//         </button>
//       </div>

//       {/* Editor */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//         <div className="space-y-6">
//           {/* Title Input */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Title
//             </label>
//             <input
//               type="text"
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               placeholder="Enter note title..."
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//             />
//           </div>

//           {/* Content Input */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Content
//             </label>
//             <textarea
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
//               rows={15}
//               placeholder="Write your note content here..."
//               value={content}
//               onChange={(e) => setContent(e.target.value)}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NoteEditor;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Save, ArrowLeft } from "lucide-react";
import { useNotes } from "../context/NotesContext";

const NoteEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notes, createNote, updateNote } = useNotes();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const isNewNote = id === "new";

  // Load existing note
  useEffect(() => {
    if (!isNewNote && id) {
      const note = notes.find((n) => n.id === parseInt(id));
      if (note) {
        setTitle(note.title);
        setContent(note.content);
      } else {
        console.warn("Note not found for id:", id);
      }
    }
  }, [id, isNewNote, notes]);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Please fill in both title and content");
      return;
    }

    setIsSaving(true);

    try {
      if (isNewNote) {
        const result = await createNote({ title, content });
        if (result.success) navigate("/dashboard");
      } else {
        if (!id || id === "undefined") {
          alert("Cannot update: Invalid note ID.");
          setIsSaving(false);
          return;
        }
        const result = await updateNote(id, { title, content });
        // if (result.success) alert('Note saved successfully!');
        if (result.success) {
          // Navigate back to dashboard after saving
          navigate("/dashboard");
        } else {
          alert("Failed to save note");
        }
      }
    } catch (err) {
      console.error("Error saving note:", err);
      alert("Failed to save note");
    }

    setIsSaving(false);
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
