const express = require("express");
const router = express.Router();
const Prescription = require("../modules/prescription.module"); // Adjust the path if needed
const Patient = require("../modules/patient.module")
const Case = require("../modules/cases.module")

// Create a new prescription
router.post("/create-prescription", async (req, res) => {
  try {
    const { case_id, doctor_id, medicine : name, dosage, notes } = req.body;

    const medicines = [{name , dosage}]
    console.log(medicines);
    

    // Validate required fields
    if (!case_id || !doctor_id || !medicines || medicines.length === 0 || !dosage) {
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

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Patient ID not provided" });
    }

    const patient = await Patient.findById(id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    const cases = await Case.find({ patient_id: id });

    const prescriptions = await Prescription.find({
      case_id: { $in: cases.map((c) => c._id) },
    });

    return res.status(200).json({
      status: true,
      data: {
        // patient,
        // cases,
        prescriptions,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;