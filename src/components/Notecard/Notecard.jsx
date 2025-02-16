import { useState, useRef } from "react";
import { FaCopy, FaEllipsisV, FaTrash, FaEdit, FaPause, FaPlay, FaSave, FaTimes } from "react-icons/fa";
import Toast from "../Toast/Toast";

export default function NoteCard({ note, onClick, onDelete, onRename }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [Note, setNote] = useState(note);
  const [showToast, setShowToast] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(note.title);
  const audioRef = useRef(null);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(Note.description);
    setShowToast(true);

    setTimeout(() => setShowToast(false), 2000); // Hide toast after 2s
  };

  const togglePlayPause = (e) => {
    e.stopPropagation(); // Prevents modal opening when clicking the button

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleRename = async (e) => {
    e.stopPropagation(); // Prevent card click from triggering modal

    if (newTitle.trim() === "") return; // Prevent empty title

    try {
      await onRename(Note._id, newTitle); // Call rename function
      setNote((prev) => ({ ...prev, title: newTitle })); // Update UI
      setIsEditing(false); // Exit editing mode
    } catch (error) {
      console.error("Error renaming note:", error);
    }
  };
  const handleClose = async (e) => {
    e.stopPropagation(); // Prevent card click from triggering modal
    setIsEditing(false)
    
  };

  return (
    <div
      className="relative p-4 bg-white shadow-md grid rounded-lg cursor-pointer transition hover:shadow-xl"
      onClick={onClick}
    >
      {/* Audio Player */}
      {Note.type === "audio" && Note.Audio && (
        <div className="absolute top-2 right-10">
          <audio ref={audioRef} src={Note.Audio} />
          <button
            onClick={togglePlayPause}
            className="text-gray-600 hover:bg-gray-100 p-2 rounded-full ml-2"
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
        </div>
      )}
      {note.type === "text" && <p className="absolute top-2 right-10">Text</p>}

      {/* Three-dot menu */}
      <div className="absolute top-2 right-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(!menuOpen);
          }}
          className="p-2 rounded-full text-gray-600 hover:bg-gray-100"
        >
          <FaEllipsisV />
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-lg">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
                setMenuOpen(false);
              }}
              className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100"
            >
              <FaEdit /> Rename
            </button>
            <button
              onClick={(e) => onDelete(e)}
              className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-gray-100"
            >
              <FaTrash /> Delete
            </button>
          </div>
        )}
      </div>

      {/* Note Title - Editable */}
      <span className="text-gray-400 text-sm mt-2">{new Date(Note.createdAt).toLocaleString()}</span>
      {isEditing ? (
        <div className="flex items-center gap-2 mt-2">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="border px-2 py-1 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-purple-600"
            autoFocus
            maxLength={15}
            onClick={(e) => e.stopPropagation()}
          />
          <button onClick={handleRename} className="text-gray-600 hover:bg-gray-100">
            <FaSave />
          </button>
          <button onClick={handleClose} className="text-gray-600 hover:bg-gray-100">
            <FaTimes />
          </button>
        </div>
      ) : (
        <h2 className="text-xl mt-0 font-bold font-mono">{Note.title}</h2>
      )}

      <p className="text-gray-500 mt-0">{Note.description}</p>

      {/* Copy to Clipboard button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          copyToClipboard();
        }}
        className="absolute bottom-2 right-2 p-2 rounded-full text-gray-600 hover:bg-gray-100 cursor-pointer"
      >
        <FaCopy />
      </button>

      {showToast && <Toast message="Copied to clipboard!" color={"bg-green-100 text-green-800"} onClose={() => setShowToast(false)} />}
    </div>
  );
}
