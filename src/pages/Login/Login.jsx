import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { api, API_BASE_URL } from "../../config/apiconfig";
import Toast from "../../components/Toast/Toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await api.post(`${API_BASE_URL}/api/auth/login`, { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("UserId",res.data.user.id)
      console.log(res.data)
      navigate("/");
    } catch (err) {
      setError("Invalid email or password");
      setShowToast(true);
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl text-center mb-6">Login</h1>
        {error && showToast && <Toast message = {error} color={"bg-red-50 text-red-800"} onClose={()=> setShowToast(false)} />}
        {/* {error && <p className="text-red-500 text-center mb-4">{error}</p>} */}
        <input
          type="email"
          className="border p-2 mb-4 w-full rounded-md"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="border p-2 mb-4 w-full rounded-md"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 w-full rounded-md"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
}
