const Patient = require("../modules/patient.module");

const getPatient = async (req , res) => {
    try{
        const { id , password } = req.body;

        const patient = await Patient.findOne({_id: id});

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
        const {id , ...rest} = req.body;

        const patient = await Patient.findOne({_id: id});

        if(patient){
            return res.status(400).json({status: false , message: "Patient already exists"});
        }

        const password = Math.random().toString(36).slice(2);
        rest.password = password;
        rest._id = id;

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

module.exports = {
    getPatient,
    addPatient,
    deletePatient
}