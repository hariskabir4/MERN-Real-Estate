// import React, { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom"; // Import useLocation to get the state

// const OnsiteInspectorForm = () => {
//     const location = useLocation(); // Get location state
//     const { requestId } = location.state || {}; // Extract requestId from state

//     const [formData, setFormData] = useState({
//         inspectionDate: "",
//         locationPrice: "",
//         propertyType: "",
//         yearBuilt: "",
//         generalCondition: "",
//         occupancyStatus: "",
//         foundation: "",
//         plumbingCondition: "",
//         waterPressure: "",
//         overallCondition: "",
//         repairList: "",
//         estimatedCosts: "",
//         finalRemarks: "",
//     });

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const token = localStorage.getItem("agentToken");

//         // Check if requestId is available
//         if (!requestId) {
//             alert("Request ID is missing. Unable to submit report.");
//             return;
//         }

//         try {
//             const response = await fetch("http://localhost:5000/api/agent/property_form/accepted_property_form", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Authorization": `Bearer ${token}`,
//                 },
//                 body: JSON.stringify({
//                     ...formData,
//                     requestId, // Pass the requestId here
//                 }),
//             });

//             const data = await response.json();
//             if (response.ok) {
//                 alert("Report submitted successfully!");
//                 console.log("Server Response:", data);
//             } else {
//                 alert("Failed to submit report.");
//                 console.error("Error:", data);
//             }
//         } catch (err) {
//             console.error("Submission error:", err);
//             alert("Something went wrong!");
//         }
//     };

//     return (
//         <div className="onsite-inspector-form-wrapper">
//             <div className="form-container">
//                 <form className="form-box" onSubmit={handleSubmit}>
//                     <h2>Onsite Property Evaluation</h2>

//                     <div className="form-grid">
//                         {/* Form Fields */}
//                         <input type="date" name="inspectionDate" value={formData.inspectionDate} onChange={handleChange} required />
//                         <input type="text" name="locationPrice" placeholder="Estimated Price" value={formData.locationPrice} onChange={handleChange} />
//                         <select name="propertyType" value={formData.propertyType} onChange={handleChange} required>
//                             <option value="">Select Property Type</option>
//                             <option value="House">House</option>
//                             <option value="Apartment">Apartment</option>
//                             <option value="Commercial">Commercial</option>
//                         </select>
//                         <input type="number" name="yearBuilt" placeholder="Year Built" value={formData.yearBuilt} onChange={handleChange} />
//                         <input type="text" name="generalCondition" placeholder="General Condition" value={formData.generalCondition} onChange={handleChange} />
//                         <select name="occupancyStatus" value={formData.occupancyStatus} onChange={handleChange}>
//                             <option value="">Occupancy Status</option>
//                             <option value="Vacant">Vacant</option>
//                             <option value="Occupied">Occupied</option>
//                         </select>
//                         <input type="text" name="foundation" placeholder="Foundation Condition" value={formData.foundation} onChange={handleChange} />
//                         <input type="text" name="plumbingCondition" placeholder="Plumbing Condition" value={formData.plumbingCondition} onChange={handleChange} />
//                         <input type="text" name="waterPressure" placeholder="Water Pressure Condition" value={formData.waterPressure} onChange={handleChange} />
//                         <input type="text" name="overallCondition" placeholder="Overall Condition" value={formData.overallCondition} onChange={handleChange} />
//                         <textarea name="repairList" placeholder="List of Immediate Repairs" value={formData.repairList} onChange={handleChange} />
//                         <input type="text" name="estimatedCosts" placeholder="Estimated Repair Costs" value={formData.estimatedCosts} onChange={handleChange} />
//                         <textarea name="finalRemarks" placeholder="Final Remarks" value={formData.finalRemarks} onChange={handleChange} />
//                     </div>

//                     <button type="submit" className="submit-btn">Submit Evaluation</button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default OnsiteInspectorForm;
























import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import './OnsiteInspectorForm.css';

const OnsiteInspectorForm = () => {
    const location = useLocation();
    const { requestId } = location.state || {};

    const [formData, setFormData] = useState({
        inspectionDate: "",
        locationPrice: "",
        propertyType: "",
        yearBuilt: "",
        generalCondition: "",
        occupancyStatus: "",
        foundation: "",
        plumbingCondition: "",
        waterPressure: "",
        overallCondition: "",
        repairList: "",
        estimatedCosts: "",
        finalRemarks: "",
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.inspectionDate) newErrors.inspectionDate = "Inspection date is required.";
        if (!formData.propertyType) newErrors.propertyType = "Property type is required.";
        if (!formData.generalCondition) newErrors.generalCondition = "General condition is required.";
        if (!formData.occupancyStatus) newErrors.occupancyStatus = "Occupancy status is required.";
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const token = localStorage.getItem("agentToken");
        if (!requestId) {
            alert("Request ID is missing. Unable to submit report.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/api/agent/property_form/accepted_property_form", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ ...formData, requestId }),
            });

            const data = await response.json();
            if (response.ok) {
                alert("Report submitted successfully!");
                console.log("Server Response:", data);
            } else {
                alert("Failed to submit report.");
                console.error("Error:", data);
            }
        } catch (err) {
            console.error("Submission error:", err);
            alert("Something went wrong!");
        }
    };

    return (
        <>
            {/* Form */}
            <div className="form-container_eval_form">
                <form className="form-box_eval_form" onSubmit={handleSubmit}>
                    <h2>Onsite Property Evaluation</h2>

                    <div className="form-grid_eval_form">
                        <input type="date" name="inspectionDate" value={formData.inspectionDate} onChange={handleChange} required />
                        <input type="text" name="locationPrice" placeholder="Estimated Price" value={formData.locationPrice} onChange={handleChange} />
                        <select name="propertyType" value={formData.propertyType} onChange={handleChange} required>
                            <option value="">Select Property Type</option>
                            <option value="House">House</option>
                            <option value="Apartment">Apartment</option>
                            <option value="Commercial">Commercial</option>
                        </select>
                        {errors.propertyType && <p className="error">{errors.propertyType}</p>}

                        <input
                            type="number"
                            name="yearBuilt"
                            placeholder="Year Built"
                            value={formData.yearBuilt}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            name="generalCondition"
                            placeholder="General Condition"
                            value={formData.generalCondition}
                            onChange={handleChange}
                        />
                        {errors.generalCondition && <p className="error">{errors.generalCondition}</p>}

                        <select name="occupancyStatus" value={formData.occupancyStatus} onChange={handleChange}>
                            <option value="">Occupancy Status</option>
                            <option value="Vacant">Vacant</option>
                            <option value="Occupied">Occupied</option>
                        </select>
                        {errors.occupancyStatus && <p className="error">{errors.occupancyStatus}</p>}

                        <input
                            type="text"
                            name="foundation"
                            placeholder="Foundation Condition"
                            value={formData.foundation}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            name="plumbingCondition"
                            placeholder="Plumbing Condition"
                            value={formData.plumbingCondition}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            name="waterPressure"
                            placeholder="Water Pressure Condition"
                            value={formData.waterPressure}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            name="overallCondition"
                            placeholder="Overall Condition"
                            value={formData.overallCondition}
                            onChange={handleChange}
                        />
                        <textarea
                            name="repairList"
                            placeholder="List of Immediate Repairs"
                            value={formData.repairList}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            name="estimatedCosts"
                            placeholder="Estimated Repair Costs"
                            value={formData.estimatedCosts}
                            onChange={handleChange}
                        />
                        <textarea
                            name="finalRemarks"
                            placeholder="Final Remarks"
                            value={formData.finalRemarks}
                            onChange={handleChange}
                        />
                    </div>

  <button type="submit" className="submit-btn">Submit Evaluation</button>

                  
                </form>
            </div>
        </>
    );
};

export default OnsiteInspectorForm;
