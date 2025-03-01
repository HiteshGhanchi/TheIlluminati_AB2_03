const Patient = require("../modules/patient.module");
const Case = require("../modules/cases.module");
const Prescription = require("../modules/prescription.module");
const Diagnosis = require("../modules/diagnoses.module");

const getPatient = async (req , res) => {
    try{
        const { aadhar_id , password } = req.body;

        const patient = await Patient.findOne({aadhar_id: aadhar_id});

        if(!patient){
            return res.status(404).json({status: false , message: "Patient not found"});
        }


        if(patient.password !== password){
            return res.status(401).json({status: false , message: "Invalid password"});
        }
        return res.status(200).json({status: true , data: patient});
    }
    catch(err){
        return res.status(500).json({status: false , message: err.message});
    }
}

const addPatient = async (req , res) => {
    try{
        const { aadhar_id , ...rest} = req.body;
        // console.log("In addPatient!!");
        
        const patient = await Patient.findOne({aadhar_id: aadhar_id});

        if(patient){
            return res.status(400).json({status: false , message: "Patient already exists"});
        }

        const password = Math.random().toString(36).slice(2);
        rest.password = password;
        rest.aadhar_id = aadhar_id;

        const newPatient = new Patient(rest);
        await newPatient.save();
        return res.status(200).json({status: true , data: newPatient});
    }
    catch(err){
        return res.status(500).json({status: false , message: err.message});
    }
}

const deletePatient = async (req , res) => {
    const { id } = req.body;
    try{
        const patient = await Patient.findOneAndDelete({ _id: id });
        if(patient){
            return res.status(200).json({status: true , data: patient});
        }
        return res.status(404).json({status: false , message: "Patient not found"});
    }
    catch(err){
        return res.status(500).json({status: false , message: err.message});
    }
}

const getAllPatients = async (req , res) => {
    try {
        const doctor_id = req.params.doctor_id;
    
        const all_cases = await Case.find({ doctor_id }).populate("patient_id");
    
        const active_length = all_cases.filter((caseItem) => caseItem?.status === "ongoing").length;
    
        // Fetch all prescriptions and get their count properly
        const all_prescriptions = await Prescription.find({ doctor_id });
        const prescription_count = all_prescriptions.length;
    
        // Fetch all diagnoses and get their count properly
        const all_diagnoses = await Diagnosis.find({ doctor_id });
        const diagnosis_count = all_diagnoses.length;
    
        return res.status(200).json({
            status: true,
            data: {
                cases: all_cases,
                count: all_cases.length,
                active: active_length,
                prescription: prescription_count,
                diagnosis: diagnosis_count,
            },
        });
    } catch (err) {
        return res.status(500).json({ status: false, message: err.message });
    }
}

module.exports = {
    getPatient,
    addPatient,
    deletePatient,
    getAllPatients
}