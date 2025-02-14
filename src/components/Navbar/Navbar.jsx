import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="w-64 h-screen rounded-3xl border-b-gray-500 p-6 fixed flex flex-col justify-between">
      {/* Logo */}
      <div>
        <h2 className="text-xl font-bold text-purple-800 mb-6">AI Notes</h2>
        {/* Navigation Links */}
        <nav className="space-y-3">
          <Link to="/" className="block px-4 py-2 text-purple-700 bg-purple-200 rounded-lg">Home</Link>
          <Link to="/favourites" className="block px-4 py-2 text-gray-700 hover:bg-purple-200 rounded-lg">Favourites</Link>
        </nav>
      </div>

      {/* Logout Button */}
      {token && (
        <button
          onClick={handleLogout}
          className="mt-auto bg-red-500 text-white px-4 py-2 rounded-md w-full"
        >
          Logout
        </button>
      )}
    </div>
  );
}
