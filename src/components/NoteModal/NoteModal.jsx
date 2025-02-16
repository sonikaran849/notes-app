import { useState } from "react";
import { FaStar, FaExpand, FaEdit, FaDownload, FaTrash, FaPlus , FaSpinner } from "react-icons/fa";
import { api, API_BASE_URL } from "../../config/apiconfig";

export default function NoteModal({ note, onClose }) {
  const [Note, setNote] = useState(note);
  const [isFavorite, setIsFavorite] = useState(Note.favourite);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [noteText, setNoteText] = useState(Note.description);
  const [isEditable, setIsEditable] = useState(true);
  const [loading, setLoading] = useState(false); // New loading state
  const id = Note._id;
  const jwt = localStorage.getItem("token");

  const handleUpdate = async () => {
    setLoading(true); // Show loading spinner
    try {
      const res = await api.patch(
        `${API_BASE_URL}/api/NoteData/update/${id}`,
        { description: noteText },
        {
          headers: { Authorization: jwt },
        }
      );
      setNote(res.data.updatedNote);
      setIsEditable(true); // Lock textarea after update
    } catch (err) {
      console.error("Error updating note:", err);
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };


  const handleFavourite = async () => {
    try {
      const res = await api.patch(`${API_BASE_URL}/api/notes/${id}/favourite`, {
        headers: { Authorization: jwt },
      });
      setNote(res.data.note);
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error("Error updating favorite:", err);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("id", id);

    try {
      const res = await api.patch(`${API_BASE_URL}/api/notes/uploadImage`, formData, {
        headers: {
          Authorization: jwt,
          "Content-Type": "multipart/form-data",
        },
      });

      setNote((prevNote) => ({
        ...prevNote,
        images: [...(prevNote.images || []), res.data.url],
      }));
      console.log(note);
    } catch (err) {
      console.error("Error uploading image:", err);
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  const handleImageDelete = async (imageUrl) => {
    try {
      await api.delete(`${API_BASE_URL}/api/notes/${id}/deleteImage`, {
        headers: { Authorization: jwt },
        data: { imageUrl }, // Sending the image URL to be deleted
      });

      setNote((prevNote) => ({
        ...prevNote,
        images: prevNote.images.filter((img) => img !== imageUrl),
      }));

    } catch (err) {
      console.error("Error deleting image:", err);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-30 backdrop-blur-sm z-50">
      <div
        className={`bg-white p-6 relative shadow-lg transition-all duration-300 ${
          isFullScreen
            ? "fixed inset-0 w-screen h-screen p-10 rounded-none flex flex-col"
            : "max-w-3xl w-full rounded-lg"
        }`}
      >
        {/* Close Button */}
        <button className="absolute top-3 right-3 text-black hover:text-red-500" onClick={onClose}>
          ✖
        </button>

        {/* Header */}
        <div className="flex justify-between items-center mt-5">
          <h2 className="text-2xl font-bold">{Note.title}</h2>
          <div className="flex gap-3">
            <button onClick={handleFavourite} className={isFavorite ? "text-yellow-500" : "text-gray-400"}>
              <FaStar size={20} />
            </button>
            <button onClick={() => setIsFullScreen(!isFullScreen)}>
              <FaExpand size={20} className={isFullScreen ? "text-blue-500" : "text-gray-500"} />
            </button>
            <button onClick={() => setIsEditable(!isEditable)}>
              <FaEdit size={20} />
            </button>
          </div>
        </div>

        <p className="text-gray-500 mt-2">{new Date(Note.createdAt).toLocaleString()}</p>

        {/* Audio Section */}
        {Note.Audio && (
          <div className="mt-4 flex items-center gap-3">
            <audio controls className="w-full">
              <source src={Note.Audio} type="audio/wav" />
            </audio>
            <a href={Note.Audio} download className="bg-purple-600 text-white p-2 rounded-lg inline-flex items-center gap-2">
              <FaDownload size={16} /> Download
            </a>
          </div>
        )}

        {/* Note Text Area */}
        <div className="mt-4">
          <textarea
            className="w-full p-4 border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 resize-none h-24"
            placeholder="Type a note..."
            disabled={isEditable}
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
          />
        </div>

        {/* Images Section (Grid 4 per row) */}
        <div className="mt-4 grid grid-cols-4 gap-2">
          {/* Already Saved Images */}
          {Note.images &&
            Note.images.map((image, index) => (
              <div key={index} className="relative group">
                <a href={image} target="_blank" rel="noopener noreferrer">
                  <img src={image} alt={`Note Image ${index + 1}`} className="w-full h-20 object-cover rounded-lg shadow-md" />
                </a>
                {/* Delete Button (Visible on hover) */}
                <button
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleImageDelete(image)}
                >
                  <FaTrash size={12} />
                </button>
              </div>
            ))}

          {/* Attach New Image Block (Always Rightmost) */}
          <label
            htmlFor="image-upload"
            className="w-full h-20 bg-gray-200 rounded-lg flex justify-center items-center cursor-pointer hover:bg-gray-300"
          >
            <FaPlus size={24} className="text-gray-600" />
          </label>
        </div>

        {/* Hidden File Input */}
        <input type="file" id="image-upload" className="hidden" accept="image/*" onChange={handleImageUpload} />

           {/* Loading Spinner */}
           {loading && (
          <div className="mt-4 flex justify-center">
            <FaSpinner className="animate-spin text-blue-500 text-2xl" />
          </div>
        )}
        {/* Update Button (Always Visible) */}
        <button className="bg-purple-600 text-white p-2 rounded-lg inline-flex justify-center items-center cursor-pointer mt-4 float-right" 
        onClick={handleUpdate}
        >
          Update
        </button>
      </div>
    </div>
  );
}
