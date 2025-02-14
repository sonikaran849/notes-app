import axios from "axios";

const clickhere = ()=>{
  
}
export default function NoteCard({ note, fetchNotes }) {
  const handleDelete = async () => {
    try {
      await axios.delete(`/api/notes/${note._id}`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      fetchNotes();
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg transition-transform transform hover:scale-105" onClick={clickhere}>
      <h2 className="text-xl font-bold">{note.title}</h2>
      <p className="text-gray-700 mt-2">{note.description}</p>
      {note.type === "audio" && (
        <audio controls className="mt-2 w-full">
          <source src={note.audioUrl} type="audio/ogg" />
          Your browser does not support the audio element.
        </audio>
      )}
      <button
        onClick={handleDelete}
        className="mt-4 bg-red-500 text-white px-3 py-1 rounded-md"
      >
        Delete
      </button>
    </div>
  );
}
