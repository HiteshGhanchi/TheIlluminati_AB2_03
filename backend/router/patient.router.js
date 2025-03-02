const router = require("express").Router();
const patientController = require("../controllers/patient.controller");

router.post("/getPatient",patientController.getPatient);
router.post("/",patientController.addPatient);
router.delete("/",patientController.deletePatient);
router.get("/:id" , patientController.getSinglePatient)
router.get("/getAllPatients/:doctor_id",patientController.getAllPatients);
module.exports = router;


