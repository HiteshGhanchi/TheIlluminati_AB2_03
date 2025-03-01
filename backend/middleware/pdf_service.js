const PDFDocument = require("pdfkit")
const streamBuffers = require("stream-buffers");


const buildPDF = (
                textData , 
                dataCallback , 
                endCallback) => {
    // console.log(textData);
    
    const doc = new PDFDocument();
    doc.on('data' , dataCallback)
    doc.on('end' , endCallback)
    doc.fontSize(25).text(textData || "TRIAL  1")
    doc.end()
}

const generatePDF = (textData) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const bufferStream = new streamBuffers.WritableStreamBuffer();

        doc.pipe(bufferStream);
        doc.fontSize(25).text(textData || "Default Prescription Content");
        doc.end();

        bufferStream.on("finish", () => resolve(bufferStream.getContents()));
        bufferStream.on("error", reject);
    });
};

module.exports = {generatePDF , buildPDF}