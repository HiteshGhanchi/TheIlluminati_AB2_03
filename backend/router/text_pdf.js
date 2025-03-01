const router = require("express").Router();
const {downloadPdf} = require("../controllers/text_pdf")

router.route("/text_pdf").get(downloadPdf)

module.exports = router;