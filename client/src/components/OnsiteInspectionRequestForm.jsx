import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Install via: npm install jwt-decode
import "./OnsiteInspectionRequestForm.css";

const OnsiteInspectionRequestForm = () => {
  const [formData, setFormData] = useState({
    ownerId: "",
    propertyType: "",
    address: "",
    phoneNumber: "",
    city: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    console.log("🔹 Token from localStorage:", token);

    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("✅ Decoded Token:", decoded);

        // Check token expiration
        const currentTime = Math.floor(Date.now() / 1000);
        console.log("⏳ Current Time:", currentTime);
        console.log("📌 Token Expiry:", decoded.exp);

        if (decoded.exp < currentTime) {
          console.error("❌ Token has expired!");
          localStorage.removeItem("authToken"); // Clear expired token
          return;
        }

        // Set owner ID if it exists in the token
        if (decoded.ownerId) {
          setFormData((prevData) => ({ ...prevData, ownerId: decoded.ownerId }));
        } else {
          console.error("⚠️ Decoded token does not contain ownerId.");
        }
      } catch (error) {
        console.error("❌ Invalid token:", error);
      }
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("authToken");
      console.log("🔹 Token being sent in request:", token);

      if (!token) {
        alert("🚫 User not authenticated");
        return;
      }

      const requestHeaders = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      console.log("📩 Request Sent with Headers:", requestHeaders);

      const response = await fetch("http://localhost:5000/api/onsite-requests/create", {
        method: "POST",
        headers: requestHeaders,
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("🔹 Response from server:", data);

      if (response.ok) {
        alert("✅ Request submitted successfully!");
        setFormData({
          ownerId: formData.ownerId,
          propertyType: "",
          address: "",
          phoneNumber: "",
          city: "",
        });
      } else {
        alert(data.message || "❌ Error submitting request");
      }
    } catch (error) {
      console.error("❌ Error submitting request:", error);
      alert("Server error. Try again later.");
    }
  };

  return (
    <div className="container_onsite_insp_req_form">
      <div className="form-container_onsite_insp_req_form">
        <form className="form_onsite_insp_req_form" onSubmit={handleSubmit}>
          <h2>Request Onsite Inspection</h2>
          <input
            type="text"
            name="propertyType"
            placeholder="Property Type"
            required
            onChange={handleChange}
            value={formData.propertyType}
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            required
            onChange={handleChange}
            value={formData.address}
          />
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            required
            onChange={handleChange}
            value={formData.phoneNumber}
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            required
            onChange={handleChange}
            value={formData.city}
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default OnsiteInspectionRequestForm;
