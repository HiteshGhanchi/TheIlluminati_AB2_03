const mongoose = require("mongoose");

const diagnosisSchema = new mongoose.Schema({
  case_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Case",
  },
  doctor_id: {
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    ref: "Doctor",
  },
  symptoms: {
    type: [String], 
    required: true,
  },
  diagnosis: {
    type: String, 
    required: true,
  },
  recommendations: {
    type: String, // AI summary
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Diagnosis = mongoose.model("Diagnosis", diagnosisSchema);
module.exports = Diagnosis;
