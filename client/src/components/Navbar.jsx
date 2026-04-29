import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("eventhive_token");
    const user = localStorage.getItem("eventhive_user");
    if (token) {
      setIsLoggedIn(true);
      setUserName(user ? JSON.parse(user).name : "User");
    } else {
      setIsLoggedIn(false);
      setUserName("");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("eventhive_token");
    localStorage.removeItem("eventhive_user");
    setIsLoggedIn(false);
    setUserName("");
    navigate("/login");
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          EventHive
        </Link>

        <button className="navbar-toggle" onClick={toggleMenu}>
          <span className="navbar-toggle-icon"></span>
        </button>

        <div className={`navbar-links ${menuOpen ? "active" : ""}`}>
          <Link to="/" className="navbar-link" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link to="/events" className="navbar-link" onClick={() => setMenuOpen(false)}>
            Events
          </Link>

          <div className="navbar-auth">
            {isLoggedIn ? (
              <>
                <span className="navbar-username">{userName}</span>
                <button onClick={handleLogout} className="navbar-logout-btn">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="navbar-link" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="navbar-link" onClick={() => setMenuOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
