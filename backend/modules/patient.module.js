const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  _id: {
    type: String, 
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^\d{12}$/.test(v); 
      },
      message: "Invalid Aadhaar number!",
    },
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v); 
      },
      message: "Invalid phone number!",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, "Invalid email format"],
  },
  age: {
    type: Number,
    required: true,
    min: 0,
  },
  sex: {
    type: String,
    required: true,
    enum: ["Male", "Female", "Other"],
  },
  allergies: {
    type: [String], // Array of allergies
    default: [],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const Patient = mongoose.model("Patient", patientSchema);
module.exports = Patient;
