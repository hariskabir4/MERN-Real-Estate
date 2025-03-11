import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AgentNavbar.css";

const AgentNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAgent");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="logo">Bunyaad</div>
      <ul className="nav-links">
        <li className="nav-item">
          <Link to="/" className="nav-link">Home</Link>
        </li>
        <li className="nav-item">
          <Link to="/about" className="nav-link">About</Link>
        </li>
        <li className="nav-item">
          <Link to="/services" className="nav-link">Services</Link>
        </li>
        <li className="nav-item">
          <Link to="/contact" className="nav-link">Contact</Link>
        </li>
        <li className="nav-item">
          <Link to="/chatpage" className="nav-link">Chat</Link>
        </li>

        {/* "Appraisal Requests" visible only for agents */}
        <li className="nav-item">
          <Link to="/appraisal-requests" className="nav-link">Appraisal Requests</Link>
        </li>

        <li className="nav-item user-profile">
          <div className="dropdown-menu">
            <Link to="/my-listings" className="dropdown-item">My Listings</Link>
            <Link to="/view-offers" className="dropdown-item">View Offers</Link>
            <Link to="/my-offers" className="dropdown-item">Offers Placed</Link>
            <div className="dropdown-item" onClick={handleLogout}>Log Out</div>
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default AgentNavbar;
