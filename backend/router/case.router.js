const router = require("express").Router();
const caseController = require("../controllers/case.controller");

router.post("/flasktest",(req,res) => res.json({success: true , data:"yo yo"}));

router.post("/start", caseController.startCase);
router.get("/chats/:id", caseController.getChat);

router.get("/:id",caseController.getCases);
router.post("/:id", caseController.addCase);
router.get("/:case_id", caseController.getCase);

module.exports = router;


