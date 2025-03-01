const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  case_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Case",
  },
  doctor_id: {
    type: mongoose.Schema.Types.ObjectId, // Doctor's unique ID
    required: true,
    ref: "Doctor",
  },
  medicines: {
    type: [
      {
        name: String, // Medicine name
        dosage: String, // Dosage instructions
      },
    ],
    required: true,
  },
  notes: {
    type: String, // Any additional notes
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Prescription = mongoose.model("Prescription", prescriptionSchema);
module.exports = Prescription;
