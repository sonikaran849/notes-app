import { useEffect, useState } from "react";
import axios from "axios";

import Navbar from "../../components/Navbar/Navbar";
import AudioRecorder from "../../components/AudioRecorder/AudioRecorder";
import NoteCard from "../../components/NoteCard/Notecard";

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await axios.get("http://localhost:7777/api/notes/67af724d2b03ec0c3de62c16", {
        headers: { Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YWY3MjRkMmIwM2VjMGMzZGU2MmMxNiIsImlhdCI6MTczOTU1NTIxNCwiZXhwIjoxNzM5NzI4MDE0fQ.wBM7nRSpZcuqUMNjV0DQri7P1oToMCkxunh5oK-WlgQ" },
      });
      setNotes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addNote = async () => {
    try {
      const res = await axios.post(
        "/api/notes/create",
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
  const clickhere = ()=>{
    console.log("i am here ")
  }

  const addAudioNote = async (transcript) => {
    try {
      const res = await axios.post(
        "/api/notes/create",
        { title: "Audio Note", content: transcript, type: "audio" },
        { headers: { Authorization: localStorage.getItem("token") } }
      );
      setNotes([...notes, res.data]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex">
      <Navbar /> {/* Sidebar is now included here */}
      
      {/* Main Content */}
      <div className="ml-64 p-6 w-full">
        <h1 className="text-2xl font-bold mb-4">My Notes</h1>

        {/* Note Input */}
        <div className="mb-4 p-4 bg-white shadow-md rounded-lg">
          <input
            className="border p-2 w-full mb-2 rounded-md"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="border p-2 w-full mb-2 rounded-md"
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={addNote}>
            Add Note
          </button>
        </div>

        {/* Audio Recorder */}
        <div className="fixed bottom-6 right-6">
          <AudioRecorder onSave={addAudioNote} />
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            // eslint-disable-next-line no-undef
            <NoteCard key={note._id} note={note} fetchNotes={fetchNotes} onClick={clickhere}/>
          ))}
        </div>
      </div>
    </div>
  );
}
