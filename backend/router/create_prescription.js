const express = require("express");
const router = express.Router();
const Prescription = require("../modules/prescription.module"); // Adjust the path if needed

// Create a new prescription
router.post("/create-prescription", async (req, res) => {
  try {
    const { case_id, doctor_id, medicines, notes } = req.body;

    // Validate required fields
    if (!case_id || !doctor_id || !medicines || medicines.length === 0) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const prescription = new Prescription({
      case_id,
      doctor_id,
      medicines,
      notes,
    });

    await prescription.save();
    res.status(201).json({ message: "Prescription created successfully", prescription });
  } catch (error) {
    console.error("Error creating prescription:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;