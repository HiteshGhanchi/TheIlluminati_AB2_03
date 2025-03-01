const mongoose = require("mongoose");

const caseSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId, 
    auto: true,
  },
  patient_id: {
    type: String, // Aadhaar Number
    required: true,
    ref: "Patient", // Links to Patient schema
  },
  // doctor_id:{
  //   type : [String],
  //   required: true,  
  // },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Case = mongoose.model("Case", caseSchema);
module.exports = Case;
