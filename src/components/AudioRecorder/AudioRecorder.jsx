import { useState, useRef } from "react";

export default function AudioRecorder({ onSave }) {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);

  const startRecording = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser does not support speech recognition.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => setRecording(true);
    recognition.onresult = (event) => {
      const speechText = event.results[0][0].transcript;
      setTranscript(speechText);
    };
    recognition.onerror = (event) => console.error("Speech Recognition Error:", event.error);
    recognition.onend = () => setRecording(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setRecording(false);
    }
  };

  const saveNote = () => {
    if (transcript.trim()) {
      onSave(transcript);
      setTranscript("");
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-bold mb-2">Record Audio Note</h3>
      <button
        className={`px-4 py-2 ${recording ? "bg-red-500" : "bg-green-500"} text-white rounded`}
        onClick={recording ? stopRecording : startRecording}
      >
        {recording ? "Stop Recording" : "Start Recording"}
      </button>
      {transcript && (
        <div className="mt-4 p-2 bg-gray-100 rounded">
          <p className="text-gray-700">{transcript}</p>
          <button onClick={saveNote} className="mt-2 bg-blue-500 text-white px-3 py-1 rounded">
            Save Note
          </button>
        </div>
      )}
    </div>
  );
}
