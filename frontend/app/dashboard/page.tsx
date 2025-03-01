"use client"

import { use, useState } from "react"
import { Bell, Search, Users, FileText, Pill, MessageSquare, Plus } from "lucide-react"

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

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  //Add Patient use states
  const [aadhaar_id , setAadhaar] = useState("")
  const [name , setName] = useState("")
  const [phone , setPhone] = useState("")
  const [email , setEmail] = useState("")
  const [age , setAge] = useState(0)
  const [sex , setSex] = useState("")
  const [allergy1 , setAllergy1] = useState("")
  const [allergy2 , setAllergy2] = useState("")
  const [allergy3 , setAllergy3] = useState("")
  const [height , setHeight] = useState(0)
  const [weight , setWeight] = useState(0)
  const [password , setPassword] = useState("")

  const notifications = [
    { type: "New", message: "New research paper on diabetes treatment" },
    { type: "Urgent", message: "Critical update for patient John Doe" },
    { type: "Reminder", message: "Follow-up with Jane Smith scheduled" },
  ]

  const patients = [
    { id: "P001", name: "John Doe", age: 45, lastVisit: "2023-05-15", ongoingCases: 2 },
    { id: "P002", name: "Jane Smith", age: 32, lastVisit: "2023-06-01", ongoingCases: 1 },
    { id: "P003", name: "Bob Johnson", age: 58, lastVisit: "2023-05-28", ongoingCases: 3 },
  ]

  const filteredPatients = patients.filter(
    (patient) =>
      patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handlePatientClick = (patientId: string) => {
    router.push(`/patient/${patientId}`)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-primary">DocGPT</h1>
            <span className="text-xl">Hello, Dr. Sarah Johnson</span>
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
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="allergies" className="text-right">
                    Allergies
                  </label>
                  <Input id="allergies" className="col-span-3"/>
                </div>
              </div>
              <Button onSubmit={() =>{}} type="submit">Add Patient</Button>
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
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">+10% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42</div>
              <p className="text-xs text-muted-foreground">-5% from last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Consultations</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">+20% from last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Prescriptions</CardTitle>
              <Pill className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
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
                  {filteredPatients.map((patient) => (
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

        {/* AI Chat & Case Handling */}
        {/* <Card>
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

