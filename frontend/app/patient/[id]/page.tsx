"use client"

import type React from "react"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { MessageSquare, Download, Mail, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function PatientProfilePage() {
  const { id } = useParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")

  // Mock patient data
  const patient = {
    id: id,
    name: "John Doe",
    age: 45,
    gender: "Male",
    bloodGroup: "A+",
    allergies: ["Penicillin", "Peanuts"],
    chronicConditions: ["Hypertension", "Type 2 Diabetes"],
    lastVisit: "2023-06-01",
    height: "175 cm",
    weight: "80 kg",
    bmi: "26.1",
    occupation: "Teacher",
    emergencyContact: "Jane Doe (Wife) - +1 234 567 8901",
    primaryCarePhysician: "Dr. Sarah Johnson",
    insuranceProvider: "HealthGuard Insurance",
    policyNumber: "HG123456789",
    lastLabWork: "2023-05-15",
    upcomingAppointment: "2023-07-10",
    vaccinationStatus: "Up to date",
    familyHistory: "Father: Hypertension, Mother: Type 2 Diabetes",
  }

  const caseHistory = [
    { id: "C001", diagnosis: "Influenza", lastUpdate: "2023-05-15", status: "Resolved" },
    { id: "C002", diagnosis: "Hypertension Follow-up", lastUpdate: "2023-06-01", status: "Ongoing" },
    { id: "C003", diagnosis: "Diabetes Management", lastUpdate: "2023-06-01", status: "Ongoing" },
  ]

  const [prescriptions, setPrescriptions] = useState([
    { id: "67c325274b854f514b39eef1", date: "2023-05-15", medicines: "Oseltamivir", dosage: "75mg twice daily", notes: "Take with food" },
    {
      id: "P002",
      date: "2023-06-01",
      medicines: "Lisinopril",
      dosage: "10mg once daily",
      notes: "Monitor blood pressure",
    },
    { id: "P003", date: "2023-06-01", medicines: "Metformin", dosage: "500mg twice daily", notes: "Take with meals" },
  ])

  const [newPrescription, setNewPrescription] = useState({
    date: "",
    medicines: "",
    dosage: "",
    notes: "",
  })

  const handleAddPrescription = (e: React.FormEvent) => {
    e.preventDefault()
    const newId = `P${String(prescriptions.length + 1).padStart(3, "0")}`
    setPrescriptions([...prescriptions, { id: newId, ...newPrescription }])
    setNewPrescription({ date: "", medicines: "", dosage: "", notes: "" })
  }

  const handleOpenChat = () => {
    router.push(`/patient/${id}/chat`)
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-primary">DocGPT</h1>
              <span className="text-xl font-semibold">Patient Profile</span>
            </div>
            <Avatar>
              <AvatarImage src="/placeholder.svg" alt="Doctor" />
              <AvatarFallback>DR</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <div className="p-6">
          <Card className="mb-6">
            <CardContent className="flex items-center space-x-4 p-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder.svg" alt={patient.name} />
                <AvatarFallback>
                  {patient.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{patient.name}</h2>
                <p className="text-muted-foreground">Patient ID: {patient.id}</p>
                <div className="mt-2 flex space-x-2">
                  <Badge>{patient.age} years old</Badge>
                  <Badge>{patient.gender}</Badge>
                  <Badge variant="outline">Blood Type: {patient.bloodGroup}</Badge>
                </div>
                <div className="mt-2">
                  <Badge variant="destructive">Allergies: {patient.allergies.join(", ")}</Badge>
                </div>
                <div className="mt-2">
                  <Badge variant="secondary">Chronic: {patient.chronicConditions.join(", ")}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="cases">Cases</TabsTrigger>
              <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Patient Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold">Personal Information</h3>
                      <p>Height: {patient.height}</p>
                      <p>Weight: {patient.weight}</p>
                      <p>BMI: {patient.bmi}</p>
                      <p>Occupation: {patient.occupation}</p>
                      <p>Emergency Contact: {patient.emergencyContact}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Medical Information</h3>
                      <p>Primary Care Physician: {patient.primaryCarePhysician}</p>
                      <p>Insurance Provider: {patient.insuranceProvider}</p>
                      <p>Policy Number: {patient.policyNumber}</p>
                      <p>Last Lab Work: {patient.lastLabWork}</p>
                      <p>Upcoming Appointment: {patient.upcomingAppointment}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="font-semibold">Additional Information</h3>
                    <p>Vaccination Status: {patient.vaccinationStatus}</p>
                    <p>Family History: {patient.familyHistory}</p>
                    <p>Last Visit: {patient.lastVisit}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="cases" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Case History</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Case ID</TableHead>
                        <TableHead>Diagnosis</TableHead>
                        <TableHead>Last Update</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {caseHistory.map((caseItem) => (
                        <TableRow key={caseItem.id}>
                          <TableCell>{caseItem.id}</TableCell>
                          <TableCell>{caseItem.diagnosis}</TableCell>
                          <TableCell>{caseItem.lastUpdate}</TableCell>
                          <TableCell>
                            <Badge variant={caseItem.status === "Ongoing" ? "default" : "secondary"}>
                              {caseItem.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              <div className="flex justify-end">
                <Button onClick={handleOpenChat}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Open AI Chat
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="prescriptions" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Prescription History</CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Prescription
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Prescription</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleAddPrescription} className="space-y-4">
                        <div>
                          <Label htmlFor="date">Date</Label>
                          <Input
                            id="date"
                            type="date"
                            value={newPrescription.date}
                            onChange={(e) => setNewPrescription({ ...newPrescription, date: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="medicines">Medicines</Label>
                          <Input
                            id="medicines"
                            value={newPrescription.medicines}
                            onChange={(e) => setNewPrescription({ ...newPrescription, medicines: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="dosage">Dosage</Label>
                          <Input
                            id="dosage"
                            value={newPrescription.dosage}
                            onChange={(e) => setNewPrescription({ ...newPrescription, dosage: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="notes">Notes</Label>
                          <Input
                            id="notes"
                            value={newPrescription.notes}
                            onChange={(e) => setNewPrescription({ ...newPrescription, notes: e.target.value })}
                          />
                        </div>
                        <Button type="submit">Add Prescription</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Prescription ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Medicines</TableHead>
                        <TableHead>Dosage</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {prescriptions.map((prescription) => (
                        <TableRow key={prescription.id}>
                          <TableCell>{prescription.id}</TableCell>
                          <TableCell>{prescription.date}</TableCell>
                          <TableCell>{prescription.medicines}</TableCell>
                          <TableCell>{prescription.dosage}</TableCell>
                          <TableCell>{prescription.notes}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Mail className="mr-2 h-4 w-4" />
                              Email
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

