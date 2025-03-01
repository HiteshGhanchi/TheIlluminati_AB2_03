const mongoose = require("mongoose");

const caseSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId, 
    auto: true,
  },
  patient_id: {
    type: mongoose.Schema.Types.ObjectId, // Aadhaar Number
    required: true,
    ref: "Patient", // Links to Patient schema
  },
  doctor_id:{
    type : mongoose.Schema.Types.ObjectId,
    required: true,
    ref : "Doctor"  
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["ongoing", "resolved"],
    default: "ongoing",
  }
});

const Case = mongoose.model("Case", caseSchema);
module.exports = Case;
