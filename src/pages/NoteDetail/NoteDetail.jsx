import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function NoteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await axios.get(`/api/notes/${id}`, {
          headers: { Authorization: localStorage.getItem("token") },
        });
        setNote(res.data);
      } catch (err) {
        console.error("Error fetching note:", err);
        setError("Failed to load note.");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/notes/${id}`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      navigate("/notes");
    } catch (err) {
      console.error("Error deleting note:", err);
      setError("Failed to delete note.");
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!note) return <p className="text-center text-gray-500">Note not found.</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold">{note.title}</h2>
      <p className="text-gray-700 mt-3">{note.content}</p>

      {note.type === "audio" && note.audioUrl && (
        <div className="mt-4">
          <audio controls>
            <source src={note.audioUrl} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      <button
        onClick={handleDelete}
        className="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Delete Note
      </button>
    </div>
  );
}
