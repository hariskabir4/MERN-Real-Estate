
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AgentContext = createContext();

export const AgentProvider = ({ children }) => {
  const [agent, setAgent] = useState(null);

  useEffect(() => {
    const fetchAgent = async () => {
      const token = localStorage.getItem("agentToken");
      if (!token) return;

      try {
        const res = await axios.get("http://localhost:5000/api/agent/agent-details", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAgent(res.data); // set agent name, email, city
      } catch (err) {
        console.error("Fetch agent error", err);
        localStorage.removeItem("agentToken");
      }
    };

    fetchAgent();
  }, []);

  const logout = () => {
    localStorage.removeItem("agentToken");
    setAgent(null);
  };

  return (
    <AgentContext.Provider value={{ agent, setAgent, logout }}>

      {children}
    </AgentContext.Provider>
  );
};

export const useAgentContext = () => useContext(AgentContext);
