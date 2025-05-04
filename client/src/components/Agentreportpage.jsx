import React, { useEffect, useState } from "react";
import axios from "axios";
import OnsiteInspectionReport from "./OnsiteInspectionReport";

const AgentReportsPage = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchAgentReports = async () => {
      try {
        const token = localStorage.getItem("agentToken"); // Use agent token
        const response = await axios.get("/api/agent/my-submitted-reports", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setReports(response.data);
      } catch (error) {
        console.error("Failed to fetch agent reports", error);
      }
    };

    fetchAgentReports();
  }, []);

  return (
    <div>
      <h1>My Submitted Reports</h1>

      {reports.length === 0 ? (
        <p>No reports available.</p>
      ) : (
        reports.map((report, index) => {
          // Only show completed reports
          if (!report.inspectionDate || !report.finalRemarks) return null;

          return (
            <div key={report._id || index}>
              <h3>Request ID: {report.request_id}</h3>
              <OnsiteInspectionReport
                inspectionDate={
                  report.inspectionDate
                    ? new Date(report.inspectionDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "N/A"
                }
                locationPrice={report.locationPrice}
                propertyType={report.propertyType}
                yearBuilt={report.yearBuilt}
                generalCondition={report.generalCondition}
                occupancyStatus={report.occupancyStatus}
                foundation={report.foundation}
                plumbingCondition={report.plumbingCondition}
                waterPressure={report.waterPressure}
                overallCondition={report.overallCondition}
                repairList={report.repairList || "No repairs needed"}
                estimatedCosts={report.estimatedCosts || "N/A"}
                finalRemarks={report.finalRemarks || "No remarks"}
              />
            </div>
          );
        })
      )}
    </div>
  );
};

export default AgentReportsPage;
