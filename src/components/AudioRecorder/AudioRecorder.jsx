import { useState, useRef } from "react";

export default function AudioRecorder({ onSave }) {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recognitionRef = useRef(null);
  const transcriptRef = useRef(""); // ✅ Stores full transcript
  const [audioBlob, setAudioBlob] = useState(null);

  const startRecording = () => {
    setIsRecording(true);
    audioChunksRef.current = [];
    transcriptRef.current = ""; // ✅ Reset transcript on new recording
    setAudioBlob(null);

    // 🎙 Start Speech Recognition
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.continuous = true; // ✅ Ensures continuous speech recognition
    recognition.interimResults = true; // ✅ Shows live transcription updates

    recognition.onresult = (event) => {
      let finalTranscript = transcriptRef.current;
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += " " + event.results[i][0].transcript; // ✅ Append full sentence
        }
      }

      transcriptRef.current = finalTranscript.trim(); // ✅ Save final transcript properly
      console.log("🎤 Updated Transcript:", transcriptRef.current);
    };

    recognition.onerror = (event) => {
      console.error("❌ Speech Recognition Error:", event.error);
    };

    recognition.onend = () => {
      console.log("🔄 Speech recognition stopped.");
    };

    recognition.start();
    recognitionRef.current = recognition;

    // 🎤 Start Audio Recording
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
    });
  };

  const stopRecording = () => {
    setIsRecording(false);

    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    // ✅ Save transcript & audio after stopping
    setTimeout(() => {
      if (audioChunksRef.current.length > 0) {
        const finalAudioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        console.log("📥 Final Audio Blob:", finalAudioBlob, "Size:", finalAudioBlob.size);
        setAudioBlob(finalAudioBlob);

        console.log("📜 Final Transcript Sent to Parent:", transcriptRef.current);
        onSave(transcriptRef.current.trim(), finalAudioBlob); // ✅ Pass latest transcript
      }
    }, 500);
  };

  return (
    <div>
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className="bg-purple-600 text-white p-2 rounded-lg inline-flex shrink-0 justify-center items-center cursor-pointer float-right w-40 text-center whitespace-nowrap"
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
    </div>
  );
}
