const PDFDocument = require("pdfkit");
const nodemailer = require("nodemailer");
const streamBuffers = require("stream-buffers");
const {generatePDF} = require("../middleware/pdf_service");
const Patient = require("../modules/patient.module")
const Case = require("../modules/cases.module")
const Prescription = require("../modules/prescription.module")

const sendMailWithPDF = async (req, res) => {
    try {
        const {
            params: { id: caseId },
        } = req;
        

        const correctCase = await Case.findOne({_id : caseId})
        const correctPrescription = await Prescription.findOne({case_id : caseId})
        const correctPatient =  await Patient.findOne({_id : correctCase.patient_id})

        console.log(correctCase.patient_id )

        const emailId = correctPatient.email

        info = `${correctPrescription.medicines}`
        // **1. Generate PDF in Memory**
        const pdfBuffer = await generatePDF(info);

        // **2. Setup Nodemailer Transporter**
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.USER_ID,
                pass: process.env.PASS
            }
        });

        // **3. Send Email with PDF Attachment**
        await transporter.sendMail({
            to: emailId,
            subject: "Your Prescription",
            html: `<h1>Your Prescription</h1>`,
            attachments: [
                {
                    filename: "prescription.pdf",
                    content: pdfBuffer,
                    contentType: "application/pdf"
                }
            ]
        });

        console.log("Email sent with PDF attachment");
        res.status(200).json({ msg: "Email with PDF sent successfully" });

    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ msg: "Failed to send email with PDF", error: error.message });
    }
};



module.exports = { sendMailWithPDF };