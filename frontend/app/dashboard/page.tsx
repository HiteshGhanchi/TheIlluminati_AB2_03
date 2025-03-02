"use client"

// require("dotenv").config

import { useState , useEffect } from "react"
import { Bell, Search, Users, FileText, Pill, MessageSquare, Plus } from "lucide-react"
import axios from "axios";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { log } from "node:console";

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  // doctor use states
  const [doc_name , setDocName] = useState<string | null>(null);
  const [doctor_id , setDocId] = useState<string | null>(null);
  const [allPatientLen , setAllPatientLen] = useState(0)
  const [diagnoses , setDiagnoses] = useState(0)
  const [prescriptions , setPrescriptions] = useState(0)
  const [active , setActive] = useState(0)
  

  //Add Patient use states
  const [aadhar_id , setAadhaar] = useState("")
  const [name , setName] = useState("")
  const [phone , setPhone] = useState("")
  const [email , setEmail] = useState("")
  const [age , setAge] = useState(0)
  const [sex , setSex] = useState("Male")
  const [height , setHeight] = useState(0)
  const [weight , setWeight] = useState(0)
  // const [password , setPassword] = useState("")
  const [bmi, setBmi] = useState("");
  const [allergies, setAllergies] = useState(["", "", ""]); // Three allergy fields

  const notifications = [
    { type: "New", message: "New research paper on diabetes treatment" },
    { type: "Urgent", message: "Critical update for patient Amit Khanna" },
    { type: "Reminder", message: "Follow-up with Jane Smith scheduled" },
  ]

  const [patients , setPatients] = useState([
    { id: "67c325274b854f514b39eef1", name: "John Doe", age: 45, lastVisit: "2023-05-15", ongoingCases: 2 },
    { id: "P002", name: "Jane Smith", age: 32, lastVisit: "2023-06-01", ongoingCases: 1 },
    { id: "P003", name: "Bob Johnson", age: 58, lastVisit: "2023-05-28", ongoingCases: 3 },
  ])

  const filteredPatients = patients.filter(
    (patient) => patient.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handlePatientClick = (patientId: string) => {
    router.push(`/patient/${patientId}`)
  }
  // const [height, setHeight] = useState(""); // in cm
  // const [weight, setWeight] = useState(""); // in kg

  // Calculate BMI when height or weight changes
  const calculateBMI = (h, w) => {
    if (h && w) {
      const heightInMeters = h / 100;
      const bmiValue = (w / (heightInMeters * heightInMeters)).toFixed(2);
      setBmi(bmiValue);
    } else {
      setBmi("");
    }
  };

  const handleSubmit = async (e) => {
    // e.preventDefault();
    console.log(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/patient/`);
    
    try{
      const res = await axios.post(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/patient/`,{
        aadhar_id , 
        name,
        phone,
        email,
        age,
        sex,
        height,
        weight,
        bmi : calculateBMI(height , weight),
        allergies 
      })

      console.log(res);
      
    }catch(e){
      console.log(e);
    }
  }

  useEffect(() => {
    const storedDoctorId = localStorage.getItem("doctor_id");
    console.log(storedDoctorId);
    
    if (storedDoctorId) {
      setDocId(storedDoctorId);
    }
  }, []);


  useEffect(() => {
    if (doctor_id) {
      // console.log(doctor_id)
      axios
        .get(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/doctor/getDocById/${doctor_id}`)
        .then((res) => {
          console.log(res.data);
          setDocName(res.data?.data?.name);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [doctor_id])

  useEffect(() => {
    if(doctor_id){
      console.log(doctor_id);
      
      axios
        .get(`http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/patient/getAllPatients/${doctor_id}`)
        .then((res) => {
          console.log(res);
          setAllPatientLen(res.data?.data?.count);
          setDiagnoses(res.data?.data?.diagnoses);
          setPrescriptions(res.data?.data?.prescription);
          setActive(res.data?.data?.active);
          if(res.data?.data?.cases.length > 0){
            // setPatients(res.data?.data?.cases);
            setPatients(res.data?.data?.cases.map(i => [{name : i.patient_id.name , id : i.patient_id.aadhar_id, age : i.patient_id.age}]));
            console.log(res.data?.data?.cases.map(i => [{name : i.patient_id.name , id : i.patient_id.aadhar_id, age : i.patient_id.age}]));
            
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
    
  }, [doctor_id]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-primary">DocGPT</h1>
            <span className="text-xl">Hello, {doc_name}</span>
          </div>
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.map((notification, index) => (
                  <DropdownMenuItem key={index}>
                    <div className="flex items-start space-x-2">
                      <Badge variant={notification.type === "Urgent" ? "destructive" : "secondary"}>
                        {notification.type}
                      </Badge>
                      <p className="text-sm">{notification.message}</p>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Avatar>
              <AvatarImage src="/placeholder.svg" alt="Doctor" />
              <AvatarFallback>SJ</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="flex-1 p-6">
        {/* Quick Patient Search and Add New Patient */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex-1 max-w-md">
            <Input
              type="search"
              placeholder="Search patients by ID or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
              icon={<Search className="h-4 w-4 opacity-50" />}
            />
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="ml-4">
                <Plus className="mr-2 h-4 w-4" /> Add New Patient
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Patient</DialogTitle>
                <DialogDescription>Enter the details of the new patient here.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="aadhar" className="text-right">
                    Aadhar
                  </label>
                  <Input id="aadhar" className="col-span-3" onChange={(e) => setAadhaar(e.currentTarget.value)}/>
                </div>
                <div className="grid grid-cols-4 items-center gap-4" >
                  <label htmlFor="name" className="text-right">
                    Name
                  </label>
                  <Input id="name" className="col-span-3" onChange={(e)=> setName(e.currentTarget.value)}/>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="mobile" className="text-right">
                    Mobile No.
                  </label>
                  <Input id="mobile" className="col-span-3" onChange={(e)=> setPhone(e.currentTarget.value)}/>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="email" className="text-right">
                    Email
                  </label>
                  <Input id="email" type="email" className="col-span-3" onChange={(e)=> setEmail(e.currentTarget.value)}/>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="age" className="text-right">
                    Age
                  </label>
                  <Input id="age" type="number" className="col-span-3" onChange={(e)=> setAge(Number(e.currentTarget.value))}/>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="sex" className="text-right">
                    Sex
                  </label>
                  <select id="sex" className="col-span-3 form-select" onChange={(e)=> setSex(e.currentTarget.value)}>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                {/* Height */}
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="height" className="text-right">Height (cm)</label>
            <Input 
              id="height" 
              type="number" 
              className="col-span-3" 
              value={height}
              onChange={(e) => {
                setHeight(Number(e.target.value));
                calculateBMI(e.target.value, weight);
              }}
            />
          </div>
          {/* Weight */}
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="weight" className="text-right">Weight (kg)</label>
            <Input 
              id="weight" 
              type="number" 
              className="col-span-3" 
              value={weight}
              onChange={(e) => {
                setWeight(Number(e.target.value));
                calculateBMI(height, e.target.value);
              }}
            />
          </div>
          {/* BMI */}
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="bmi" className="text-right">BMI</label>
            <Input id="bmi" className="col-span-3" value={bmi} readOnly />
          </div>

                {/* Allergies */}
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right">Allergy 1</label>
            <Input 
              className="col-span-3"
              value={allergies[0]} 
              onChange={(e) => setAllergies([e.target.value, allergies[1], allergies[2]])} 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right">Allergy 2</label>
            <Input 
              className="col-span-3"
              value={allergies[1]} 
              onChange={(e) => setAllergies([allergies[0], e.target.value, allergies[2]])} 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right">Allergy 3</label>
            <Input 
              className="col-span-3"
              value={allergies[2]} 
              onChange={(e) => setAllergies([allergies[0], allergies[1], e.target.value])} 
            />
          </div>

              </div>
              <Button onClick={handleSubmit} type="submit">Add Patient</Button>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allPatientLen}</div>
              <p className="text-xs text-muted-foreground">+10% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{active}</div>
              <p className="text-xs text-muted-foreground">-5% from last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Consultations</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{diagnoses || 0}</div>
              <p className="text-xs text-muted-foreground">+20% from last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Prescriptions</CardTitle>
              <Pill className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{prescriptions}</div>
              <p className="text-xs text-muted-foreground">+5% from yesterday</p>
            </CardContent>
          </Card>
        </div>

        {/* Active Patient Cases */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Active Patient Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left">Patient ID</th>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Age</th>
                    <th className="px-4 py-2 text-left">Last Visit</th>
                    <th className="px-4 py-2 text-left">Ongoing Cases</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient) => (
                    <tr
                      key={patient.id}
                      className="border-b cursor-pointer hover:bg-gray-100"
                      onClick={() => handlePatientClick(patient.id)}
                    >
                      <td className="px-4 py-2">{patient.id}</td>
                      <td className="px-4 py-2">{patient.name}</td>
                      <td className="px-4 py-2">{patient.age}</td>
                      <td className="px-4 py-2">{patient.lastVisit}</td>
                      <td className="px-4 py-2">{patient.ongoingCases}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* AI Chat & Case Handling
        <Card>
          <CardHeader>
            <CardTitle>AI Chat & Case Handling</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <Input placeholder="Enter your medical query here..." />
              <Button>
                Get AI Insights
                <MessageSquare className="ml-2 h-4 w-4" />
              </Button>
              <div className="bg-muted p-4 rounded-md">
                <p className="text-sm text-muted-foreground">AI response will appear here...</p>
              </div>
            </div>
          </CardContent>
        </Card> */}
      </main>
    </div>
  )
}

