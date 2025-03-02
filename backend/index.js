const mailRouter = require('./router/mailer')
const textPdfRouter = require("./router/text_pdf")

const dotenv = require('dotenv')
dotenv.config()
const prescriptionRouter = require("./router/prescription_router")
const patientRouter = require('./router/patient.router')
const caseRouter = require('./router/case.router')
const doctorRouter = require('./router/doctor.router')
const express = require('express')
const http = require('http')
const socketIo = require('socket.io')
const connectDB = require('./database')
const bodyParser = require('body-parser')
const cors = require('cors')
cors({
    origin:'http://localhost:3000',
    credentials:true,
})

const app = express()
const PORT = process.env.PORT || 8000
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// middleware
app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))

app.use("/api/v1" , mailRouter)
app.use("/api/v1" , textPdfRouter)
app.use("/api/v1/prescription" , prescriptionRouter)
app.use('/api/patient',patientRouter)
app.use('/api/cases',caseRouter)
app.use('/api/doctor',doctorRouter)

server.listen(PORT,()=>{
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
require("./socket/chat.socket")(io);
