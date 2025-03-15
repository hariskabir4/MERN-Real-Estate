import React, { useState } from "react";
import "./OnsiteInspectorForm.css";

const OnsiteInspectorForm = () => {
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
        kitchenCondition: "",
        bathroomCondition: "",
        overallCondition: "",
        repairList: "",
        estimatedCosts: "",
        finalRemarks: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Submitted", formData);
    };

    return (
        <div className="onsite-inspector-form-wrapper">
            {/* Form */}
            <div className="form-container">
                <form className="form-box" onSubmit={handleSubmit}>
                    <h2>Onsite Property Evaluation</h2>

                    <div className="form-grid">
                        <input type="date" name="inspectionDate" value={formData.inspectionDate} onChange={handleChange} required />
                        <input type="text" name="locationPrice" placeholder="Estimated Price" value={formData.locationPrice} onChange={handleChange} />
                        <select name="propertyType" value={formData.propertyType} onChange={handleChange} required>
                            <option value="">Select Property Type</option>
                            <option value="House">House</option>
                            <option value="Apartment">Apartment</option>
                            <option value="Commercial">Commercial</option>
                        </select>
                        <input type="number" name="yearBuilt" placeholder="Year Built" value={formData.yearBuilt} onChange={handleChange} />

                        <input type="text" name="generalCondition" placeholder="General Condition" value={formData.generalCondition} onChange={handleChange} />
                        <select name="occupancyStatus" value={formData.occupancyStatus} onChange={handleChange}>
                            <option value="">Occupancy Status</option>
                            <option value="Vacant">Vacant</option>
                            <option value="Occupied">Occupied</option>
                        </select>

                        <input type="text" name="foundation" placeholder="Foundation Condition" value={formData.foundation} onChange={handleChange} />
                        <input type="text" name="plumbingCondition" placeholder="Plumbing Condition" value={formData.plumbingCondition} onChange={handleChange} />
                        <input type="text" name="waterPressure" placeholder="Water Pressure Condition" value={formData.waterPressure} onChange={handleChange} />

                        <input type="text" name="kitchenCondition" placeholder="Kitchen Condition" value={formData.kitchenCondition} onChange={handleChange} />
                        <input type="text" name="bathroomCondition" placeholder="Bathroom Condition" value={formData.bathroomCondition} onChange={handleChange} />

                        <input type="text" name="overallCondition" placeholder="Overall Condition" value={formData.overallCondition} onChange={handleChange} />
                        <textarea name="repairList" placeholder="List of Immediate Repairs" value={formData.repairList} onChange={handleChange} />
                        <input type="text" name="estimatedCosts" placeholder="Estimated Repair Costs" value={formData.estimatedCosts} onChange={handleChange} />
                        <textarea name="finalRemarks" placeholder="Final Remarks" value={formData.finalRemarks} onChange={handleChange} />
                    </div>

                    <button type="submit" className="submit-btn">Submit Evaluation</button>
                </form>
            </div>
        </div>
    );
};

export default OnsiteInspectorForm;
