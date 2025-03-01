const {buildPDF} = require("../middleware/pdf_service")

const downloadPdf = (req , res) =>{
    
    const {
        body :{ info : text}
    } = req
    
    const stream = res.writeHead(200, {
        'Content-Type' : "application/pdf",
        'Content-Disposition' : "attachment;filename=report.pdf"
    })

    buildPDF(text , 
        (chunk) => stream.write(chunk),
        () => stream.end()
    )
} 

module.exports = {downloadPdf}