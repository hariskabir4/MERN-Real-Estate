// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useUserContext } from "../Usercontext";
// import "./Navbar.css";
// import axios from "axios";

// const Navbar = () => {
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const navigate = useNavigate();
//   const { user, logout } = useUserContext(); // Access user info & logout function
//   const [unreadCount, setUnreadCount] = useState(0);

//   useEffect(() => {
//     const fetchUnreadCount = async () => {
//       if (user && user.id) {
//         try {
//           const response = await axios.get(`http://localhost:5000/api/chat/unread/${user.id}`);
//           setUnreadCount(response.data.count);
//         } catch (error) {
//           console.error('Error fetching unread count:', error);
//         }
//       }
//     };

//     fetchUnreadCount();
//     // Set up interval to check for new messages
//     const interval = setInterval(fetchUnreadCount, 10000);
//     return () => clearInterval(interval);
//   }, [user]);

//   const toggleDropdown = () => {
//     setDropdownOpen(!dropdownOpen);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("authToken"); // Clear token from local storage
//     logout(); // Reset user state
//     navigate('/'); // Navigate to home page
//   };

//   const handlehandleVeiwOffers = () => {
//     navigate("/veiw-offers");
//   };

//   const handlehandleVeiwMyOffers = () => {
//     navigate("/my-offers");
//   };

//   const HandleAgentLogin = () => {
//     navigate("/AgentPortal");
//   };

//   const handleChatClick = (e) => {
//     e.preventDefault();
    
//     if (!user || !user.id) {
//       console.log("User not authenticated, redirecting to login");
//       navigate('/login', { 
//         state: { 
//           from: '/chat',
//           intent: 'chat'
//         } 
//       });
//       return;
//     }

//     // Navigate to the chat page with the user's ID
//     console.log("Navigating to chat with user:", user); // Debug log
//     navigate(`/chat/${user.id}/chats`);
//   };

//   return (
//     <div>
//       <nav className="navbar">
//         <div className="logo">Bunyaad</div>
//         <ul className="nav-links">
//           <li className="nav-item">
//             <Link to="/" className="nav-link">Home</Link>
//           </li>
//           <li className="nav-item">
//             <Link to="/about" className="nav-link">About</Link>
//           </li>
//           <li className="nav-item">
//             <Link to="/services" className="nav-link">Services</Link>
//           </li>
//           <li className="nav-item">
//   <div className="nav-link" onClick={HandleAgentLogin}>Agent Portal</div>
// </li>

//           <li className="nav-item">
//             <Link to="/contact" className="nav-link">Contact</Link>
//           </li>
//           <li className="nav-item">
//             <div 
//               onClick={handleChatClick} 
//               className="nav-link" 
//               style={{ cursor: 'pointer', position: 'relative' }}
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fff" width="24px" height="24px">
//                 <path d="M12 0C5.373 0 0 4.373 0 9.75c0 3.97 3.089 7.367 7.358 8.683v3.717a.75.75 0 0 0 1.207.622l4.107-3.075c.434.03.872.048 1.328.048 6.627 0 12-4.373 12-9.75S18.627 0 12 0zm.022 14.25H6.657a.657.657 0 1 1 0-1.315h5.365a.657.657 0 1 1 0 1.315zm4.82-3.785H6.657a.657.657 0 1 1 0-1.315h10.186a.657.657 0 1 1 0 1.315z" />
//               </svg>
//               {unreadCount > 0 && (
//                 <span className="unread-badge" style={{
//                   position: 'absolute',
//                   top: '-8px',
//                   right: '-8px',
//                   background: '#ff4444',
//                   color: 'white',
//                   borderRadius: '50%',
//                   padding: '2px 6px',
//                   fontSize: '12px',
//                   minWidth: '20px',
//                   textAlign: 'center'
//                 }}>
//                   {unreadCount}
//                 </span>
//               )}
//             </div>
//           </li>
//           <li className="nav-item user-profile" onClick={toggleDropdown}>
//             <div className="user-info">
//               {user ? (
//                 <>
//                   <span className="username">Welcome, {user.name}!</span>
//                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fff" width="24px" height="24px">
//                     <path d="M12 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 14c-5.523 0-10 4.477-10 10a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1c0-5.523-4.477-10-10-10z" />
//                   </svg>
//                   {dropdownOpen && (
//                     <div className="dropdown-menu">
//                       <Link to="/my-listings" className="dropdown-item">My Listings</Link>
//                       <div className="dropdown-item" onClick={handlehandleVeiwOffers}>View offers</div>
//                       <div className="dropdown-item" onClick={handlehandleVeiwMyOffers}>Offers Placed</div>
//                       <div className="dropdown-item" onClick={() => navigate('/onsiteInspectionRequestForm')}>Onsite Property <br /> Valuation</div>
//                       <div className="dropdown-item" onClick={() => navigate('/onsiteInspectionResult')}>View Onsite <br />Inspection<br />Result</div>
//                       <div className="dropdown-item" onClick={() => navigate('/AIPropertyValuation')}>AI Property <br /> Valuation</div>
//                       <div className="dropdown-item" onClick={HandleAgentLogin}>Agent Portal</div>
//                       <div className="dropdown-item" onClick={handleLogout}>Log Out</div>
//                     </div>
//                   )}
//                 </>
//               ) : (
//                 <>
//                   <span>User</span>
//                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fff" width="24px" height="24px">
//                     <path d="M12 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 14c-5.523 0-10 4.477-10 10a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1c0-5.523-4.477-10-10-10z" />
//                   </svg>
//                 </>
//               )}
//             </div>
//           </li>
//         </ul>
//       </nav>
//     </div>
//   );
// };

// export default Navbar;









import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../Usercontext"; // Import UserContext
import "./Navbar.css";
import axios from "axios";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useUserContext(); // Access user info & logout function
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (user && user.id) {
        try {
          const response = await axios.get(`http://localhost:5000/api/chat/unread/${user.id}`);
          setUnreadCount(response.data.count);
        } catch (error) {
          console.error('Error fetching unread count:', error);
        }
      }
    };

    fetchUnreadCount();
    // Set up interval to check for new messages
    const interval = setInterval(fetchUnreadCount, 10000);
    return () => clearInterval(interval);
  }, [user]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Clear token from local storage
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

  const handleChatClick = (e) => {
    e.preventDefault();
    
    if (!user || !user.id) {
      console.log("User not authenticated, redirecting to login");
      navigate('/login', { 
        state: { 
          from: '/chat',
          intent: 'chat'
        } 
      });
      return;
    }

    // Navigate to the chat page with the user's ID
    console.log("Navigating to chat with user:", user); // Debug log
    navigate(`/chat/${user.id}/chats`);
  };

  return (
    <div>
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
            <div 
              onClick={handleChatClick} 
              className="nav-link" 
              style={{ cursor: 'pointer', position: 'relative' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fff" width="24px" height="24px">
                <path d="M12 0C5.373 0 0 4.373 0 9.75c0 3.97 3.089 7.367 7.358 8.683v3.717a.75.75 0 0 0 1.207.622l4.107-3.075c.434.03.872.048 1.328.048 6.627 0 12-4.373 12-9.75S18.627 0 12 0zm.022 14.25H6.657a.657.657 0 1 1 0-1.315h5.365a.657.657 0 1 1 0 1.315zm4.82-3.785H6.657a.657.657 0 1 1 0-1.315h10.186a.657.657 0 1 1 0 1.315z" />
              </svg>
              {unreadCount > 0 && (
                <span className="unread-badge" style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  background: '#ff4444',
                  color: 'white',
                  borderRadius: '50%',
                  padding: '2px 6px',
                  fontSize: '12px',
                  minWidth: '20px',
                  textAlign: 'center'
                }}>
                  {unreadCount}
                </span>
              )}
            </div>
          </li>
          <li className="nav-item user-profile" onClick={toggleDropdown}>
            <div className="user-info">
              {user ? (
                <>
                  <span className="username">Welcome, {user.name}!</span>
                  {/* <button onClick={handleLogout} className="logout-btn">Logout</button> */}
                  {dropdownOpen && (
                    <div className="dropdown-menu">
                      <Link to="/my-listings" className="dropdown-item">My Listings</Link>
                      <div className="dropdown-item" onClick={handlehandleVeiwOffers}>Veiw offers</div>
                      <div className="dropdown-item" onClick={handlehandleVeiwMyOffers}>Offers Placed</div>
                      <div className="dropdown-item" onClick={() => navigate('/onsiteInspectionRequestForm')}>Onsite Property <br /> Valuation</div>
                      <div className="dropdown-item" onClick={() => navigate('/onsiteInspectionResult')}> View Onsite <br />Inspection<br />Result</div>
                      <div className="dropdown-item" onClick={() => navigate('/AIPropertyValuation')}>AI Property <br /> Valuation</div>
                      <div className="dropdown-item" onClick={HandleAgentLogin}>Agent Portal</div>
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
                <Link to="/my-listings" className="dropdown-item">My Listings</Link>
                <div className="dropdown-item" onClick={handlehandleVeiwOffers}>Veiw offers</div>
                <div className="dropdown-item" onClick={handlehandleVeiwMyOffers}>Offers Placed</div>
                <div className="dropdown-item" onClick={() => navigate('/onsiteInspectionRequestForm')}>Onsite Property <br /> Valuation</div>
                <div className="dropdown-item" onClick={() => navigate('/onsiteInspectionResult')}> View Onsite <br />Inspection<br />Result</div>
                <div className="dropdown-item" onClick={() => navigate('/AIPropertyValuation')}>AI Property <br /> Valuation</div>
                <div className="dropdown-item" onClick={HandleAgentLogin}>Agent Portal</div>
                <div className="dropdown-item" onClick={handleLogout}>Log Out</div>
              </div>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;