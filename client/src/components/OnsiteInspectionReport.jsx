import React from 'react';
import './OnsiteInspectionReport.css';

const OnsiteInspectionReport = (props) => {
  return (
    <div className="inspection-container_onsite_insp_report">
      <h2 className="inspection-title_onsite_insp_report">Onsite Property Evaluation</h2>

      <div className="inspection-info_onsite_insp_report">
        <p><strong>Date:</strong> {props.date}</p>
        <p><strong>Estimated Price:</strong> {props.estimatedPrice}</p>
      </div>

      <div className="inspection-grid_onsite_insp_report">
        <p><strong>Property Type:</strong> {props.propertyType}</p>
        <p><strong>Year Built:</strong> {props.yearBuilt}</p>
        <p><strong>General Condition:</strong> {props.generalCondition}</p>
        <p><strong>Occupancy Status:</strong> {props.occupancyStatus}</p>
        <p><strong>Foundation Condition:</strong> {props.foundationCondition}</p>
        <p><strong>Plumbing Condition:</strong> {props.plumbingCondition}</p>
        <p><strong>Water Pressure Condition:</strong> {props.waterPressureCondition}</p>
        <p><strong>Kitchen Condition:</strong> {props.kitchenCondition}</p>
        <p><strong>Bathroom Condition:</strong> {props.bathroomCondition}</p>
        <p><strong>Overall Condition:</strong> {props.overallCondition}</p>
        <p><strong>List of Immediate Repairs:</strong> {props.immediateRepairs}</p>
        <p><strong>Estimated Repair Costs:</strong> {props.repairCosts}</p>
      </div>

      <div className="inspection-remarks_onsite_insp_report">
        <p><strong>Final Remarks:</strong> {props.finalRemarks}</p>
      </div>
    </div>
  );
};

export default OnsiteInspectionReport;
