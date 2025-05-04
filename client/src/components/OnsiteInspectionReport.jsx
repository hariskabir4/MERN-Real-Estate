import React from 'react';
import './OnsiteInspectionReport.css';

const OnsiteInspectionReport = (props) => {
  const {
    inspectionDate,
    locationPrice,
    propertyType,
    yearBuilt,
    occupancyStatus,
    foundation,
    plumbingCondition,
    waterPressure,
    generalCondition,
    overallCondition,
    repairList,
    estimatedCosts,
    finalRemarks,
  } = props;

  return (
    <div className="inspection-container_onsite_insp_report">
      <h2 className="inspection-title_onsite_insp_report">Onsite Property Evaluation</h2>

      <div className="inspection-info_onsite_insp_report">
        <p><strong>Date:</strong> {inspectionDate || 'N/A'}</p>
        <p><strong>Estimated Property Price:</strong> {locationPrice || 'N/A'}</p>
      </div>

      <div className="inspection-grid_onsite_insp_report">
        <p><strong>Property Type:</strong> {propertyType || 'N/A'}</p>
        <p><strong>Year Built:</strong> {yearBuilt || 'N/A'}</p>
        <p><strong>Occupancy Status:</strong> {occupancyStatus || 'N/A'}</p>
        <p><strong>Foundation:</strong> {foundation || 'N/A'}</p>
        <p><strong>Plumbing Condition:</strong> {plumbingCondition || 'N/A'}</p>
        <p><strong>Water Pressure:</strong> {waterPressure || 'N/A'}</p>
        <p><strong>General Condition:</strong> {generalCondition || 'N/A'}</p>
        <p><strong>Overall Condition:</strong> {overallCondition || 'N/A'}</p>
        <p><strong>List of Immediate Repairs:</strong> {repairList || 'No repairs needed'}</p>
        <p><strong>Estimated Repair Costs:</strong> {estimatedCosts || 'N/A'}</p>
      </div>

      <div className="inspection-remarks_onsite_insp_report">
        <p><strong>Final Remarks:</strong> {finalRemarks || 'No remarks'}</p>
      </div>
    </div>
  );
};

export default OnsiteInspectionReport;
