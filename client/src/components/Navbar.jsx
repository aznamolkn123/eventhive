import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("eventhive_token");
    const user = localStorage.getItem("eventhive_user");
    if (token) {
      setIsLoggedIn(true);
      try {
        setUserName(user ? JSON.parse(user).name : "User");
      } catch {
        setUserName("User");
      }
    } else {
      setIsLoggedIn(false);
      setUserName("");
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("eventhive_token");
    localStorage.removeItem("eventhive_user");
    setIsLoggedIn(false);
    setUserName("");
    setMenuOpen(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          {/* Logo */}
          <Link 
            to="/" 
            className="navbar-logo"
            onClick={() => setMenuOpen(false)}
          >
            <span>EventHive</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="navbar-desktop-nav-links">
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
            >
              Home
            </Link>
            <Link 
              to="/dashboard" 
              className={`nav-link ${location.pathname === "/dashboard" ? "active" : ""}`}
            >
              Events
            </Link>
          </div>
        </div>

        {/* Desktop Auth Section */}
        <div className="navbar-desktop-auth">
          {isLoggedIn ? (
            <div className="nav-links-group">
              <span className="user-greeting">Hi, {userName}</span>
              <button
                onClick={handleLogout}
                className="btn-logout"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="nav-links-group">
              <Link to="/login" className="btn-login">
                Login
              </Link>
              <Link to="/register" className="btn-get-started">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="mobile-toggle-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-overlay ${menuOpen ? "open" : ""}`}>
        <div className="overlay-backdrop" onClick={() => setMenuOpen(false)}></div>
        <div className="mobile-drawer">
          <button onClick={() => setMenuOpen(false)} className="mobile-close-btn">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <nav className="mobile-nav-links">
            <Link to="/" onClick={() => setMenuOpen(false)} className="mobile-link">Home</Link>
            <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="mobile-link">Events</Link>
            {isLoggedIn && <Link to="/my-tickets" onClick={() => setMenuOpen(false)} className="mobile-link">My Tickets</Link>}
          </nav>

          <div className="mobile-auth-footer">
            {isLoggedIn ? (
              <>
                <span className="user-greeting">Hi, {userName}</span>
                <button onClick={handleLogout} className="mobile-btn-full btn-logout">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="mobile-btn-full btn-login" style={{ border: '1px solid #e5e7eb', borderRadius: '0.75rem' }}>Login</Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="mobile-btn-full btn-get-started">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;