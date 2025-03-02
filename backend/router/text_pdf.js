const router = require("express").Router();
const {downloadPdf} = require("../controllers/text_pdf")

router.route("/text_pdf").post(downloadPdf)

module.exports = router;