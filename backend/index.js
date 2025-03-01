const mailRouter = require("./router/mailer")
const textPdfRouter = require("./router/text_pdf")
// const dummyPrescriptionRoute = require("./router/create_prescription")
const dotenv = require('dotenv')
dotenv.config()

const express = require('express')
const connectDB = require('./database')
const bodyParser = require('body-parser')
const cors = require('cors')
cors({
    origin:'http://localhost:3000',
    credentials:true,
})

const app = express()
const PORT = process.env.PORT || 8000

// middleware
app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))

app.use("/api/v1" , mailRouter)
app.use("/api/v1" , textPdfRouter)
// app.use("/api/v1" , dummyPrescriptionRoute)


app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`)
})



// database connected
connectDB().then(()=>{
    console.log('Database connected')
}).catch(err=>{
    console.log(err)
})

app.get('/',(req,res)=>{
    res.send('Hello World')
})

// routes
const patientRouter = require('./router/patient.router')

app.use('/api/patient',patientRouter)