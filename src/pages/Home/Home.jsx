import { useEffect, useState } from "react";
import axios from "axios";
import AudioRecorder from "../../components/AudioRecorder/AudioRecorder";
import NoteCard from "../../components/NoteCard/Notecard";
import NoteModal from "../../components/NoteModal/NoteModal";
import Navbar from "../../components/Navbar/Navbar";
import {FaSearch } from "react-icons/fa";
import Popup from 'reactjs-popup';
import { api, API_BASE_URL } from "../../config/apiconfig";
import Toast from "../../components/Toast/Toast";


export default function Home( {Type}) {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showToast, setShowToast] = useState(false);
  const userId = localStorage.getItem("UserId");
  const jwt = localStorage.getItem("token");
  const [noteText, setNoteText] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filteredNotes, setFilteredNotes] = useState([]); 
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  // console.log("API Key:", apiKey);

  useEffect(() => {
    if(Type==="fav")
    {
      fetchFavNotes();
    }
    else{
      fetchNotes();
    }
  }, [Type]);

  useEffect(() => {
    handleSearch();
  }, [searchQuery, notes]); 

  const fetchNotes = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/notes/${userId}`, {
        headers: { Authorization: jwt },
      });
      console.log(res.data)
      setNotes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFavNotes = async ()=>{
    try {
      const res = await api.get(`${API_BASE_URL}/api/notes/favourites/${userId}`, {
        headers: { Authorization: jwt },
      });
      console.log(res.data);
      setNotes(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  const addNote = async () =>{
    const title = noteText.substring(0,15);
    const description = noteText;
    const type = "text";
    try {
      const res = await api.post(`${API_BASE_URL}/api/NoteData/`,{ title, description, type , userId}, {
        headers: {
          Authorization: jwt,
        },
      });
      setNotes([res.data.note, ...notes]);
      setNoteText("")
    } catch (error) {
      console.error("Error creating Note ", error);
    }
  }
  const closeModal = async () =>{
    fetchNotes()
    setSelectedNote(null)
  }
  const handleRename = async (id, newTitle) => {
    try {
      const response = await api.patch(`${API_BASE_URL}/api/NoteData/rename/${id}`, 
        { title : newTitle },
        {
          headers: { Authorization: jwt },
        }
      );
  
      if (!response.ok) throw new Error("Failed to rename note");
  
      const updatedNote = await response.json();
      setNotes((prevNotes) =>
        prevNotes.map((note) => (note._id === id ? updatedNote : note))
      );
    } catch (error) {
      console.error("Rename failed:", error);
    }
  };
  const handleDeleteNote = async (e, noteId) => {
    e.stopPropagation();
    try {
      const res = await api.delete(`${API_BASE_URL}/api/NoteData/delete/${noteId}`, {
        headers: { Authorization: jwt },
      });
      console.log("Deleted:", res);
      fetchNotes(); 
    } catch (err) {
      console.error("Error deleting note", err);
    }
  };

  const handleSort = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);

    const sortedNotes = [...notes].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);

      return newOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    setNotes(sortedNotes);
  };
  const handleSearch = () => {
    const query = searchQuery.toLowerCase().trim();
    if (query === "") {
      setFilteredNotes(notes);
      return;
    }

    const filtered = notes.filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.description.toLowerCase().includes(query)
    );

    setFilteredNotes(filtered);
  }; 

  const addAudioNote = async (transcript, audioBlob) => {
    if(!transcript){
      console.log(transcript)
      setShowToast(true);
      return;
    }
    const formData = new FormData();
    
    formData.append("title", transcript.substring(0,15));
    formData.append("description", transcript);
    formData.append("type", "audio");
    formData.append("audio", audioBlob, "audio.webm");
    formData.append("userId", userId);

    try {
      const res = await api.post(`${API_BASE_URL}/api/notes/audio`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: jwt,
        },
      });
      setNotes([res.data.newNote, ...notes]);
    } catch (err) {
      console.error("Error uploading audio:", err);
    }
  };

  return (
    <div className="flex">
      <Navbar />
      <div className="flex-1 p-6 ml-64 mb-35">
        {/* Search Bar */}
        <div className="flex justify-between items-center mb-4">
            <div className="flex px-4 py-3 rounded-md border-2 border-gray-200 overflow-hidden w-2/3 mx-auto font-[sans-serif]">
              <input 
              type="text" 
              placeholder="Search"
              className="w-full outline-none bg-transparent text-gray-600 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} />
              <FaSearch size={20}  className="float-left text-gray-300" />
            </div>
           <button onClick={handleSort} className="bg-gray-200 px-4 py-2 rounded-md">
            Sort {sortOrder === "asc" ? "Oldest" : "Newest"}
          </button>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredNotes.map((note) => (
              <NoteCard 
              key={note._id} 
              note={note} 
              fetchNotes={fetchNotes} 
              onClick={() => setSelectedNote(note)} 
              onDelete={(e) => handleDeleteNote(e, note._id)}
              onRename={(id, newTitle)=> handleRename(id,newTitle)}
              />
            ))}
        </div>
        
        {selectedNote && <NoteModal note={selectedNote} onClose={closeModal} />}

          {/* Bottom Input Section */}
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white shadow-2xl rounded-2xl p-4 w-2/3 max-w-[600px] flex items-center gap-3 border-gray-800 ml-30">
            {/* Textarea (Shorter) */}
            <textarea
              className="w-full border-gray-800 rounded-lg text-sm resize-none outline-none"
              placeholder="Type a note..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              rows={2} // Reduced height
            />

            {/* Mic (Audio Recorder) to the Right */}
            {!noteText && <AudioRecorder onSave={(transcript, audioBlob) => addAudioNote(transcript, audioBlob)} />}

            {/* Add Note Button (When Text Exists) */}
            {noteText && (
              <button 
                className="bg-purple-600 text-white px-4 py-2 rounded-lg w-40 text-center whitespace-nowrap"
                onClick={addNote}
              >
                Add Note
              </button>
            )}
          </div>
          </div>
          {showToast && <Toast message="Didn't recognise, record again" color={"bg-red-100 text-red-800"} onClose={() => setShowToast(false)} />}
    </div>
  );
}
