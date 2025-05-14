import React, { useState } from "react";
import {Link, useNavigate, useLocation} from "react-router-dom"; 
import { useUserContext } from "../Usercontext";
import { jwtDecode } from "jwt-decode";
import "./Login.css"; 

const Login = () => {
  const { login, user } = useUserContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      const token = data.token;

      // Store token in localStorage
      localStorage.setItem("authToken", token);

      // Update user context with the token
      login(token);

      alert("Login successful!");

      // Handle redirect based on intent
      const from = location.state?.from || '/';
      const intent = location.state?.intent;
      const propertyId = location.state?.propertyId;
      
      if (intent === 'chat') {
        // Decode the token to get user ID immediately
        const decodedUser = jwtDecode(token);
        
        if (propertyId) {
          // If we have a propertyId, fetch the property details first
          fetch(`http://localhost:5000/api/property/${propertyId}`)
            .then(res => res.json())
            .then(property => {
              if (property && property.userId) {
                // Navigate to chat with both user IDs
                navigate(`/chat/${decodedUser.id}/${property.userId}`);
              } else {
                console.error('Property owner information not available');
                navigate(from);
              }
            })
            .catch(err => {
              console.error('Error fetching property details:', err);
              navigate(from);
            });
        } else {
          // If no propertyId, just go to the general chat page
          navigate(`/chat/${decodedUser.id}/chats`);
        }
      } else {
        // Otherwise, go to the original destination
        navigate(from);
      }
    } catch (err) {
      setError(err.message);
      alert(err.message);
      console.error("Login error:", err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-btn">Login</button>
        </form>
        <p>
          Don't you have an account?{" "}
          <Link to="/signup" className="redirect-link">Create Account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;