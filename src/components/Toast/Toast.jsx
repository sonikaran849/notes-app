import { useEffect } from "react";

export default function Toast({ message, onClose , color }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000); // Auto-dismiss after 2 sec

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className= { `fixed top-6 left-1/2 transform -translate-x-1/2 ${color} px-4 py-2 rounded-lg shadow-lg animate-fade-in z-50`} >
      {message}
    </div>
  );
}
