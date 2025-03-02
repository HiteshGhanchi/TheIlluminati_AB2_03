const Case = require("../modules/cases.module");
const Chat = require("../modules/chat.module");
const Patient = require("../modules/patient.module");

const getCases = async (req , res) => {
    try {
        const cases = await Case.find({ patient_id: req.params.id }).sort({ created_at: -1 });
        res.json({ success: true, cases });
      } catch (err) {
        res.status(500).json({ success: false, error: err.message });
      }
}

const getCase = async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query; 
      const chat = await Chat.findById(req.params.case_id);
      
      if (!chat) return res.status(404).json({ success: false, message: "Chat not found" });
  
      const messages = chat.messages.slice(-limit * page).slice(0, limit); // Paginate messages
      res.json({ success: true, messages });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
}

const startCase =  async (req, res) => {
    try {
      const { patient_id, sender, message } = req.body;
  
      // Create new case
      const newCase = new Case({ patient_id});
      await newCase.save();
  
      // Create new chat
      const newChat = new Chat({ _id: newCase._id, messages: [{ sender, message }] });
      await newChat.save();
  
      res.json({ success: true, case_id: newCase._id, message: "Chat started" });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
}

const addCase = async (req, res) => {
  const { patient_id  , password , doctor_id} = req.body;
  try{
    const patient = await Patient.findOne({_id: patient_id});

    if(!patient){
        return res.status(400).json({status: false , message: "Patient not found"});
    }

    if(patient.password !== password){
        return res.status(401).json({status: false , message: "Invalid password"});
    }

    const newCase = new Case({patient_id , doctor_id});
    await newCase.save();
    
    const newChat = new Chat({ _id: newCase._id, messages: [] });
    await newChat.save();

    const newCaseWithPatient = await newCase.populate("patient_id");

    return res.status(200).json({status: true , data: newCaseWithPatient});
  }
  catch(err){
    return res.status(500).json({status: false , message: err.message});
  }
}


const getChat = async (req , res) => {
    try {
        const chat = await Chat.findById(req.params.id);
        res.json({ success: true, chat });
      } catch (err) {
        res.status(500).json({ success: false, error: err.message });
      }
}


module.exports = {
    getCases,
    getCase,
    startCase,
    addCase,
    getChat

};