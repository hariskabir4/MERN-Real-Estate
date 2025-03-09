import React from "react";
import "./OnsiteInspectionRequestForm.css";

const OnsiteInspectionRequestForm = () => {
  return (
    <div className="container_onsite_insp_req_form">
      {/* Form Section */}
      <div className="form-container_onsite_insp_req_form">
        <form className="form_onsite_insp_req_form">
          <h2>Request Onsite Inspection</h2>
          <input type="text" placeholder="Property Type" required />
          <input type="text" placeholder="Address" required />
          <input type="text" placeholder="Phone Number" required />
          <input type="text" placeholder="City" required />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default OnsiteInspectionRequestForm;
