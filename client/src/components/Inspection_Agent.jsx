import React, { useState } from 'react';
import './Inspection_Agent.css';

const Inspection_Agent = () => {
  const [requests, setRequests] = useState([
    { id: 1, requester: 'John Doe', property: '123 Main St', date: '2025-02-20', time: '10:00 AM' },
    { id: 2, requester: 'Jane Smith', property: '456 Elm St', date: '2025-02-22', time: '2:00 PM' },
    { id: 3, requester: 'Alice Johnson', property: '789 Pine St', date: '2025-02-25', time: '11:30 AM' },
  ]);

  const handleAccept = (id) => {
    console.log(`Accepted request ID: ${id}`);
    setRequests(requests.filter(request => request.id !== id));
  };

  const handleReject = (id) => {
    console.log(`Rejected request ID: ${id}`);
    setRequests(requests.filter(request => request.id !== id));
  };

  return (
    <div className="inspection-container_agentPortal">
      <h2>Inspection Requests</h2>
      {requests.map(request => (
        <div key={request.id} className="inspection-request-box_agentPortal">
          <div className="inspection-details_agentPortal">
            <p><strong>Requester:</strong> {request.requester}</p>
            <p><strong>Property:</strong> {request.property}</p>
            <p><strong>Date:</strong> {request.date}</p>
            <p><strong>Time:</strong> {request.time}</p>
          </div>
          <div className="inspection-actions_agentPortal">
            <button className="accept-btn_agentPortal" onClick={() => handleAccept(request.id)}>Accept</button>
            <button className="reject-btn_agentPortal" onClick={() => handleReject(request.id)}>Reject</button>
            <button className="chat-btn_agentPortal">Chat with Property Owner</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Inspection_Agent;
