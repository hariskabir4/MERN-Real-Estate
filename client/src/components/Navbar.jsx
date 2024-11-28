import React from "react";
import './Navbar.css';


const Navbar = () => {
  return (
    <div>
      <nav className="navbar">
        <div className="logo">My Website</div>
        <ul className="nav-links">
          <li className="nav-item">
            <a href="#home" className="nav-link">Home</a>
          </li>
          <li className="nav-item">
            <a href="#about" className="nav-link">About</a>
          </li>
          <li className="nav-item">
            <a href="#services" className="nav-link">Services</a>
          </li>
          <li className="nav-item">
            <a href="#contact" className="nav-link">Contact</a>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default Navbar;