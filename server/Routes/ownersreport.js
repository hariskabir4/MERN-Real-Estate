

const express = require('express');
const router = express.Router();
const OwnerRequest = require('../models/Onsite_req_form');
const AcceptedPropertyForm = require('../models/AcceptedPropertyForm');
const authenticateToken = require('../middleware/jwtAuth');

// GET /api/owner/requests-with-reports
router.get('/requests-with-reports', authenticateToken, async (req, res) => {
  try {
    const ownerId = req.user.ownerId;
    console.log('Extracted Owner ID from token:', ownerId);

    // Find all owner requests by this owner
    const ownerRequests = await OwnerRequest.find({ ownerId: ownerId });

    const requestsWithReports = [];

    for (const request of ownerRequests) {
      // Find accepted report for this request (agent has accepted)
      const acceptedForms = await AcceptedPropertyForm.find({ requestId: request._id });

      if (acceptedForms.length > 0) {
        requestsWithReports.push({
          requestDetails: request,
          reportDetails: acceptedForms
        });
      }
    }

    res.status(200).json(requestsWithReports);
  } catch (error) {
    console.error('Error fetching owner reports:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;










// const express = require('express');
// const router = express.Router();
// const OnsiteRequest = require('../models/Onsite_req_form');
// const AcceptedPropertyForm = require('../models/AcceptedPropertyForm');
// const authenticateToken = require('../middleware/jwtAuth');  // Keeping original name for middleware

// router.get('/owner/view-reports', authenticateToken, async (req, res) => {
//   try {
//     const ownerId = req.user.id;

//     const requests = await OnsiteRequest.find({ ownerId, status: 'Accepted' });

//     const responseData = [];

//     for (const request of requests) {
//       const reports = await AcceptedPropertyForm.find({ requestId: request._id });

//       // Filter out reports missing required fields
//       const validReports = reports.filter((report) => {
//         const requiredFields = [
//           'inspectionDate',
//           'locationPrice',
//           'propertyType',
//           'yearBuilt',
//           'generalCondition',
//           'occupancyStatus',
//           'foundation',
//           'plumbingCondition',
//           'waterPressure',
//           'overallCondition',
//           'repairList',
//           'estimatedCosts',
//           'finalRemarks'
//         ];

//         return requiredFields.every(field =>
//           report[field] !== undefined &&
//           report[field] !== null &&
//           report[field] !== '' &&
//           report[field] !== 'N/A'
//         );
//       });

//       if (validReports.length > 0) {
//         responseData.push({
//           requestDetails: request,
//           reportDetails: validReports
//         });
//       }
//     }

//     res.json(responseData);
//   } catch (error) {
//     console.error('Error fetching reports:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// module.exports = router;
