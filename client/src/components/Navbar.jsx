


// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useUserContext } from "../Usercontext"; // Assuming you have a UserContext for managing global user state
// import "./Navbar.css";

// const Navbar = () => {
//   const { user, logout } = useUserContext(); // Access user and logout from context
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const navigate = useNavigate();

//   const toggleDropdown = () => {
//     setDropdownOpen(!dropdownOpen);
//   };

//   const handleLogout = () => {
//     logout(); // Clear user context
//     localStorage.removeItem("authToken"); // Remove token from localStorage
//     navigate("/login"); // Redirect to login page
//   };

//   return (
//     <nav className="navbar">
//       <div className="logo">Bunyaad</div>
//       <ul className="nav-links">
//         <li className="nav-item">
//           <Link to="/" className="nav-link">Home</Link>
//         </li>
//         <li className="nav-item">
//           <Link to="/about" className="nav-link">About</Link>
//         </li>
//         <li className="nav-item">
//           <Link to="/services" className="nav-link">Services</Link>
//         </li>
//         <li className="nav-item">
//           <Link to="/contact" className="nav-link">Contact</Link>
//         </li>
//         <li className="nav-item user-profile" onClick={toggleDropdown}>
//           <div className="user-info">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               viewBox="0 0 24 24"
//               fill="#fff"
//               width="24px"
//               height="24px"
//             >
//               <path d="M12 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 14c-5.523 0-10 4.477-10 10a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1c0-5.523-4.477-10-10-10z" />
//             </svg>
//             <span>{user ? user.name : "User"}</span>
//              {console.log(user)/* Dynamically show user name */}
//           </div>
//           {dropdownOpen && (
//             <div className="dropdown-menu">
//               <Link to="/my-listings" className="dropdown-item">My Listings</Link>
//               <div className="dropdown-item" onClick={handleLogout}>
//                 Log Out
//               </div>
//             </div>
//           )}
//         </li>
//       </ul>
//     </nav>
//   );
// };

// export default Navbar;


//   // navbar with name 
//   import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useUserContext } from "../Usercontext"; // Assuming you have a UserContext for managing global user state
// import "./Navbar.css";

// const Navbar = () => {
//   const { user, logout } = useUserContext(); // Access user and logout from context
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const navigate = useNavigate();

//   const toggleDropdown = () => {
//     setDropdownOpen(!dropdownOpen);
//   };

//   const handleLogout = () => {
//     logout(); // Clear user context
//     localStorage.removeItem("authToken"); // Remove token from localStorage
//     navigate("/login"); // Redirect to login page
//   };

//   // Optional: Check if there's a user in localStorage and update context on page load
//   useEffect(() => {
//     const storedUser = JSON.parse(localStorage.getItem("user"));
//     if (storedUser) {
//       // Set user in context if available in localStorage
//       // Assuming your context has a way to set the user
//       // For example: setUser(storedUser);
//     }
//   }, []);

//   return (
//     <nav className="navbar">
//       <div className="logo">Bunyaad</div>
//       <ul className="nav-links">
//         <li className="nav-item">
//           <Link to="/" className="nav-link">Home</Link>
//         </li>
//         <li className="nav-item">
//           <Link to="/about" className="nav-link">About</Link>
//         </li>
//         <li className="nav-item">
//           <Link to="/services" className="nav-link">Services</Link>
//         </li>
//         <li className="nav-item">
//           <Link to="/contact" className="nav-link">Contact</Link>
//         </li>
//         <li className="nav-item user-profile" onClick={toggleDropdown}>
//           <div className="user-info">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               viewBox="0 0 24 24"
//               fill="#fff"
//               width="24px"
//               height="24px"
//             >
//               <path d="M12 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 14c-5.523 0-10 4.477-10 10a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1c0-5.523-4.477-10-10-10z" />
//             </svg>
//             <span>{user && user.name ? user.name : "User"}</span>
//           </div>
//           {dropdownOpen && (
//             <div className="dropdown-menu">
//               <Link to="/my-listings" className="dropdown-item">My Listings</Link>
//               <div className="dropdown-item" onClick={handleLogout}>
//                 Log Out
//               </div>
//             </div>
//           )}
//         </li>
//       </ul>
//     </nav>
//   );
// };

// export default Navbar;





//new navbar
import React from "react";
import { Link } from "react-router-dom";
import { useUserContext } from "../Usercontext"; // Import UserContext
import "./Navbar.css"; // Import styles if needed

const Navbar = () => {
  const { user, logout } = useUserContext(); // Access user info & logout function

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Clear token from local storage
    logout(); // Reset user state
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="logo">RealEstate</Link>
      </div>
      
      <div className="nav-right">
        {user ? (
          <>
            <span className="username">Welcome, {user.name}!</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/signup" className="nav-link">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
