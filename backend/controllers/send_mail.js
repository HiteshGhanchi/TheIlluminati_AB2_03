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
        
        // Fetch data
        const correctCase = await Case.findOne({ _id: caseId });
        const correctPrescription = await Prescription.findOne({ case_id: caseId });
        const correctPatient = await Patient.findOne({ _id: correctCase.patient_id });

        console.log(correctCase.patient_id);

        const emailId = correctPatient.email;
        const { doctor_id, medicines, notes } = correctPrescription;

        // Generate prescription information for PDF
        let prescriptionHTML = `
            <h2>Prescription Details</h2>
            <table border="1" cellpadding="10" cellspacing="0" style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;">
                <tr style="background-color: #f2f2f2;">
                    <th>Doctor ID</th>
                    <th>Case ID</th>
                    <th>Medicine</th>
                    <th>Dosage</th>
                </tr>`;

        medicines.forEach(med => {
            prescriptionHTML += `
                <tr>
                    <td>${doctor_id}</td>
                    <td>${caseId}</td>
                    <td>${med.name}</td>
                    <td>${med.dosage}</td>
                </tr>`;
        });

        prescriptionHTML += `</table>
            <br>
            <strong>Additional Notes:</strong>
            <p>${notes || "No additional notes provided."}</p>`;

        

        // Setup Nodemailer Transporter
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.USER_ID,
                pass: process.env.PASS
            }
        });

        // Email content with stethoscope logo & structured prescription details
        const emailHTML = `
            <div style="text-align: center;">
                <a  href="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXRi-odzHw8IDZ1jyFyAlJIoj_kUcYp1BKig&s target="_blank">
                    <img style="height:200px; width:250px;" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXRi-odzHw8IDZ1jyFyAlJIoj_kUcYp1BKig&s" alt="Stethoscope" width="100">
                </a>
                <h1>Your Prescription</h1>
            </div>
            ${prescriptionHTML}
        `;

        // Generate PDF in Memory
        const pdfBuffer = await generatePDF(emailHTML);

        // console.log(emailHTML);
        

        // Send Email with PDF Attachment
        await transporter.sendMail({
            to: emailId,
            subject: "Your Prescription",
            html: emailHTML,
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