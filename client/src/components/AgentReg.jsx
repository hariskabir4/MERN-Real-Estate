import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AgentReg.css";
import axios from "axios"; // Backend request commented

const AgentReg = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
        city: "",
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
        certifications: null
    });

    const navigate = useNavigate(); 

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === "file") {
            setFormData({
                ...formData,
                [name]: files[0],
            });
        } else if (type === "checkbox") {
            setFormData({
                ...formData,
                specialization: checked
                    ? [...formData.specialization, value]
                    : formData.specialization.filter((spec) => spec !== value),
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        //  backend request

        try {
            const response = await axios.post("http://localhost:5000/api/agent/signup", formData);
            alert(response.data.message);
            navigate("/login");
        } catch (error) {
            alert(error.response?.data?.message || "An error occurred");
        }

        console.log("Form submitted with:", formData); // Debugging log
        navigate("/AgentPortal"); // Redirecting for now
    };

    return (
        <div className="agent_reg_form_container">
            <div className="agent-portal-header-agentlogin">
                <img src="/icons8-home.svg" alt="Real Estate" className="agent-portal-icon-agentlogin" />
                <span className="agent-portal-title-agentlogin">Bunyaad Agent Portal</span>
            </div>
            <div className="agent_reg_form_box">
                <h2>Agent Registration Form</h2>
                <form onSubmit={handleSubmit}>
                    {/* First Row */}
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
                    </div>

                    {/* Second Row */}
                    <div className="agent_reg_form_row">
                        <div className="form-group">
                            <label>Confirm Password</label>
                            <input type="password" name="confirmPassword" placeholder="Confirm your password" onChange={handleChange} required />
                        </div>
                        <div className="form-group">
    <label>City</label>
    <input type="text" name="city" placeholder="Enter your city" onChange={handleChange} required />
</div>

                        <div className="form-group">
                            <label>Real Estate License Number</label>
                            <input type="text" name="licenseNumber" placeholder="Enter your license number" onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Issuing Authority</label>
                            <input type="text" name="issuingAuthority" placeholder="Enter the issuing authority" onChange={handleChange} required />
                        </div>
                    </div>

                    {/* Third Row */}
                    <div className="agent_reg_form_row">
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
                        <div className="form-group">
                            <label>Company Name</label>
                            <input type="text" name="companyName" placeholder="Enter your company name" onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Office Address</label>
                            <input type="text" name="officeAddress" placeholder="Enter your office address" onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Website</label>
                            <input type="url" name="website" placeholder="Enter your website (optional)" onChange={handleChange} />
                        </div>
                    </div>

                    {/* Specialization Section */}
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

                    {/* Attachments Section */}
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

                    <button type="submit" className="agent_reg_form_btn">Register</button>
                </form>
            </div>
        </div>
    );
};

export default AgentReg;
