const PDFDocument = require("pdfkit")
const streamBuffers = require("stream-buffers");
const puppeteer = require("puppeteer");

// const buildPDF = (
//                 textData , 
//                 dataCallback , 
//                 endCallback) => {
//     // console.log(textData);
    
//     const doc = new PDFDocument();
//     doc.on('data' , dataCallback)
//     doc.on('end' , endCallback)
//     doc.fontSize(25).text(textData || "TRIAL  1")
//     doc.end()
// }

const buildPDF = async (textData, dataCallback, endCallback) => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.setContent(`
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; text-align: center; }
                    h1 { color: #007BFF; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
                    th { background-color: #f2f2f2; }
                    .notes { margin-top: 20px; font-style: italic; color: #FF5733; }
                </style>
            </head>
            <body>
                <div style="text-align: center;">
                <a  href="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXRi-odzHw8IDZ1jyFyAlJIoj_kUcYp1BKig&s target="_blank">
                    <img style="height:200px; width:250px;" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXRi-odzHw8IDZ1jyFyAlJIoj_kUcYp1BKig&s" alt="Stethoscope" width="100">
                </a>
                <h1>Your Prescription</h1>
                </div>
                <hr>
                ${textData} 
            </body>
            </html>
        `);

        const pdfBuffer = await page.pdf({ format: "A4" });

        await browser.close();

        // Stream the PDF data
        dataCallback(pdfBuffer);
        endCallback();
    } catch (error) {
        console.error("Error generating PDF:", error);
    }
};

// const generatePDF = (textData) => {
//     return new Promise((resolve, reject) => {
//         const doc = new PDFDocument();
//         const bufferStream = new streamBuffers.WritableStreamBuffer();

//         doc.pipe(bufferStream);
//         doc.fontSize(25).text(textData || "Default Prescription Content");
//         doc.end();

//         bufferStream.on("finish", () => resolve(bufferStream.getContents()));
//         bufferStream.on("error", reject);
//     });
// };

const generatePDF = async (htmlContent) => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: "load" });

        const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });

        await browser.close();
        return pdfBuffer;
    } catch (error) {
        console.error("Error generating PDF:", error);
        throw error;
    }
};

module.exports = {generatePDF , buildPDF}