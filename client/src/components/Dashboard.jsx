import React, { useState } from "react";
import "./Dashboard.css";
import { Navigate, useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const [inspections, setInspections] = useState([
        {
            id: "REQ12345",
            propertyType: "House",
            address: "123 Main Street",
            city: "Karachi",
            ownerName: "Ali Khan",
            accepted: false,
        },
        {
            id: "REQ67890",
            propertyType: "Apartment",
            address: "45 Ocean View",
            city: "Lahore",
            ownerName: "Sara Ahmed",
            accepted: false,
        },
    ]);

    const handleAccept = (index) => {
        const updatedInspections = [...inspections];
        updatedInspections[index].accepted = true;
        setInspections(updatedInspections);
    };

    const handleReject = (index) => {
        const updatedInspections = inspections.filter((_, i) => i !== index);
        setInspections(updatedInspections);
    };

    return (
        <div className="dashboardContainer_agntPtrl_dshbrd">
            <h2 className="dashboardHeading_agntPtrl_dshbrd">
                Agent Inspection Requests:
            </h2>
            <div className="inspectionList_agntPtrl_dshbrd">
                {inspections.length > 0 ? (
                    inspections.map((inspection, index) => (
                        <div key={inspection.id} className="inspectionCard_agntPtrl_dshbrd">
                            <div className="inspectionDetails_agntPtrl_dshbrd">
                                <p><strong>Property Type:</strong> {inspection.propertyType}</p>
                                <p><strong>Address:</strong> {inspection.address}, {inspection.city}</p>
                                <p><strong>Request ID:</strong> {inspection.id}</p>
                                <p><strong>Owner:</strong> {inspection.ownerName}</p>
                            </div>
                            <div className="inspectionActions_agntPtrl_dshbrd">
                                {!inspection.accepted ? (
                                    <>
                                        <button
                                            className="acceptBtn_agntPtrl_dshbrd"
                                            onClick={() => handleAccept(index)}
                                        >
                                            Accept
                                        </button>
                                        <button
                                            className="rejectBtn_agntPtrl_dshbrd"
                                            onClick={() => handleReject(index)}
                                        >
                                            Reject
                                        </button>

                                        <button className="chat-button" onClick={() => navigate('/AgentPortal/chatpage')}>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="1.5"
                                                stroke="currentColor"
                                                className="chat-icon"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M8.25 15h7.5M8.25 12h7.5m-10.5 9v-3.659a9.213 9.213 0 01-2.615-3.034A8.962 8.962 0 013 9.75C3 5.246 7.03 2.25 12 2.25s9 2.996 9 7.5-4.03 7.5-9 7.5c-.566 0-1.123-.039-1.667-.114A9.164 9.164 0 016.75 19.5z"
                                                />
                                            </svg>
                                            Chat
                                        </button>
                                    </>
                                ) : (
                                    <span className="acceptedTag_agntPtrl_dshbrd">Accepted</span>
                                )}
                            </div>
                            {inspection.accepted && (
                                <>
                                <div className="Accepted_agntPtrl_dshbrd">
                                    <button className="fillFormBtn_agntPtrl_dshbrd" onClick={() => navigate('/AgentPortal/onsite-inspector')}>
                                        Fill Onsite Inspection Form
                                    </button>

                                        <button className="chat-button" onClick={() => navigate('/AgentPortal/chatpage')}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            className="chat-icon"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M8.25 15h7.5M8.25 12h7.5m-10.5 9v-3.659a9.213 9.213 0 01-2.615-3.034A8.962 8.962 0 013 9.75C3 5.246 7.03 2.25 12 2.25s9 2.996 9 7.5-4.03 7.5-9 7.5c-.566 0-1.123-.039-1.667-.114A9.164 9.164 0 016.75 19.5z"
                                            />
                                        </svg>
                                        Chat
                                    </button>
                                    </div>
                                </>


                            )}
                        </div>
                    ))
                ) : (
                    <p className="noRequests_agntPtrl_dshbrd">No inspection requests available.</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
