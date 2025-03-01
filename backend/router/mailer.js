const express = require("express")
const router = express.Router()
const {sendMailToEmailId} = require("../controllers/send_mail")

router.route("/send_mail/:id").post(sendMailToEmailId)

module.exports = router