const express = require("express")
const router = express.Router()
const {sendMailWithPDF} = require("../controllers/send_mail")

router.route("/send_mail/:id").post(sendMailWithPDF)

module.exports = router