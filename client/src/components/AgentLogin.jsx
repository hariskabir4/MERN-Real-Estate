import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./AgentLogin.css";

const AgentLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("User logged in with:", { email, password });
    };

    return (
        <div className="login-container-agentlogin">

            <div className="agent-portal-header-agentlogin">
                <img src="/icons8-home.svg" alt="Real Estate" className="agent-portal-icon-agentlogin" />
                <span className="agent-portal-title-agentlogin">Bunyaad Agent Portal</span>
            </div>

            <div className="login-box-agentlogin">
                <h2>Agent Login</h2>
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
                    <button type="submit" className="submit-btn-agentlogin">Login</button>
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
