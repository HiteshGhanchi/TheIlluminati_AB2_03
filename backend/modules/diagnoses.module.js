const mongoose = require("mongoose");

const diagnosisSchema = new mongoose.Schema({
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
    type: String, 
    required: true,
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
    type: String, 
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Diagnosis = mongoose.model("Diagnosis", diagnosisSchema);
module.exports = Diagnosis;
