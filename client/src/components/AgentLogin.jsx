import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./AgentLogin.css";

const AgentLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await axios.post("http://localhost:5000/api/agent/login", {
                email: email.trim().toLowerCase(),
                password,
            });

            alert(response.data.message); // Show success message
            localStorage.setItem("agentToken", response.data.token); // Store token
            navigate("/AgentDashboard"); // Redirect after login
        } catch (error) {
            setError(error.response?.data?.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container-agentlogin">
            <div className="agent-portal-header-agentlogin">
                <img src="/icons8-home.svg" alt="Real Estate" className="agent-portal-icon-agentlogin" />
                <span className="agent-portal-title-agentlogin">Bunyaad Agent Portal</span>
            </div>

            <div className="login-box-agentlogin">
                <h2>Agent Login</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="input-group-agentlogin">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group-agentlogin">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="submit-btn-agentlogin" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
                <p>
                    Join our trusted network of real estate professionals{" "}
                    <Link to="/AgentPortal/Registration" className="redirect-link-agentlogin">Register today!</Link>
                </p>
            </div>
        </div>
    );
};

export default AgentLogin;
