// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import OnsiteInspectionReport from "./OnsiteInspectionReport";

// const OwnerReportsPage = () => {
//   const [reports, setReports] = useState([]);

//   useEffect(() => {
//     const fetchReports = async () => {
//       try {
//         const token = localStorage.getItem("authToken");
//         const response = await axios.get("/api/owner/requests-with-reports", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setReports(response.data);
//       } catch (error) {
//         console.error("Failed to fetch reports", error);
//       }
//     };

//     fetchReports();
//   }, []);

//   return (
//     <div>
//       <h1>My Property Reports</h1>

//       {reports.length === 0 ? (
//         <p>No reports available.</p>
//       ) : (
//         reports.map((item) => (
//           <div key={item.requestDetails._id}>
//             <h3>Request ID: {item.requestDetails._id}</h3>

//             {item.reportDetails && item.reportDetails.length > 0 ? (
//               item.reportDetails.map((report, index) => (
//                 <OnsiteInspectionReport
//                   key={report._id || index}
//                   inspectionDate={
//                     report.inspectionDate
//                       ? new Date(report.inspectionDate).toLocaleDateString("en-US", {
//                           year: "numeric",
//                           month: "long",
//                           day: "numeric",
//                         })
//                       : "N/A"
//                   }
//                   locationPrice={report.locationPrice}
//                   propertyType={report.propertyType}
//                   yearBuilt={report.yearBuilt}
//                   generalCondition={report.generalCondition}
//                   occupancyStatus={report.occupancyStatus}
//                   foundation={report.foundation}
//                   plumbingCondition={report.plumbingCondition}
//                   waterPressure={report.waterPressure}
//                   overallCondition={report.overallCondition}
//                   repairList={report.repairList || "No repairs needed"}
//                   estimatedCosts={report.estimatedCosts || "N/A"}
//                   finalRemarks={report.finalRemarks || "No remarks"}
//                 />
//               ))
//             ) : (
//               <p>No report available yet for request ID: {item.requestDetails._id}</p>
//             )}
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default OwnerReportsPage;















import React, { useEffect, useState } from "react";
import axios from "axios";
import OnsiteInspectionReport from "./OnsiteInspectionReport";

const OwnerReportsPage = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get("/api/owner/requests-with-reports", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setReports(response.data);
      } catch (error) {
        console.error("Failed to fetch reports", error);
      }
    };

    fetchReports();
  }, []);

  return (
    <div>
      <h1>My Property Reports</h1>

      {reports.length === 0 ? (
        <p>No reports available.</p>
      ) : (
        reports.map((item) => {
          const completeReports = item.reportDetails.filter(
            (report) => report.inspectionDate && report.finalRemarks
          );

          return (
            <div key={item.requestDetails._id}>
            

              {completeReports.length > 0 ? (
                completeReports.map((report, index) => (
                  <OnsiteInspectionReport
                    key={report._id || index}
                    inspectionDate={
                      report.inspectionDate
                        ? new Date(report.inspectionDate).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )
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
                ))
              ) : (
                <p>No complete report available yet for request ID: {item.requestDetails._id}</p>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default OwnerReportsPage;
