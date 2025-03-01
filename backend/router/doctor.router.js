const router = require("express").Router();
const doctorController = require("../controllers/doctor.controller");

router.post("/signup",doctorController.addDoctor);
router.post("/login", doctorController.getDoctor);

module.exports = router;