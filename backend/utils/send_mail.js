const nodemailer = require("nodemailer");


const sendMailToEmailId = (req , res) =>{
    const {
        params : {id : emailId},
        body : { info}
    } =  req
    console.log(emailId);
    console.log(info);
    

    const transporter = nodemailer.createTransport({
        host : "smtp.gmail.com",
        port : 465,
        secure : true,
        auth : {
            user : process.env.USER_ID,
            pass : `ckvx kfao qzib ocqq`
        }
    })

    transporter.sendMail({
        to : emailId,
        subject : "Your prescription",
        html : `<h1>${info}</h1>`
    }).then(function(){
        res.status(200).json({msg:"Email sent"})
        console.log("Email sent");
        
    }).catch(function(){
        res.status(400).json({msg:"Email not sent"})
    })

    // res.status(200).json({msg:"Email sent"})
}

module.exports = { sendMailToEmailId };