const router = require("express").Router();
const patientController = require("../controllers/patient.controller");

router.post("/getPatient",patientController.getPatient);
router.post("/",patientController.addPatient);

module.exports = router;


