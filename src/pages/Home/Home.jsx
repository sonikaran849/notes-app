import { useEffect, useState } from "react";
import axios from "axios";
import NoteCard from "../components/NoteCard";

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await axios.get("/api/notes", {
        headers: { Authorization: localStorage.getItem("token") },
      });
      setNotes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addNote = async () => {
    try {
      const res = await axios.post("/api/notes/create", 
        { title, content, type: "text" },
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      setNotes([...notes, res.data]);
      setTitle("");
      setContent("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">My Notes</h1>
      <div className="mb-4">
        <input 
          className="border p-2 mr-2" 
          placeholder="Title" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
        />
        <textarea 
          className="border p-2" 
          placeholder="Content" 
          value={content} 
          onChange={(e) => setContent(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 py-2 ml-2" onClick={addNote}>Add Note</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map(note => <NoteCard key={note._id} note={note} fetchNotes={fetchNotes} />)}
      </div>
    </div>
  );
}
