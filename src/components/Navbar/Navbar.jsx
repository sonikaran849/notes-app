import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaHome, FaStar } from "react-icons/fa";

export default function Navbar() {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.clear()
    navigate("/login");
  };

  return (
    <div className="p-4 m-4 h-screen w-64 bg-white border border-gray-300 rounded-2xl  text-purple-800 flex flex-col  fixed left-0 top-0 border-black-950">
      <h1 className="text-2xl font-bold mb-6">AI Notes</h1>
      <nav className="flex-1">
        <Link
          to="/"
          className={`flex items-center space-x-2 p-3 rounded-md hover:bg-purple-100 ${
            location.pathname === "/" ? "bg-purple-100" : ""
          }`}
        >
          <FaHome />
          <span>Home</span>
        </Link>
        <Link
          to="/favourites"
          className={`flex items-center space-x-2 p-3 rounded-md hover:bg-purple-100 ${
            location.pathname === "/favourites" ? "bg-purple-100" : ""
          }`}
        >
          <FaStar />
          <span>Favourites</span>
        </Link>
      </nav>
      {token && (
        <button onClick={handleLogout} className="w-full bg-purple-100 mb-2 py-2 rounded-md cursor-pointer hover:bg-purple-600 hover:text-white transition-colors duration-300">
          Logout
        </button>
      )}
    </div>
  );
}
