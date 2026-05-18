import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [isOrganiser, setIsOrganiser] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("eventhive_token");
    const user = localStorage.getItem("eventhive_user");
    if (token) {
      setIsLoggedIn(true);
      try {
        const parsedUser = user ? JSON.parse(user) : null;
        setUserName(parsedUser?.name || "User");
        setIsOrganiser(parsedUser?.role === "organiser");
      } catch {
        setUserName("User");
        setIsOrganiser(false);
      }
    } else {
      setIsLoggedIn(false);
      setUserName("");
      setIsOrganiser(false);
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

  // Modern Hive Logo Component
  const Logo = () => (
    <div className="logo-wrapper">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 2L29 9.5V22.5L16 30L3 22.5V9.5L16 2Z" fill="url(#logo-grad)" stroke="#418d7c" strokeWidth="1.5"/>
        <path d="M16 7L24 11.5V20.5L16 25L8 20.5V11.5L16 7Z" fill="white" fillOpacity="0.2"/>
        <circle cx="16" cy="16" r="3" fill="white"/>
        <defs>
          <linearGradient id="logo-grad" x1="3" y1="2" x2="29" y2="30" gradientUnits="userSpaceOnUse">
            <stop stopColor="#418d7c"/>
            <stop offset="1" stopColor="#059669"/>
          </linearGradient>
        </defs>
      </svg>
      <span>EventHive</span>
    </div>
  );

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
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <div className="navbar-desktop-nav-links">
            <Link
              to="/"
              className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
            >
              Home
            </Link>
            {isOrganiser && (
              <Link
                to="/dashboard"
                className={`nav-link ${location.pathname === "/dashboard" ? "active" : ""}`}
              >
                Dashboard
              </Link>
            )}
          </div>
        </div>

        {/* Desktop Auth Section */}
        <div className="navbar-desktop-auth">
          {isLoggedIn ? (
            <div className="nav-links-group">
              <Link to="/my-tickets" className="nav-link">My Tickets</Link>
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
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div id="mobile-menu" className={`mobile-overlay ${menuOpen ? "open" : ""}`}>
        <div className="overlay-backdrop" onClick={() => setMenuOpen(false)}></div>
        <div className="mobile-drawer">
          <div className="mobile-drawer-top">
            <span className="mobile-logo">
               <Logo />
            </span>
            <button onClick={() => setMenuOpen(false)} className="mobile-close-btn">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mobile-menu-content">
            <nav className="mobile-nav-links">
              <Link to="/" onClick={() => setMenuOpen(false)} className="mobile-link">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                Home
              </Link>
              {isOrganiser && (
                <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="mobile-link">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                  Dashboard
                </Link>
              )}
              {isLoggedIn && (
                <Link to="/my-tickets" onClick={() => setMenuOpen(false)} className="mobile-link">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
                  My Tickets
                </Link>
              )}
            </nav>

            <div className="mobile-auth-section">
              {isLoggedIn ? (
                <>
                  <div className="mobile-user-info">
                    <div className="mobile-user-avatar">{userName.charAt(0).toUpperCase()}</div>
                    <span className="mobile-user-name">Hi, {userName}</span>
                  </div>
                  <button onClick={handleLogout} className="mobile-logout-btn">Logout</button>
                </>
              ) : (
                <div className="mobile-auth-buttons">
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="mobile-btn-outline">Login</Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)} className="mobile-btn-filled">Register</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
