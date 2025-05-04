

// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./Dashboard.css";

// const Dashboard = () => {
//     const navigate = useNavigate();
//     const [inspections, setInspections] = useState([]);

//     useEffect(() => {
//         const fetchRequests = async () => {
//             const token = localStorage.getItem("agentToken");

//             console.log("🔹 Token before request:", token);

//             if (!token) {
//                 console.error("❌ No token found in localStorage");
//                 return;
//             }

//             // Decode token to check expiration
//             try {
//                 const payload = JSON.parse(atob(token.split(".")[1]));
//                 const expiryDate = new Date(payload.exp * 1000);
//                 console.log("🔹 Token Expiration:", expiryDate);

//                 if (expiryDate < new Date()) {
//                     console.error("❌ Token has expired!");
//                     return;
//                 }
//             } catch (error) {
//                 console.error("❌ Invalid Token Format:", error);
//                 return;
//             }

//             try {
//                 const response = await fetch("http://localhost:5000/api/onsite-requests/pending", {
//                     method: "GET",
//                     headers: {
//                         "Authorization": `Bearer ${token}`,
//                         "Content-Type": "application/json",
//                     },
//                 });

//                 console.log("🔹 Response Status:", response.status);
//                 const data = await response.json();

//                 if (response.ok) {
//                     setInspections(data);
//                 } else {
//                     console.error("❌ Error fetching inspections:", data.error);
//                 }
//             } catch (error) {
//                 console.error("❌ Network error:", error);
//             }
//         };

//         fetchRequests();
//     }, []);

//     const handleAccept = async (id) => {
//         const token = localStorage.getItem("agentToken");
//         if (!token) {
//             console.error("❌ No token found in localStorage");
//             return;
//         }
    
//         try {
//             const response = await fetch(`http://localhost:5000/api/onsite-requests/accept/${id}`, {
//                 method: "POST",
//                 headers: {
//                     "Authorization": `Bearer ${token}`,
//                     "Content-Type": "application/json",
//                 },
//             });
    
//             if (response.ok) {
//                 setInspections((prev) =>
//                     prev.map((inspection) =>
//                         inspection._id === id ? { ...inspection, status: "Accepted" } : inspection
//                     )
//                 );
    
//                 // 🎯 Immediately navigate to form with the requestId
//                 navigate('/AgentPortal/onsite-inspector', { state: { requestId: id } });
//             } else {
//                 console.error("❌ Error accepting request");
//             }
//         } catch (error) {
//             console.error("❌ Network error:", error);
//         }
//     };
    

//     const handleReject = async (id) => {
//         const token = localStorage.getItem("agentToken");
//         if (!token) {
//             console.error("❌ No token found in localStorage");
//             return;
//         }

//         try {
//             const response = await fetch(`http://localhost:5000/api/onsite-requests/reject/${id}`, {
//                 method: "POST",
//                 headers: {
//                     "Authorization": `Bearer ${token}`,
//                     "Content-Type": "application/json",
//                 },
//             });

//             if (response.ok) {
//                 setInspections((prev) => prev.filter((inspection) => inspection._id !== id));
//             } else {
//                 console.error("❌ Error rejecting request");
//             }
//         } catch (error) {
//             console.error("❌ Network error:", error);
//         }
//     };

//     return (
//         <div className="dashboardContainer">
//             <h2 className="dashboardHeading">Agent Inspection Requests</h2>
//             <div className="inspectionList">
//                 {inspections.length > 0 ? (
//                     inspections.map((inspection) => (
//                         <div key={inspection._id} className="inspectionCard">
//                             <div className="inspectionDetails">
//                                 <p><strong>Property Type:</strong> {inspection.propertyType}</p>
//                                 <p><strong>Address:</strong> {inspection.address}, {inspection.city}</p>
//                                 <p><strong>Request ID:</strong> {inspection._id}</p>
//                             </div>
//                             <div className="inspectionActions">
//                                 {inspection.status !== "Accepted" ? (
//                                     <>
//                                         <button className="acceptBtn" onClick={() => handleAccept(inspection._id)}>
//                                             Accept
//                                         </button>
//                                         <button className="rejectBtn" onClick={() => handleReject(inspection._id)}>
//                                             Reject
//                                         </button>
//                                         <button className="chat-button" onClick={() => navigate('/AgentPortal/chatpage')}>
//                                             Chat
//                                         </button>
//                                     </>
//                                 ) : (
//                                     <span className="acceptedTag">Accepted</span>
//                                 )}
//                             </div>
//                             {inspection.status === "Accepted" && (
//                                 <div className="Accepted">
//                                     <button
//                                         className="fillFormBtn"
//                                         onClick={() => navigate('/AgentPortal/onsite-inspector', { state: { requestId: inspection._id } })}
//                                     >
//                                         Fill Onsite Inspection Form
//                                     </button>
//                                     <button className="chat-button" onClick={() => navigate('/AgentPortal/chatpage')}>
//                                         Chat
//                                     </button>
//                                 </div>
//                             )}
//                         </div>
//                     ))
//                 ) : (
//                     <p className="noRequests">No inspection requests available.</p>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default Dashboard;






import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
    const navigate = useNavigate();
    const [inspections, setInspections] = useState([]);

    useEffect(() => {
        const fetchRequests = async () => {
            const token = localStorage.getItem("agentToken");

            console.log("🔹 Token before request:", token);

            if (!token) {
                console.error("❌ No token found in localStorage");
                return;
            }

            // Decode token to check expiration
            try {
                const payload = JSON.parse(atob(token.split(".")[1]));
                const expiryDate = new Date(payload.exp * 1000);
                console.log("🔹 Token Expiration:", expiryDate);

                if (expiryDate < new Date()) {
                    console.error("❌ Token has expired!");
                    return;
                }
            } catch (error) {
                console.error("❌ Invalid Token Format:", error);
                return;
            }

            try {
                const response = await fetch("http://localhost:5000/api/onsite-requests/pending", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                console.log("🔹 Response Status:", response.status);
                const data = await response.json();

                if (response.ok) {
                    setInspections(data);
                } else {
                    console.error("❌ Error fetching inspections:", data.error);
                }
            } catch (error) {
                console.error("❌ Network error:", error);
            }
        };

        fetchRequests();
    }, []);

    const handleAccept = async (id) => {
        const token = localStorage.getItem("agentToken");
        if (!token) {
            console.error("❌ No token found in localStorage");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/onsite-requests/accept/${id}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                setInspections((prev) =>
                    prev.map((inspection) =>
                        inspection._id === id ? { ...inspection, status: "Accepted" } : inspection
                    )
                );
                navigate('/AgentPortal/onsite-inspector', { state: { requestId: id } });
            } else {
                console.error("❌ Error accepting request");
            }
        } catch (error) {
            console.error("❌ Network error:", error);
        }
    };

    const handleReject = async (id) => {
        const token = localStorage.getItem("agentToken");
        if (!token) {
            console.error("❌ No token found in localStorage");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/onsite-requests/reject/${id}`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                setInspections((prev) => prev.filter((inspection) => inspection._id !== id));
            } else {
                console.error("❌ Error rejecting request");
            }
        } catch (error) {
            console.error("❌ Network error:", error);
        }
    };

    return (
        <div className="App">
            <div className="home-container">
                <div className="dashboardContainer">
                    <h2 className="dashboardHeading">Agent Inspection Requests</h2>
                    <div className="inspectionList">
                        {inspections.length > 0 ? (
                            inspections.map((inspection) => (
                                <div key={inspection._id} className="inspectionCard">
                                    <div className="inspectionDetails">
                                        <p><strong>Property Type:</strong> {inspection.propertyType}</p>
                                        <p><strong>Address:</strong> {inspection.address}, {inspection.city}</p>
                                        <p><strong>Request ID:</strong> {inspection._id}</p>
                                    </div>
                                    <div className="inspectionActions">
                                        {inspection.status !== "Accepted" ? (
                                            <>
                                                <button className="acceptBtn" onClick={() => handleAccept(inspection._id)}>
                                                    Accept
                                                </button>
                                                <button className="rejectBtn" onClick={() => handleReject(inspection._id)}>
                                                    Reject
                                                </button>
                                                <button className="chat-button" onClick={() => navigate('/AgentPortal/chatpage')}>
                                                    Chat
                                                </button>
                                            </>
                                        ) : (
                                            <span className="acceptedTag">Accepted</span>
                                        )}
                                    </div>
                                    {inspection.status === "Accepted" && (
                                        <div className="Accepted">
                                            <button
                                                className="fillFormBtn"
                                                onClick={() => navigate('/AgentPortal/onsite-inspector', { state: { requestId: inspection._id } })}
                                            >
                                                Fill Onsite Inspection Form
                                            </button>
                                            <button className="chat-button" onClick={() => navigate('/AgentPortal/chatpage')}>
                                                Chat
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="noRequests">No inspection requests available.</p>
                        )}
                    </div>
                </div>
            </div>
            <footer>© 2025 Your Company</footer>
        </div>
    );
};

export default Dashboard;
