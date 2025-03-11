const express = require("express");
const PropertyReport = require("../models/propertyreport"); // Import schema

const router = express.Router();

// ✅ POST: Create a new property report
router.post("/", async (req, res) => {
    try {
        const newReport = new PropertyReport(req.body);
        const savedReport = await newReport.save();
        res.status(201).json({ message: "Property report submitted successfully", report: savedReport });
    } catch (error) {
        console.error("Error saving report:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

// ✅ GET: Fetch all property reports
router.get("/", async (req, res) => {
    try {
        const reports = await PropertyReport.find();
        res.status(200).json(reports);
    } catch (error) {
        console.error("Error fetching reports:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

// ✅ GET: Fetch a single report by ID
router.get("/:id", async (req, res) => {
    try {
        const report = await PropertyReport.findById(req.params.id);
        if (!report) return res.status(404).json({ message: "Report not found" });
        res.status(200).json(report);
    } catch (error) {
        console.error("Error fetching report:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

// ✅ DELETE: Remove a property report by ID
router.delete("/:id", async (req, res) => {
    try {
        const deletedReport = await PropertyReport.findByIdAndDelete(req.params.id);
        if (!deletedReport) return res.status(404).json({ message: "Report not found" });
        res.status(200).json({ message: "Report deleted successfully" });
    } catch (error) {
        console.error("Error deleting report:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

module.exports = router;
