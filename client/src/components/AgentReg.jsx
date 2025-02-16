import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 
import "./AgentReg.css";

const AgentReg = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
        licenseNumber: "",
        issuingAuthority: "",
        experience: "",
        companyName: "",
        officeAddress: "",
        website: "",
        specialization: [],
        profilePicture: null,
        licenseCopy: null,
        businessLogo: null,
        certifications: null,
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        if (type === "file") {
            setFormData((prevData) => ({
                ...prevData,
                [name]: files[0],
            }));
        } else if (type === "checkbox") {
            setFormData((prevData) => ({
                ...prevData,
                specialization: checked
                    ? [...prevData.specialization, value]
                    : prevData.specialization.filter((spec) => spec !== value),
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Ensure passwords match before submitting
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            setLoading(false);
            return;
        }

        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
            if (Array.isArray(formData[key])) {
                formData[key].forEach((value) => formDataToSend.append(key, value));
            } else {
                formDataToSend.append(key, formData[key]);
            }
        });

        try {
            const response = await axios.post("http://localhost:5000/api/agent/signup", formDataToSend, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            alert(response.data.message);
            navigate("/login");
        } catch (error) {
            alert(error.response?.data?.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="agent_reg_form_container">
            <div className="agent-portal-header-agentlogin">
                <img src="/icons8-home.svg" alt="Real Estate" className="agent-portal-icon-agentlogin" />
                <span className="agent-portal-title-agentlogin">Bunyaad Agent Portal</span>
            </div>
            <div className="agent_reg_form_box">
                <h2>Agent Registration Form</h2>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="agent_reg_form_row">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input type="text" name="fullName" placeholder="Enter your full name" onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" name="email" placeholder="Enter your email" onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input type="tel" name="phoneNumber" placeholder="Enter your phone number" onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" name="password" placeholder="Enter your password" onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input type="password" name="confirmPassword" placeholder="Confirm your password" onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="agent_reg_form_row">
                        <div className="form-group">
                            <label>Real Estate License Number</label>
                            <input type="text" name="licenseNumber" placeholder="Enter your license number" onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Issuing Authority</label>
                            <input type="text" name="issuingAuthority" placeholder="Enter the issuing authority" onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Years of Experience</label>
                            <select name="experience" onChange={handleChange} required>
                                <option value="">Select</option>
                                <option value="<1">Less than 1 year</option>
                                <option value="1-3">1-3 years</option>
                                <option value="3-5">3-5 years</option>
                                <option value="5+">5+ years</option>
                            </select>
                        </div>
                    </div>

                    <div className="agent_reg_form_row">
                        <div className="form-group">
                            <label>Specialization</label>
                            <div className="agent_reg_form_specialization">
                                <input type="checkbox" name="specialization" value="Residential" onChange={handleChange} /> Residential
                                <input type="checkbox" name="specialization" value="Commercial" onChange={handleChange} /> Commercial
                                <input type="checkbox" name="specialization" value="Luxury" onChange={handleChange} /> Luxury
                                <input type="checkbox" name="specialization" value="Rentals" onChange={handleChange} /> Rentals
                            </div>
                        </div>
                    </div>

                    <div className="agent_reg_form_row">
                        <div className="form-group">
                            <label>Profile Picture</label>
                            <input type="file" name="profilePicture" onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Real Estate License Copy</label>
                            <input type="file" name="licenseCopy" onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Business Logo</label>
                            <input type="file" name="businessLogo" onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Additional Certifications</label>
                            <input type="file" name="certifications" onChange={handleChange} />
                        </div>
                    </div>

                    <button type="submit" className="agent_reg_form_btn" disabled={loading}>
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AgentReg;
