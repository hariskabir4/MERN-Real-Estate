import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAgentContext } from "../Agentcontext"; // ensure correct path to context
import "./AgentNavbar.css";

const AgentNavbar = () => {
  const navigate = useNavigate();
  const { agent, setAgent, logout } = useAgentContext(); // added logout here
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("agentToken"); // Clear token from local storage
    logout(); // Reset user state
    navigate('/'); // Navigate to home page
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
              {agent ? (
                <>
                  <span className="username">Welcome, {agent.name}Agent!</span>
                  {dropdownOpen && (
                    <div className="dropdown-menu">
                      <Link to="/AgentPortal/agentreportpage" className="dropdown-item">
                        Inspection Reports
                      </Link>
                      <div className="dropdown-item" onClick={handleLogout}>Log Out</div>
                    </div>
                  )}
                </>
              ) : (
                <span>Guest</span>
              )}
            </div>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AgentNavbar;
