import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Home from "./pages/Home/Home";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<ProtectedRoute><Home Type="home" /></ProtectedRoute>} />
        <Route path="/favourites" element={<ProtectedRoute><Home Type="fav"/></ProtectedRoute>} />
        {/* <Route path="/" element={<Home />} /> */}
      </Routes>
      
    </Router>
  );
} 



export default App;
