const Doctor = require("../modules/doctor.module");

const addDoctor = async (req, res) => {
    try{
        const doctor = await Doctor.create(req.body);
        const id = doctor._id;
        return res.status(200).json({status: true , doctor_id: id});
    }
    catch(err){
        return res.status(500).json({status: false , message: err.message});
    }
}

const getDocById = async (req, res) => {
    try{
        const {id} = req.params;
        const doctor = await Doctor.findById(id);
        return res.status(200).json({status: true , data: doctor});
    }
    catch(err){
        return res.status(500).json({status: false , message: err.message});
    }
}

const getDoctor = async (req, res) => {
    try{
        const {email, password} = req.body;

        const doctor = await Doctor.findOne({email: email});

        if(!doctor){    
            return res.status(404).json({status: false , message: "Doctor not found"});
        }

        if(doctor.password !== password){
            return res.status(401).json({status: false , message: "Invalid password"});
        }
        return res.status(200).json({status: true , data: doctor});

    }
    catch(err){
        return res.status(500).json({status: false , message: err.message});
    }
}

<<<<<<< HEAD
const getDocById = async (req, res) => {
    try{
        const {id} = req.params;
        const doctor = await Doctor.findById(id);
        return res.status(200).json({status: true , data: doctor});
    }
    catch(err){
        return res.status(500).json({status: false , message: err.message});
    }
}



module.exports = {addDoctor , getDoctor , getDocById };
=======
module.exports = {addDoctor , getDoctor , getDocById};
>>>>>>> 30f66c73c997c15bcbfb53304deca846861e834c
