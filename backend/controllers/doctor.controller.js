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

const getDoctor = async (req, res) => {
    try{
        const {id, password} = req.body;

        const doctor = await Doctor.findOne({ _id: id });

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

module.exports = {addDoctor , getDoctor};