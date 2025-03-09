import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../Usercontext"; // Import UserContext
import "./AgentNavbar.css";

const AgentNavbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useUserContext(); // Access user info & logout function

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Clear token from local storage
    logout(); // Reset user state
  };

  const handlehandleVeiwOffers = () => {
    navigate("/veiw-offers");

  };

  const handlehandleVeiwMyOffers = () => {
    navigate("/my-offers");
  };

  const HandleAgentLogin = () => {
    navigate("/AgentPortal");
  };

  return (
    <div>
      <nav className="navbar">
        <div className="logo">Bunyaad Agent Portal</div>
        <ul className="nav-links">
          <li className="nav-item">
            <Link to="/AgentPortal/Home" className="nav-link">Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/AgentPortal/about" className="nav-link">About</Link>
          </li>
          <li className="nav-item">
            <Link to="/AgentPortal/services" className="nav-link">Services</Link>
          </li>
          <li className="nav-item">
            <Link to="/AgentPortal/contact" className="nav-link">Contact</Link>
          </li>
          <li className="nav-item">
            <Link to="/AgentPortal/chatpage" className="nav-link">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fff" width="24px" height="24px">
                <path d="M12 0C5.373 0 0 4.373 0 9.75c0 3.97 3.089 7.367 7.358 8.683v3.717a.75.75 0 0 0 1.207.622l4.107-3.075c.434.03.872.048 1.328.048 6.627 0 12-4.373 12-9.75S18.627 0 12 0zm.022 14.25H6.657a.657.657 0 1 1 0-1.315h5.365a.657.657 0 1 1 0 1.315zm4.82-3.785H6.657a.657.657 0 1 1 0-1.315h10.186a.657.657 0 1 1 0 1.315z" />
              </svg>
            </Link>
          </li>
          <li className="nav-item user-profile" onClick={toggleDropdown}>
            <div className="user-info">
              {user ? (
                <>
                  <span className="username">Welcome, {user.name}!</span>
                  {/* <button onClick={handleLogout} className="logout-btn">Logout</button> */}
                  {dropdownOpen && (
                    <div className="dropdown-menu">
                      <Link to="/" className="dropdown-item">Inspection Reports</Link>
                      {/* <div className="dropdown-item" onClick={handlehandleVeiwOffers}>In</div>
                      <div className="dropdown-item" onClick={handlehandleVeiwMyOffers}>Offers Placed</div> */}
                      {/* <div className="dropdown-item" onClick={HandleAgentLogin}>Agent Portal</div> */}
                      <div className="dropdown-item" onClick={handleLogout}>Log Out</div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <span >User</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fff" width="24px" height="24px">
                    <path d="M12 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 14c-5.523 0-10 4.477-10 10a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1c0-5.523-4.477-10-10-10z" />
                  </svg>
                </>
              )}
            </div>
            {dropdownOpen && (
              <div className="dropdown-menu">
                {/* <Link to="/my-listings" className="dropdown-item">My Listings</Link> */}
                <div className="dropdown-item" onClick={handlehandleVeiwOffers}>Inspection Reports</div>
                {/* <div className="dropdown-item" onClick={handlehandleVeiwMyOffers}>Offers Placed</div>
                <div className="dropdown-item" onClick={HandleAgentLogin}>Agent Portal</div> */}
                <div className="dropdown-item" onClick={handleLogout}>Log Out</div>
              </div>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AgentNavbar;
